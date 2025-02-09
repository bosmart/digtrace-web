import os
from API_akanda import util
import sys
from plyfile import PlyData
from API_akanda.SfM_GlobalPipeline import Global_pipeline
from API_akanda.SfM_SequentialPipeline import Sequential_pipeline
from API_akanda.pmvs_Piepline import PMVS_pipeline
from API_akanda.SurfaceRecon import surface
from shutil import copyfile

my_path = os.path.abspath(os.path.dirname(__file__))
pathGlobalPipeline = os.path.join(my_path, "SfM_GlobalPipeline.py")
pathSequentialPipeline = os.path.join(my_path, "SfM_SequentialPipeline.py")
pathPMVSPipeline = os.path.join(my_path, "pmvs_Piepline.py")


def api_all_steps_SfM_global_simple(input_dir, output_dir, force_focal_calc=False):
    if util.check_sensor_size_in_database(input_dir) < 1 or force_focal_calc:
        focal_len = str(util.calculate_focal(input_dir))
        Global_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len=focal_len).pipeline()

    else:
        Global_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len="in_db").pipeline()

    reconstruction_dir = os.path.join(output_dir, "reconstruction_global")
    # params = reconstruction_dir
    PMVS_pipeline(reconstruction_dir=reconstruction_dir).pipeline()

    print("save ply as binary")
    readpath = os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply")
    fname = os.path.basename(os.path.dirname(os.path.dirname(reconstruction_dir)))
    writepath = os.path.join(reconstruction_dir, "PMVS", "models", fname + ".ply")
    plydata = PlyData.read(str(readpath))
    plydata = PlyData([plydata['vertex']], text=False, byte_order='<')
    plydata.write(str(writepath))

    # sometimes ply generated but no data (comment copied from the legacy standalone software)
    filesize = os.path.getsize(str(writepath))
    if sys.version_info[0] < 3:
        if filesize < 2000:
            os.remove(writepath)
            print("file not generated. consider change the initial pair.")
            return ""
    else:
        if filesize < 2000:
            os.remove(writepath)
            print("file not generated. consider change the initial pair.")
            return ""

    generated_ply_path = writepath
    surface(input_file=generated_ply_path, output_dir=output_dir).PoissonRecon()
    return generated_ply_path


def api_all_steps_SfM_sequential_simple(input_dir, output_dir, force_focal_calc=False):
    if util.check_sensor_size_in_database(input_dir) < 1 or force_focal_calc:
        focal_len = str(util.calculate_focal(input_dir))
        Sequential_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len=focal_len).pipeline()

    else:
        Sequential_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len="in_db").pipeline()

    reconstruction_dir = os.path.join(output_dir, "reconstruction_sequential")
    # params = reconstruction_dir
    PMVS_pipeline(reconstruction_dir=reconstruction_dir).pipeline()

    print("save ply as binary")
    readpath = os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply")
    fname = os.path.basename(os.path.dirname(os.path.dirname(reconstruction_dir)))
    writepath = os.path.join(reconstruction_dir, "PMVS", "models", fname + ".ply")
    plydata = PlyData.read(str(readpath))
    plydata = PlyData([plydata['vertex']], text=False, byte_order='<')
    plydata.write(str(writepath))

    # sometimes ply generated but no data (comment copied from the legacy standalone software)
    filesize = os.path.getsize(str(writepath))
    if sys.version_info[0] < 3:
        if filesize < 2000:
            os.remove(writepath)
            print("file not generated. consider change the initial pair.")
            return ""
    else:
        if filesize < 2000:
            os.remove(writepath)
            print("file not generated. consider change the initial pair.")
            return ""

    generated_ply_path = writepath
    surface(input_file=generated_ply_path, output_dir=output_dir).PoissonRecon()
    return generated_ply_path


