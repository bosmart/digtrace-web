#!/usr/bin/python
# ! -*- encoding: utf-8 -*-

# This file is part of OpenMVG (Open Multiple View Geometry) C++ library.

# Python script to launch OpenMVG SfM tools on an image dataset
#
# usage : python tutorial_demo.py
#

# Indicate the openMVG binary directory
OPENMVG_SFM_BIN = "/home/akanda/openMVG_Build/Linux-x86_64-RELEASE"

# Indicate the openMVG camera sensor width directory
CAMERA_SENSOR_WIDTH_DIRECTORY = "/home/akanda/openMVG/src/software/SfM" + "/../../openMVG/exif/sensor_width_database"

import os
import subprocess
import sys


def get_parent_dir(directory):
    return os.path.dirname(directory)


os.chdir(os.path.dirname(os.path.abspath(__file__)))
input_eval_dir = os.path.abspath("./ImageDataset_SceauxCastle")
# Checkout an OpenMVG image dataset with Git
if not os.path.exists(input_eval_dir):
    pImageDataCheckout = subprocess.Popen(["git", "clone", "https://github.com/openMVG/ImageDataset_SceauxCastle.git"])
    pImageDataCheckout.wait()

output_eval_dir = os.path.join(get_parent_dir(input_eval_dir), "tutorial_out")
input_eval_dir = os.path.join(input_eval_dir, "images")
if not os.path.exists(output_eval_dir):
    os.mkdir(output_eval_dir)

input_dir = input_eval_dir
output_dir = output_eval_dir
print("Using input dir  : ", input_dir)
print("      output_dir : ", output_dir)

matches_dir = os.path.join(output_dir, "matches")
camera_file_params = os.path.join(CAMERA_SENSOR_WIDTH_DIRECTORY, "sensor_width_camera_database.txt")

# Create the ouput/matches folder if not present
if not os.path.exists(matches_dir):
    os.mkdir(matches_dir)

print("1. Intrinsics analysis")
pIntrisics = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_SfMInit_ImageListing"), "-i", input_dir, "-o", matches_dir, "-d",
     camera_file_params, "-c", "3"])
pIntrisics.wait()

print("2. Compute features")
pFeatures = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeFeatures"), "-i", matches_dir + "/sfm_data.json", "-o",
     matches_dir, "-m", "SIFT", "-f", "1"])
pFeatures.wait()

print("2. Compute matches")
pMatches = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeMatches"), "-i", matches_dir + "/sfm_data.json", "-o",
     matches_dir, "-f", "1", "-n", "ANNL2"])
pMatches.wait()

reconstruction_dir = os.path.join(output_dir, "reconstruction_sequential")
print("3. Do Incremental/Sequential reconstruction")  # set manually the initial pair to avoid the prompt question
pRecons = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_IncrementalSfM"), "-i", matches_dir + "/sfm_data.json", "-m",
     matches_dir, "-o", reconstruction_dir])
pRecons.wait()

print("5. Colorize Structure")
pRecons = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeSfM_DataColor"), "-i", reconstruction_dir + "/sfm_data.bin",
     "-o", os.path.join(reconstruction_dir, "colorized.ply")])
pRecons.wait()

print("4. Structure from Known Poses (robust triangulation)")
pRecons = subprocess.Popen([os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeStructureFromKnownPoses"), "-i",
                            reconstruction_dir + "/sfm_data.bin", "-m", matches_dir, "-o",
                            os.path.join(reconstruction_dir, "robust.ply")])
pRecons.wait()

# Reconstruction for the global SfM pipeline
# - global SfM pipeline use matches filtered by the essential matrices
# - here we reuse photometric matches and perform only the essential matrix filering
print("2. Compute matches (for the global SfM Pipeline)")
pMatches = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeMatches"), "-i", matches_dir + "/sfm_data.json", "-o",
     matches_dir, "-r", "0.8", "-g", "e"])
pMatches.wait()

reconstruction_dir = os.path.join(output_dir, "reconstruction_global")
print("3. Do Global reconstruction")
pRecons = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_GlobalSfM"), "-i", matches_dir + "/sfm_data.json", "-m", matches_dir,
     "-o", reconstruction_dir])
pRecons.wait()

print("5. Colorize Structure")
pRecons = subprocess.Popen(
    [os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeSfM_DataColor"), "-i", reconstruction_dir + "/sfm_data.bin",
     "-o", os.path.join(reconstruction_dir, "colorized.ply")])
pRecons.wait()

print("4. Structure from Known Poses (robust triangulation)")
pRecons = subprocess.Popen([os.path.join(OPENMVG_SFM_BIN, "openMVG_main_ComputeStructureFromKnownPoses"), "-i",
                            reconstruction_dir + "/sfm_data.bin", "-m", matches_dir, "-o",
                            os.path.join(reconstruction_dir, "robust.ply")])
pRecons.wait()
