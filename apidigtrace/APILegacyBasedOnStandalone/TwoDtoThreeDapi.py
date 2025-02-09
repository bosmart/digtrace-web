import PIL.ExifTags
from PIL import Image
import glob
import difflib
import re
import sys
import TwoDtoThreeD as TDTD

sensor_size_db = {}

def calculate_focal(path):

    f = None
    images = glob.glob(path + '/*.jpg')
    if len(images) > 0:
        img = PIL.Image.open(images[0])
        exif_data = {
            PIL.ExifTags.TAGS[k]: v
            for k, v in img._getexif().items()
            if k in PIL.ExifTags.TAGS
        }
        width, height = img.size
        if exif_data.has_key('FocalPlaneXResolution'):
            # TODO: check if resize affects the value of FocalPlaneXResolution two tuples. if no, nothing to do otherwise add conditions here
            if width >= height:
                f = exif_data['FocalLength'][0] * exif_data['FocalPlaneXResolution'][0] / (
                            exif_data['FocalPlaneXResolution'][1] * 24.64)
            else:
                f = exif_data['FocalLength'][0] * exif_data['FocalPlaneXResolution'][0] / (
                            exif_data['FocalPlaneXResolution'][1] * 24.64)
        else:
            if max(width, height) > 3264:
                f = 1.2 * 3264
            else:
                f = 1.2 * max(width, height)
    return f

def has_numbers(input_list):
        for word in input_list:
            if bool(re.search(r'\d', word)):
                return word
        return None

# parse exif file to find a match in sensor size database
def check_sensor_size_in_database(path):
        images = glob.glob(path + '/*.jpg')
        if len(images) > 0:
            img = PIL.Image.open(images[0])
            # exif_data = img._getexif()
            exif_data = {
                PIL.ExifTags.TAGS[k]: v
                for k, v in img._getexif().items()
                if k in PIL.ExifTags.TAGS
            }
            print exif_data['Model']
            keywords = exif_data['Model'].split(' ') # keywords in the model string
            # try to find a strict match first
            model_split = exif_data['Model'].split(' ')
            if not model_split[0] == exif_data['Make']: # if the first word in model name is not the brand name
                model_name = exif_data['Make'] + " " + exif_data['Model']
            else:
                model_name = exif_data['Model']
            found = difflib.get_close_matches(model_name, sensor_size_db.keys(), n=1, cutoff=1)
            if not found == []:
                print found, sensor_size_db[found[0]]
                return sensor_size_db[found[0]]
            else: # if no strict match is found, sometimes because different naming format of the model
                model_number = has_numbers(keywords) # parse the model number out
                for entry in sensor_size_db.keys():
                    if exif_data['Make'].lower() in entry.lower(): # try to find in same brand
                        if not model_number == None:
                            if model_number.lower() in entry.lower():
                                print entry, sensor_size_db[entry]
                                return sensor_size_db[entry]
                    elif keywords[0].lower() in entry.lower(): # some make is not a single word, but contains in model[0]
                        if not model_number == None:
                            if model_number.lower() in entry.lower():
                                print entry, sensor_size_db[entry]
                                return sensor_size_db[entry]
                # cache camera that has no sensor size in the db

                return ""


def api_reconstruct_2dto3d(path, focal_length, downsize_flag, incremental_sfm, mesh_on, log=sys.stdout):
    if focal_length is None:
        output = check_sensor_size_in_database(path)
        if output == "":
            focal_length = calculate_focal(path)

    if downsize_flag:
        downsize_flag = "Yes"
    else:
        downsize_flag = ""

    if mesh_on:
        mesh_on = 1
    else:
        mesh_on = 0


    output_path = TDTD.generation_pipeline((path, focal_length, downsize_flag), incremental_sfm, mesh_on, log,
                                         threads_count=None, queue=None)
    return output_path


mesh_on = False # local
incremental_sfm = False # global
path = "/home/akanda/Dino2/"
focal_length = None
downsize_flag = False

api_reconstruct_2dto3d(path, focal_length, downsize_flag, incremental_sfm, mesh_on)
#
#
# mesh_on = False # local
# incremental_sfm = False # global
# path = "/home/akanda/Dino2/"
# focal_length = None
# downsize_flag = False
#
# api_reconstruct_2dto3d(path, focal_length, downsize_flag, incremental_sfm, mesh_on)
#