def _copy_ply(output_dir, path_dict):
    if not os.path.isdir(output_dir + '/plys'):
        os.mkdir(output_dir + '/plys')
        # os.path.join(reconstruction_dir, "PMVS", "models", fname + ".ply")
        # os.rename(src=os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply"), dst=output_dir + '/plys/' + 'full.ply')

    if path_dict['base_ply'] is not None:
        copyfile(src=path_dict['base_ply'], dst=output_dir + '/plys/' + 'main.ply')
    if path_dict['surfaced_ply'] is not None:
        copyfile(src=path_dict['surfaced_ply'], dst=output_dir + '/plys/' + 'surfaced.ply')
    if path_dict['surfaced_trimmed_ply'] is not None:
        copyfile(src=path_dict['surfaced_trimmed_ply'], dst=output_dir + '/plys/' + 'surfacetrimmed.ply')


def api_all_steps_SfM_global_all_params(input_dir, output_dir, force_focal_len_calc, focal_len, surface_recon,
                                        surface_recon_depth, poisson_recon_degree, surface_recon_colour,
                                        poisson_recon_sample_per_node, poisson_recon_density, ssd_recon_degree,
                                        surface_trim,
                                        surface_trim_trim_threshold, surface_trim_polygon_mesh, surface_trim_smooth):
    if util.check_sensor_size_in_database(input_dir) < 1 or force_focal_len_calc:
        focal_len = str(util.calculate_focal(input_dir))
        Global_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len=focal_len).pipeline()

    else:
        Global_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len="in_db").pipeline()

    reconstruction_dir = os.path.join(output_dir, "reconstruction_global")

    PMVS_pipeline(reconstruction_dir=reconstruction_dir).pipeline()

    path_recon = None
    path_recon_trimmed = None

    generated_ply_path = os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply")
    util.clean_diffuse_keyword_ply(generated_ply_path)
    # generated_pset_path = os.path.join(reconstruction_dir, "PMVS", "models","option-0000.pset")

    if surface_recon == 'PR':
        srfs = surface(input_file=generated_ply_path, output_dir=output_dir, depth=surface_recon_depth)
        path_recon = srfs.PoissonRecon(degree=poisson_recon_degree, samplesPerNode=poisson_recon_sample_per_node,
                                       density=poisson_recon_density, surface_recon_colour=surface_recon_colour)

        if surface_trim:
            path_recon_trimmed = srfs.SurfaceTrimmer(input_file=path_recon,
                                                     trim=surface_trim_trim_threshold,
                                                     smooth=surface_trim_smooth,
                                                     polygonMesh=surface_trim_polygon_mesh)


    elif surface_recon == 'SR':
        srfs = surface(input_file=generated_ply_path, output_dir=output_dir)
        path_recon = srfs.SSDRecon(degree=ssd_recon_degree, surface_recon_colour=surface_recon_colour)
        # if surface_trim:
        #     path_recon_trimmed=srfs.SurfaceTrimmer(
        #         input_file=path_recon,
        #         trim=surface_trim_trim_threshold, smooth=surface_trim_smooth, polygonMesh=surface_trim_polygon_mesh)
    try:
        if not os.path.isfile(generated_ply_path):
            generated_ply_path = None
    except Exception:
        pass
    try:
        if not os.path.isfile(path_recon):
            path_recon = None
    except:
        pass

    try:
        if not os.path.isfile(path_recon_trimmed):
            path_recon_trimmed = None
    except:
        pass

    path_dict = {
        'base_ply': generated_ply_path,
        'surfaced_ply': path_recon,
        'surfaced_trimmed_ply': path_recon_trimmed,

    }
    _copy_ply(output_dir, path_dict)
    # if not os.path.isdir(output_dir + '/plys'):
    #     os.mkdir(output_dir + '/plys')
    #     # os.path.join(reconstruction_dir, "PMVS", "models", fname + ".ply")
    # # os.rename(src=os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply"), dst=output_dir + '/plys/' + 'full.ply')
    #
    # if path_dict['base_ply'] is not None:
    #     copyfile(src=path_dict['base_ply'], dst=output_dir+'/plys/'+'main.ply')
    # if path_dict['surfaced_ply'] is not None:
    #     copyfile(src=path_dict['surfaced_ply'], dst=output_dir+'/plys/'+'surfaced.ply')
    # if path_dict['surfaced_trimmed_ply'] is not None:
    #     copyfile(src=path_dict['surfaced_trimmed_ply'], dst=output_dir+'/plys/'+'surfacetrimmed.ply')

    return path_dict


