__author__ = 'shujiedeng'
__author__ = 'akanda'

import os
import multiprocessing
from plyfile import PlyData
import PIL
from PIL import Image
import glob
import psutil
import sys

if os.name == 'posix' and sys.version_info[0] < 3:
    import subprocess32  as subprocess
else:
    import subprocess

import sys
import time


# OPENMVG_SFM_BIN = "lib/WIN"
OPENMVG_SFM_BIN = "lib/Unix"

CAMERA_SENSOR_WIDTH_DIRECTORY = "SensorDB/"

#TIMEOUT_VALUE=TIMEOUT_VALUE # timeout of 1 hour per step
TIMEOUT_VALUE=None  # no timeouts


# MAIN GENERATION PIPELINE / PROCESS

def generation_pipeline((fname, focal_length, downsize_flag), incremental_sfm, mesh_on, log, threads_count, queue):
    startTime = time.time()

    generated_ply_path = ""
    skip = False #set to false if don't want to skip the whole generation process

    try:

        # setting import and export directories based on the import folder
        input_eval_dir = fname
        output_eval_dir = os.path.join(input_eval_dir, "outputs")
        if not os.path.exists(output_eval_dir):
            os.mkdir(output_eval_dir)

        # if downsize_flag set, downsize to 3264, save in fname/resize
        if downsize_flag == "Yes":
            input_dir, width, height = downsizeImages(fname)
        else:
            input_dir = input_eval_dir
            width, height = None, None



        output_dir = os.path.join(output_eval_dir, "result.nvm")
        print ("Using input dir  : ", input_dir)
        print ("      output_dir : ", output_eval_dir)

        camera_file_params = os.path.join(CAMERA_SENSOR_WIDTH_DIRECTORY, "sensor_width_camera_database.txt")

        matches_dir = os.path.join(output_eval_dir, "matches")
        if not os.path.exists(matches_dir):
            os.mkdir(matches_dir)



        if skip: #skip photogrammetry
            # automatically return generated path
            if incremental_sfm:
                reconstruction_dir = os.path.join(output_eval_dir, "reconstruction_sequential")
            else:
                reconstruction_dir = os.path.join(output_eval_dir,"reconstruction_global")

            generated_ply_path = os.path.join(reconstruction_dir, "PMVS", "models", os.path.basename(fname) + ".ply")


        else: # run photogrammetry

            #to deactivate console window
            if os.name != 'posix':
                startupinfo = subprocess.STARTUPINFO()
                startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

            print ("1. Intrinsics analysis")
            if focal_length == None:
                pIntrisics = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_SfMInit_ImageListing"),  "-i", input_dir, "-o", matches_dir, "-d", camera_file_params, "-c", "3"], stdout=sys.stdout, stderr=sys.stdout  )
            else:
                if downsize_flag == "":  #not resize_flag
                    pIntrisics = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_SfMInit_ImageListing"),  "-i", input_dir, "-o", matches_dir, "-d", camera_file_params, "-c", "3", "-f", str(focal_length)], stdout=sys.stdout, stderr=sys.stdout  )
                else:
                    k = str(focal_length) + ";0;" + str(width/2.0) + ";0;" + str(focal_length) + ";" + str(height/2.0) + ";0;0;1"   #"f;0;ppx; 0;f;ppy; 0;0;1"
                    pIntrisics = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_SfMInit_ImageListing"),  "-i", input_dir, "-o", matches_dir, "-d", camera_file_params, "-c", "3", "-k", k], stdout=sys.stdout, stderr=sys.stdout  )
            # log(pIntrisics)
            try:
                pIntrisics.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 100
            except subprocess.TimeoutExpired:
                kill(pIntrisics.pid)
                print "step 1 killed because of timeout"
                return ""


            print ("2. Compute features")
            pFeatures = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeFeatures"),  "-i", os.path.join(matches_dir,"sfm_data.json"), "-o", matches_dir, "-m", "SIFT", "-f" , "1"], stdout=subprocess.PIPE, stderr=sys.stdout)

            try:

                pFeatures.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 300
            except subprocess.TimeoutExpired:
                kill(pFeatures.pid)
                print "step 2 killed because of timeout"
                return ""

            # status_bar.SetValue(20)

            if not incremental_sfm: #global_sfm

                print ("3. Compute matches")
                start_time = time.time()
                pMatches = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeMatches"),  "-i", os.path.join(matches_dir,"sfm_data.json"), "-o", matches_dir, "-g", "e", "-f", "1"], stdout=sys.stdout, stderr=sys.stdout)

                try:
                    pMatches.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 900
                except subprocess.TimeoutExpired:
                    
                    
                    kill(pMatches.pid)
                    print "step 3 killed because of timeout"
                    return ""




                reconstruction_dir = os.path.join(output_eval_dir,"reconstruction_global")

                print('Elapsed time for step 3: %f seconds' % (time.time() - start_time))

                print ("4. Do Global reconstruction")
                pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_GlobalSfM"),  "-i", os.path.join(matches_dir,"sfm_data.json"), "-m", matches_dir, "-o", reconstruction_dir], stdout=sys.stdout, stderr=sys.stdout)

                try:
                    pRecons.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 900
                except subprocess.TimeoutExpired:
                    kill(pRecons.pid)
                    print "step 4 killed because of timeout"
                    return ""


            else: # incremental_sfm

                print ("3. Compute matches")
                pMatches = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeMatches"),  "-i", os.path.join(matches_dir,"sfm_data.json"), "-o", matches_dir, "-f", "1"], stdout=sys.stdout, stderr=sys.stdout)
                try:
                    pMatches.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 900
                except subprocess.TimeoutExpired:
                    kill(pMatches.pid)
                    print "step 3 killed because of timeout"
                    return ""



                reconstruction_dir = os.path.join(output_eval_dir, "reconstruction_sequential")
                step4_success = False
                while not step4_success:
                    try:
                        print ("4. Do Incremental/Sequential reconstruction")
                        #set manually the initial pair to avoid the prompt question
                        # list = glob.glob(os.path.join(input_dir, "*.jpg"))
                        # if len(list) >= 2:
                            # print os.path.basename(list[0])
                        pReco = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_IncrementalSfM"),  "-i", os.path.join(matches_dir,"sfm_data.json"), "-m", matches_dir, "-o", reconstruction_dir], stdout=sys.stdout, stderr=sys.stdout)
                        pReco.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 900
                    except subprocess.TimeoutExpired:
                        kill(pReco.pid)
                        # printSubprocessInfo(pReco)
                        print "step 4 killed because of timeout"
                        continue
                    step4_success = True


            print ("5. Colorize Structure")
            pColor = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeSfM_DataColor"),  "-i", os.path.join(reconstruction_dir,"sfm_data.bin"), "-o", os.path.join(reconstruction_dir,"colorized.ply")], stdout=sys.stdout, stderr=subprocess.PIPE )
            try:
                stdout, stderr = pColor.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 300
                if 'sfm_data.json" cannot be read' in stderr:
                    print stderr
                    return ""
            except subprocess.TimeoutExpired:
                kill(pColor.pid)
                print "step 5 killed because of timeout"
                return ""


            print ("6. Structure from Known Poses (robust triangulation)")
            pTriang = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeStructureFromKnownPoses"),  "-i", os.path.join(reconstruction_dir,"sfm_data.bin"), "-m", matches_dir, "-o", os.path.join(reconstruction_dir,"robust.ply")], stdout=sys.stdout, stderr=sys.stdout)
            try:
                pTriang.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 300
            except subprocess.TimeoutExpired:
                kill(pTriang.pid)
                print "step 6 killed because of timeout"
                return ""


            # MVE is slower, generates mesh and does not generate holes
            # PMVS is faster but no mesh and can generate holes
            if mesh_on == 0:
                generated_ply_path = dense_cloud_PMVS(reconstruction_dir)
            else:
                generated_ply_path = dense_cloud_MVE(reconstruction_dir)
            # downsampling(reconstruction_dir)
            # generated_ply_path = os.path.join(reconstruction_dir, "MVE", "mve_output_mesh_clean.ply")  #bun_zipper_res4
            # generated_ply_path = os.path.join(output_eval_dir, "result.0.ply")

        if not os.path.exists(generated_ply_path):
            generated_ply_path = ""


        # redirect stdout to console
        # sys.stdout = sys.__stdout__
        # redirect stdout to logfile

        endTime = time.time()
        print("Elapsed total time:")
        print(endTime - startTime)

        sys.stdout = log

        return generated_ply_path
    # except:
    #     return ""
    except Exception as ex:
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(ex).__name__, ex.args)
        print message
