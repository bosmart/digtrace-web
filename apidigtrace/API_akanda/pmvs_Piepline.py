#!/usr/bin/python
# ! -*- encoding: utf-8 -*-

# This file is part of OpenMVG (Open Multiple View Geometry) C++ library.

# Python implementation of the bash script written by Romuald Perrot
# Created by @vins31
# Modified by Pierre Moulon
# Modified by Pierre Akanda
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
import os

# my_path = os.path.abspath(os.path.dirname(__file__))
# path = os.path.join(my_path, "../SfM_GlobalPipeline.py")
# pmvs_bin =  os.path.join(my_path, "../lib/Unix/")

# Indicate the openMVG camera sensor width directory

import sys

if os.name == 'posix' and sys.version_info[0] < 3:
    import subprocess32 as subprocess
else:
    import subprocess


class PMVS_pipeline:
    def __init__(self, reconstruction_dir, PMVS_BIN=None):

        self.reconstruction_dir = reconstruction_dir

        if PMVS_BIN is None:
            my_path = os.path.abspath(os.path.dirname(__file__))
            self.pmvs_bin = os.path.join(my_path, "../lib/Unix/")
        else:
            self.pmvs_bin = PMVS_BIN

    def pipeline(self):

        print("Using input dir  : ", self.reconstruction_dir)

        print("7. convert the openMVG SfM scene to the PMVS format")
        pConvert = subprocess.Popen([os.path.join(self.pmvs_bin, "openMVG_main_openMVG2PMVS"), "-i",
                                     os.path.join(self.reconstruction_dir, "sfm_data.bin"), "-o",
                                     self.reconstruction_dir], stdout=sys.stdout, stderr=sys.stdout)
        pConvert.wait()

        print("8. ------------ generate dense cloud points using PMVS ------------------")
        print("$ cmvs /Pictures/result.nvm.cmvs/00/ 50 12")
        pRecons = subprocess.Popen(
            [os.path.join(self.pmvs_bin, "cmvs"), os.path.join(self.reconstruction_dir, "PMVS/"), "50", "12"],
            stdout=sys.stdout, stderr=sys.stdout)
        pRecons.wait()

        pRecons = subprocess.Popen(
            [os.path.join(self.pmvs_bin, "genOption"), os.path.join(self.reconstruction_dir, "PMVS/")],
            stdout=sys.stdout, stderr=sys.stdout)
        pRecons.wait()

        fin = open(self.reconstruction_dir + "/PMVS/option-0000", "rt")
        data = fin.read()
        data = data.replace('CPU 8', 'CPU 1')
        fin.close()

        fin = open(self.reconstruction_dir + "/PMVS/option-0000", "wt")
        fin.write(data)
        fin.close()

        print("$ pmvs2 /Pictures/result.nvm.cmvs/00/ option-0000")
        # added pset for surf
        pRecons = subprocess.Popen(
            [os.path.join(self.pmvs_bin, "pmvs2"), os.path.join(self.reconstruction_dir, "PMVS/"), "option-0000"],
            stdout=sys.stdout, stderr=subprocess.PIPE)
        pRecons.wait()