def api_all_steps_SfM_sequential_all_params(input_dir, output_dir, force_focal_len_calc, focal_len, surface_recon,
                                            surface_recon_depth, surface_recon_colour, poisson_recon_degree,
                                            poisson_recon_sample_per_node, poisson_recon_density, ssd_recon_degree,
                                            surface_trim,
                                            surface_trim_trim_threshold, surface_trim_polygon_mesh,
                                            surface_trim_smooth):
    if util.check_sensor_size_in_database(input_dir) < 1 or force_focal_len_calc:
        focal_len = str(util.calculate_focal(input_dir))
        Sequential_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len=focal_len).pipeline()

    else:
        Sequential_pipeline(input_dir=input_dir, output_dir=output_dir, focus_len="in_db").pipeline()

    reconstruction_dir = os.path.join(output_dir, "reconstruction_sequential")

    PMVS_pipeline(reconstruction_dir=reconstruction_dir).pipeline()
    path_recon = None
    path_recon_trimmed = None

    generated_ply_path = os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply")

    util.clean_diffuse_keyword_ply(generated_ply_path)

    # generated_pset_path = os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.pset")

    if surface_recon == 'PR':
        srfs = surface(input_file=generated_ply_path, output_dir=output_dir, depth=surface_recon_depth)
        path_recon = srfs.PoissonRecon(degree=poisson_recon_degree, samplesPerNode=poisson_recon_sample_per_node,
                                       density=poisson_recon_density)
        #

        if surface_trim:
            path_recon_trimmed = srfs.SurfaceTrimmer(input_file=path_recon,
                                                     trim=surface_trim_trim_threshold,
                                                     smooth=surface_trim_smooth,
                                                     polygonMesh=surface_trim_polygon_mesh)


    elif surface_recon == 'SR':
        srfs = surface(input_file=generated_ply_path, output_dir=output_dir)
        path_recon = srfs.SSDRecon(degree=ssd_recon_degree)
        # if surface_trim:
        #     path_recon_trimmed=srfs.SurfaceTrimmer(
        #         input_file=path_recon,
        #         trim=surface_trim_trim_threshold, smooth=surface_trim_smooth, polygonMesh=surface_trim_polygon_mesh)
    try:
        if not os.path.isfile(generated_ply_path):
            generated_ply_path = None
    except:
        pass
    try:
        if not os.path.isfile(path_recon):
            path_recon = None
    except:
        pass

    try:
        if not os.path.isfile(path_recon_trimmed):
            path_recon_trimmed = None
    except:
        pass

    path_dict = {
        'base_ply': generated_ply_path,
        'surfaced_ply': path_recon,
        'surfaced_trimmed_ply': path_recon_trimmed,

    }

    _copy_ply(output_dir, path_dict)

    return path_dict