#this is not used at the moment
def dense_cloud_MVE(reconstruction_dir):
    # to deactivate console window
    if os.name != 'posix':
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

    resolution = 2
    print ("7. convert the openMVG SfM scene to the MVE format")
    pConvert = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_openMVG2MVE2"),  "-i", os.path.join(reconstruction_dir,"sfm_data.bin"), "-o", reconstruction_dir], stdout=sys.stdout, stderr=sys.stdout)
    try:
        pConvert.wait(timeout=TIMEOUT_VALUE) #original timeout value: 300
    except subprocess.TimeoutExpired:
        kill(pConvert.pid)
        print "step 7 killed because of timeout"
        return ""


    print("8. ------------ generate dense cloud points ------------------")
    print("dmrecon")
    # dmrecon -s$resolution $directory
    pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "dmrecon"),  "-s"+str(resolution), os.path.join(reconstruction_dir, "mve")], stdout=sys.stdout, stderr=sys.stdout )
    try:
        pRecons.wait(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 8 killed because of timeout"
        return ""

    print("scene2pset")
    # scene2pset -ddepth-L$resolution -iundist-L$resolution -n -s -c $directory $directory/OUTPUT.ply
    #pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "scene2pset"),  "-ddepth-L"+str(resolution), "-iundist-L"+str(resolution), "-s", os.path.join(reconstruction_dir, "mve"), os.path.join(reconstruction_dir, "mve", "mve_output.ply")], stdout=sys.stdout, stderr=sys.stdout )
    pRecons = subprocess.Popen(
        [os.path.join(OPENMVG_SFM_BIN, "scene2pset"), "-ddepth-L" + str(resolution), "-iundist-L" + str(resolution),
         "-s", os.path.join(reconstruction_dir, "mve"),"-F0", os.path.join(reconstruction_dir, "mve", "mve_output0.ply")],
        stdout=sys.stdout, stderr=sys.stdout)
    try:
        pRecons.wait(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 8 killed because of timeout"
        return ""

    pRecons = subprocess.Popen(
        [os.path.join(OPENMVG_SFM_BIN, "scene2pset"), "-ddepth-L" + str(resolution), "-iundist-L" + str(resolution),
         "-s", os.path.join(reconstruction_dir, "mve"),"-F1", os.path.join(reconstruction_dir, "mve", "mve_output1.ply")],
        stdout=sys.stdout, stderr=sys.stdout)
    try:
        pRecons.wait(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 8 killed because of timeout"
        return ""

    pRecons = subprocess.Popen(
        [os.path.join(OPENMVG_SFM_BIN, "scene2pset"), "-ddepth-L" + str(resolution), "-iundist-L" + str(resolution),
         "-s", os.path.join(reconstruction_dir, "mve"),"-F2", os.path.join(reconstruction_dir, "mve", "mve_output2.ply")],
        stdout=sys.stdout, stderr=sys.stdout)
    try:
        pRecons.wait(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 8 killed because of timeout"
        return ""

    pRecons = subprocess.Popen(
        [os.path.join(OPENMVG_SFM_BIN, "scene2pset"), "-ddepth-L" + str(resolution), "-iundist-L" + str(resolution),
         "-s", os.path.join(reconstruction_dir, "mve"),"-F3", os.path.join(reconstruction_dir, "mve", "mve_output3.ply")],
        stdout=sys.stdout, stderr=sys.stdout)
    try:
        pRecons.wait(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 8 killed because of timeout"
        return ""

    print("9. ------------ triangulate mesh ------------------")
    print("fssrecon")
    # fssrecon $directory/OUTPUT.ply $directory/OUTPUT_MESH.ply
    pFSSRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "fssrecon"),
                                      os.path.join(reconstruction_dir, "mve", "mve_output0.ply"),
                                      os.path.join(reconstruction_dir, "mve", "mve_output1.ply"),
                                      os.path.join(reconstruction_dir, "mve", "mve_output2.ply"),
                                      os.path.join(reconstruction_dir, "mve", "mve_output3.ply"),
                                      os.path.join(reconstruction_dir, "mve", "mve_output_mesh.ply")], stdout=sys.stdout, stderr=sys.stdout )
    try:
        pFSSRecons.wait(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pFSSRecons.pid)
        print "step 9/1 killed because of timeout"
        return ""


    print("meshclean")
    # meshclean $directory/OUTPUT_MESH.ply $directory/OUTPUT_MESH_CLEAN.ply
    pMesh = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "meshclean"), os.path.join(reconstruction_dir, "mve", "mve_output_mesh.ply"), os.path.join(reconstruction_dir, "mve", "mve_output_mesh_clean.ply")], stdout=sys.stdout, stderr=sys.stdout )
    try:
        pMesh.wait(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pMesh.pid)
        print "step 9/2 killed because of timeout"
        return ""

    generated_ply_path = os.path.join(reconstruction_dir, "MVE", "mve_output_mesh_clean.ply")
    return generated_ply_path

