from PIL import Image
import PIL.ExifTags
import re
import os

CAMERA_SENSOR_WIDTH_DIRECTORY = "SensorDB/"
camera_file_params_DB = os.path.join(CAMERA_SENSOR_WIDTH_DIRECTORY, "sensor_width_camera_database.txt")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
camera_file_params_DB = os.path.join(BASE_DIR, camera_file_params_DB)


def calculate_focal(path):
    from PIL import Image
    import PIL.ExifTags

    f = None
    images = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith('.JPG') or file.endswith('.jpg'):
                images.append(file)

    if len(images) > 0:
        img = PIL.Image.open(path + images[0])
        exif_data = {
            PIL.ExifTags.TAGS[k]: v
            for k, v in img._getexif().items()
            if k in PIL.ExifTags.TAGS
        }
        width, height = img.size
        if 'FocalPlaneXResolution' in exif_data:
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


def _has_numbers(input_list):
    for word in input_list:
        if bool(re.search(r'\d', word)):
            return word
    return None


# parse exif file to find a match in sensor size database
def check_sensor_size_in_database(path):
    images = []
    output = 1
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith('.JPG') or file.endswith('.jpg'):
                images.append(file)

        if len(images) > 0:
            for image in images:
                img = PIL.Image.open(path + image)
                # exif_data = img._getexif()
                exif_data = {
                    PIL.ExifTags.TAGS[k]: v
                    for k, v in img._getexif().items()
                    if k in PIL.ExifTags.TAGS
                }
                output = open(camera_file_params_DB, 'r').read().find(exif_data['Model'])
                if output < 0:
                    return output
        return output


def clean_diffuse_keyword_ply(ply):
    infile = ply
    outfile = ply

    # delete_list = ["diffuse_"]
    fin = open(infile, encoding='utf-8')

    lines = fin.read()
    fin.close()

    lines = re.sub('diffuse_', '', lines)
    fout = open(outfile, "w+")
    # lines +=1
    fout.write(lines)
    fout.close()

    return ply