# print ("save ply as binary")
# readpath = os.path.join(reconstruction_dir, "PMVS", "models", "option-0000.ply")
# fname = os.path.basename(os.path.dirname(os.path.dirname(reconstruction_dir)))
# writepath = os.path.join(reconstruction_dir, "PMVS", "models", fname + ".ply")
# plydata = PlyData.read(str(readpath))
# plydata = PlyData([plydata['vertex']], text=False, byte_order='<')
# plydata.write(str(writepath))
#
# # sometimes ply generated but no data (comment copied from the legacy standalone software)
# filesize = os.path.getsize(str(writepath))
# if sys.version_info[0] < 3:
#     if filesize < 2000:
#         os.remove(writepath)
#         print ("file not generated. consider change the initial pair.")
#         return ""
# else:
#     if filesize < 2000:
#         os.remove(writepath)
#         print ("file not generated. consider change the initial pair.")
#         return ""
#
# generated_ply_path = writepath
# path_recon = None
# path_recon_trimmed = None
#
# if surface_recon == 'PR':
#     srfs = surface(input_file=generated_ply_path, output_dir=output_dir, depth=surface_recon_depth)
#     path_recon = srfs.PoissonRecon(degree=poisson_recon_degree, samplesPerNode=poisson_recon_sample_per_node,
#                                    density=poisson_recon_density)
#     if surface_trim:
#         path_recon_trimmed = srfs.SurfaceTrimmer(input_file=path_recon,
#                                                  trim=surface_trim_trim_threshold,
#                                                  smooth=surface_trim_smooth,
#                                                  polygonMesh=surface_trim_polygon_mesh)
#
#
# elif surface_recon == 'SR':
#     srfs = surface(input_file=generated_ply_path, output_dir=output_dir)
#     path_recon = srfs.SSDRecon(degree=ssd_recon_degree)
#     if surface_trim:
#         path_recon_trimmed = srfs.SurfaceTrimmer(
#             input_file=path_recon,
#             trim=surface_trim_trim_threshold, smooth=surface_trim_smooth, polygonMesh=surface_trim_polygon_mesh)
#
# path_dict = {
#     'base_ply': generated_ply_path,
#     'surfaced_ply': path_recon,
#     'surfaced_trimmed_ply': path_recon_trimmed,
#
# }
#
# return path_dict


# api_all_steps_SfM_sequential_simple('/home/akanda/dinoTestNew/input/','/home/akanda/dinoTestNew/output_sequential2/')
# api_all_steps_SfM_global('/home/akanda/dinoTestNew/input/','/home/akanda/dinoTestNew/output_global/')


def test_api_all_steps_SfM_global_all_params(input_dir, output_dir, force_focal_len_calc, focal_len, surface_recon,
                                             surface_recon_depth, poisson_recon_degree, surface_recon_colour,
                                             poisson_recon_sample_per_node, poisson_recon_density, ssd_recon_degree,
                                             surface_trim,
                                             surface_trim_trim_threshold, surface_trim_polygon_mesh,
                                             surface_trim_smooth):
    #
    import time
    time.sleep(10)

    path_dict = {
        'base_ply': '/home/akanda/JobTest/1_97/outputs/49/plys/main.ply',
        'surfaced_ply': '/home/akanda/JobTest/1_97/outputs/49/plys/surfaced.ply',
        'surfaced_trimmed_ply': '/home/akanda/JobTest/1_97/outputs/49/plys/surfacetrimmed.ply',

    }

    _copy_ply(output_dir, path_dict)

    # path_dict = output_dir+'/plys'

    return path_dict


def test_api_all_steps_SfM_sequential_all_params(input_dir, output_dir, force_focal_len_calc, focal_len, surface_recon,
                                                 surface_recon_depth, surface_recon_colour, poisson_recon_degree,
                                                 poisson_recon_sample_per_node, poisson_recon_density, ssd_recon_degree,
                                                 surface_trim,
                                                 surface_trim_trim_threshold, surface_trim_polygon_mesh,
                                                 surface_trim_smooth):
    import time
    time.sleep(10)

    path_dict = {
        'base_ply': '/home/akanda/JobTest/1_97/outputs/49/plys/main.ply',
        'surfaced_ply': '/home/akanda/JobTest/1_97/outputs/49/plys/surfaced.ply',
        'surfaced_trimmed_ply': '/home/akanda/JobTest/1_97/outputs/49/plys/surfacetrimmed.ply',

    }

    _copy_ply(output_dir, path_dict)

    return path_dict