def dense_cloud_PMVS(reconstruction_dir):
    # to deactivate console window
    if os.name != 'posix':
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

    # openMVG_main_openMVG2PMVS -i Dataset/outReconstruction/sfm_data.json -o Dataset/outReconstruction
    print ("7. convert the openMVG SfM scene to the PMVS format")
    pConvert = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_openMVG2PMVS"),  "-i", os.path.join(reconstruction_dir,"sfm_data.bin"), "-o", reconstruction_dir], stdout=sys.stdout, stderr=sys.stdout)
    try:
        pConvert.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 300
    except subprocess.TimeoutExpired:
        kill(pConvert.pid)
        print "step 7 killed because of timeout"
        return ""


    print("8. ------------ generate dense cloud points using PMVS ------------------")
    print "$ cmvs /Pictures/result.nvm.cmvs/00/ 50 12"
    pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "cmvs"), os.path.join(reconstruction_dir, "PMVS/"), "50", "12"], stdout=sys.stdout, stderr=sys.stdout )
    try:
        pRecons.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 100
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 8 killed because of timeout"
        return ""


    pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "genOption"), os.path.join(reconstruction_dir, "PMVS/")], stdout=sys.stdout, stderr=sys.stdout )
    try:
        pRecons.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 500
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 9 killed because of timeout"
        return ""



    print "$ pmvs2 /Pictures/result.nvm.cmvs/00/ option-0000"
    pRecons = subprocess.Popen( [os.path.join(OPENMVG_SFM_BIN, "pmvs2"), os.path.join(reconstruction_dir, "PMVS/"), "option-0000"], stdout=sys.stdout, stderr=subprocess.PIPE  )
    try:

        pRecons.communicate(timeout=TIMEOUT_VALUE) #original timeout value: 1200
    except subprocess.TimeoutExpired:
        kill(pRecons.pid)
        print "step 10 killed because of timeout"
        return ""


    print "save ply as binary"
    readpath = os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply")
    fname = os.path.basename(os.path.dirname(os.path.dirname(reconstruction_dir)))
    writepath = os.path.join(reconstruction_dir, "PMVS", "models", fname + ".ply")
    plydata = PlyData.read(str(readpath))
    plydata = PlyData([plydata['vertex']], text=False, byte_order='<')
    plydata.write(str(writepath))

    # sometimes ply generated but no data
    filesize = os.path.getsize(str(writepath))
    if filesize < 2000L:
        os.remove(writepath)
        print "file not generated. consider change the initial pair."
        return ""

    generated_ply_path = writepath
    return generated_ply_path


