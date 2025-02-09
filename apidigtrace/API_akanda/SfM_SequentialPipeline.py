#!/usr/bin/python
# ! -*- encoding: utf-8 -*-

# This file is part of OpenMVG (Open Multiple View Geometry) C++ library.

# Python implementation of the bash script written by Romuald Perrot
# Created by @vins31
# Modified by Pierre Moulon
#
# this script is for easy use of OpenMVG
#
# usage : python openmvg.py image_dir output_dir
#
# image_dir is the input directory where images are located
# output_dir is where the project must be saved
#
# if output_dir is not present script will create it
#

# Indicate the openMVG binary directory


# Indicate the openMVG camera sensor width directory

import os
import sys

my_path = os.path.abspath(os.path.dirname(__file__))

if os.name == 'posix' and sys.version_info[0] < 3:
    import subprocess32 as subprocess
else:
    import subprocess


class Sequential_pipeline:

    def __init__(self, input_dir, output_dir, focus_len, camera_file_params_db=None, OPENMVG_SFM_BIN=None):

        self.input_dir = input_dir
        self.output_dir = output_dir
        self.focus_len = focus_len

        self.matches_dir = os.path.join(output_dir, "matches")
        self.reconstruction_dir = os.path.join(output_dir, "reconstruction_global")

        if OPENMVG_SFM_BIN is None:
            self.OPENMVG_SFM_BIN = os.path.join(my_path, "../lib/Unix/")
        else:
            self.OPENMVG_SFM_BIN = OPENMVG_SFM_BIN

        if camera_file_params_db is None:
            CAMERA_SENSOR_WIDTH_DIRECTORY = os.path.join(my_path, "SensorDB/")

            self.camera_file_params_db = os.path.join(CAMERA_SENSOR_WIDTH_DIRECTORY, "sensor_width_camera_database.txt")
        else:
            self.camera_file_params_db = camera_file_params_db

    def pipeline(self):

        print("Using input dir  : ", self.input_dir)
        print("      output_dir : ", self.output_dir)

        # Create the ouput/matches folder if not present
        if not os.path.exists(self.output_dir):
            os.mkdir(self.output_dir)
        if not os.path.exists(self.matches_dir):
            os.mkdir(self.matches_dir)

        print("1. Intrinsics analysis")
        if self.focus_len == 'in_db':
            pIntrisics = subprocess.Popen(
                [os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_SfMInit_ImageListing"), "-i", self.input_dir, "-o",
                 self.matches_dir, "-d", self.camera_file_params_db])
            pIntrisics.wait()
        else:
            pIntrisics = subprocess.Popen(
                [os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_SfMInit_ImageListing"), "-i", self.input_dir, "-o",
                 self.matches_dir, "-d",
                 self.camera_file_params_db, "-f", self.focus_len])
            pIntrisics.wait()

        print("2. Compute features")
        pFeatures = subprocess.Popen([os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_ComputeFeatures"), "-i",
                                      self.matches_dir + "/sfm_data.json", "-o", self.matches_dir, "-m", "SIFT"])
        pFeatures.wait()

        print("3. Compute matches")
        pMatches = subprocess.Popen([os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_ComputeMatches"), "-i",
                                     self.matches_dir + "/sfm_data.json", "-o", self.matches_dir])
        pMatches.wait()

        # Create the reconstruction if not present
        if not os.path.exists(self.reconstruction_dir):
            os.mkdir(self.reconstruction_dir)

        print("4. Do Sequential/Incremental reconstruction")
        pRecons = subprocess.Popen([os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_IncrementalSfM"), "-i",
                                    self.matches_dir + "/sfm_data.json", "-m", self.matches_dir, "-o",
                                    self.reconstruction_dir])
        pRecons.wait()

        print("5. Colorize Structure")
        pRecons = subprocess.Popen([os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_ComputeSfM_DataColor"), "-i",
                                    self.reconstruction_dir + "/sfm_data.bin", "-o",
                                    os.path.join(self.reconstruction_dir, "colorized.ply")])
        pRecons.wait()

        # optional, compute final valid structure from the known camera poses
        print("6. Structure from Known Poses (robust triangulation)")
        pRecons = subprocess.Popen(
            [os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_ComputeStructureFromKnownPoses"), "-i",
             self.reconstruction_dir + "/sfm_data.bin", "-m", self.matches_dir, "-f",
             os.path.join(self.matches_dir, "matches.f.bin"), "-o",
             os.path.join(self.reconstruction_dir, "robust.bin")])
        pRecons.wait()

        pRecons = subprocess.Popen([os.path.join(self.OPENMVG_SFM_BIN, "openMVG_main_ComputeSfM_DataColor"), "-i",
                                    self.reconstruction_dir + "/robust.bin", "-o",
                                    os.path.join(self.reconstruction_dir, "robust_colorized.ply")])
        pRecons.wait()