#     pDownsample.wait()

# downsizing the image to the default size. To check how exactly the downsizing works (sampling?)
def downsizeImages(path):
    # if resize folder exists, check if downsized images exists, if yes, break
    images = glob.glob(path + '/*.jpg')
    resize_path = os.path.join(path, "resize")
    if len(images) > 0:
        if os.path.exists(resize_path):
            images_resize = glob.glob(resize_path + '/*.jpg')
            if len(images) == len(images_resize):
                img0 = PIL.Image.open(images_resize[0])
                width, height = img0.size
                img0.close()
                return resize_path, width, height
            else: # delete existed images then re-resizing pictures
                map(os.unlink, (os.path.join(resize_path, f) for f in os.listdir(resize_path)))

        #when resize_path doesn't exist or resize directory is cleared up
        img0 = PIL.Image.open(images[0])
        width, height = img0.size
        img0.close()
        if max(width, height) > 3264: #this is the default max value for width, found by Shujie empirically
            if not os.path.exists(resize_path):
                os.makedirs(resize_path)
            ratio = 3264.0 / max(width, height) # TODO: define 3264 as a variable, also appears in calculate_focal() in photogramemtry
            print ratio
            for i, image in enumerate(images):
                im = Image.open(image)
                new_size = int(width * ratio), int(height * ratio)
                im.thumbnail(new_size, Image.ANTIALIAS)
                exif = im.info['exif']
                im.save(os.path.join(resize_path, str(i) + ".jpg"), 'JPEG', exif=exif)
            return resize_path, new_size[0], new_size[1]
    return path, None, None

def kill(proc_pid):
    process = psutil.Process(proc_pid)
    for proc in process.children(recursive=True):
        proc.kill()
    process.kill()

def log(proc):
    # print
    while True:
        line = proc.stdout.readline()
        if line.strip() == "":
            pass
        else:
            # print line.strip()
            sys.stdout.write(line.strip()+'\n')
        # if not line: break
        if not line: return True

