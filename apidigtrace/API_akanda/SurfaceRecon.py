import sys
import os

my_path = os.path.abspath(os.path.dirname(__file__))

# path = os.path.join(my_path, "../SfM_GlobalPipeline.py")


# SurfaceRecon_BIN =  os.path.join(my_path, "../lib/Unix/")


if os.name == 'posix' and sys.version_info[0] < 3:
    import subprocess32 as subprocess
else:
    import subprocess


class surface:

    def __init__(self, input_file, output_dir, depth='10', lib_path=None, log_file=None):
        self.input_file = input_file
        self.output_dir = output_dir
        self.depth = depth
        if log_file is not None:
            self.log_file = log_file
        if lib_path is not None:
            self.surface_recon_bin = lib_path
        else:
            self.surface_recon_bin = os.path.join(my_path, "../lib/Unix/")

    def PoissonRecon(self, degree='1', samplesPerNode='1.0', density=False, surface_recon_colour=True):

        if surface_recon_colour:
            if not density:
                process_PoissonRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "PoissonRecon"),
                                                         "--in", self.input_file,
                                                         "--out", self.input_file + "PoissonRecon.ply",
                                                         "--depth", self.depth,
                                                         "--degree", degree,
                                                         "--colors",
                                                         "--samplesPerNode", samplesPerNode], stdout=sys.stdout,
                                                        stderr=sys.stdout)
            else:
                process_PoissonRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "PoissonRecon"),
                                                         "--in", self.input_file,
                                                         "--out", self.input_file + "PoissonRecon.ply",
                                                         "--depth", self.depth,
                                                         "--degree", degree,
                                                         "--colors",
                                                         "--samplesPerNode", samplesPerNode,
                                                         "--density"], stdout=sys.stdout, stderr=sys.stdout)
        else:
            if not density:
                process_PoissonRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "PoissonRecon"),
                                                         "--in", self.input_file,
                                                         "--out", self.input_file + "PoissonRecon.ply",
                                                         "--depth", self.depth,
                                                         "--degree", degree,
                                                         "--samplesPerNode", samplesPerNode], stdout=sys.stdout,
                                                        stderr=sys.stdout)
            else:
                process_PoissonRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "PoissonRecon"),
                                                         "--in", self.input_file,
                                                         "--out", self.input_file + "PoissonRecon.ply",
                                                         "--depth", self.depth,
                                                         "--degree", degree,
                                                         "--samplesPerNode", samplesPerNode,
                                                         "--density"], stdout=sys.stdout, stderr=sys.stdout)

        process_PoissonRecon.wait()
        return self.input_file + "PoissonRecon.ply"

    def _SSDReconsdf(self, SurfaceTrimmer_trim='7', ChunkPly_width='4'):
        process_PoissonRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "PoissonRecon"),
                                                 "--in", self.input_file,
                                                 "--out", os.path.join(self.output_dir, os.path.basename(
                self.input_file) + "PoissonRecon.color.ply"),
                                                 "--depth", self.depth,
                                                 "--colors"], stdout=sys.stdout, stderr=sys.stdout)
        process_PoissonRecon.wait()

        process_SSDRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "SSDRecon"),
                                             "--in", os.path.join(self.output_dir, os.path.basename(
                self.input_file) + "PoissonRecon.color.ply"),
                                             "--out", os.path.join(self.output_dir, os.path.basename(
                self.input_file) + "SSDRecon.color.ply"),
                                             "--depth", self.depth,
                                             "--colors",
                                             "--density"], stdout=sys.stdout, stderr=sys.stdout)
        process_SSDRecon.wait()

        process_SurfaceTrimmer = subprocess.Popen([os.path.join(self.surface_recon_bin, "SurfaceTrimmer"),
                                                   "--in", os.path.join(self.output_dir, os.path.basename(
                self.input_file) + "SSDRecon.color.ply"),
                                                   "--out", os.path.join(self.output_dir, os.path.basename(
                self.input_file) + "SSDRecon.color.trimmed.ply"),
                                                   "--trim", SurfaceTrimmer_trim], stdout=sys.stdout, stderr=sys.stdout)
        process_SurfaceTrimmer.wait()

        process_ChunkPly = subprocess.Popen([os.path.join(self.surface_recon_bin, "ChunkPLY"),
                                             "--in", os.path.join(self.output_dir, os.path.basename(
                self.input_file) + "SSDRecon.color.trimmed.ply"),
                                             "--out", os.path.join(self.output_dir, os.path.basename(
                self.input_file) + "SSDRecon.color.trimmed.chnks"),
                                             "--width", ChunkPly_width], stdout=sys.stdout, stderr=sys.stdout)
        process_ChunkPly.wait()

    def SSDRecon(self, degree='2', surface_recon_colour=True):

        if surface_recon_colour:

            process_SSDRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "SSDRecon"),
                                                 "--in", self.input_file,
                                                 "--out", os.path.join(self.input_file + "SSDRecon.ply"),
                                                 "--degree", degree,
                                                 "--colors",
                                                 "--depth", self.depth], stdout=sys.stdout, stderr=sys.stdout)
            process_SSDRecon.wait()

        else:
            process_SSDRecon = subprocess.Popen([os.path.join(self.surface_recon_bin, "SSDRecon"),
                                                 "--in", self.input_file,
                                                 "--out", os.path.join(self.input_file + "SSDRecon.ply"),
                                                 "--degree", degree,
                                                 "--depth", self.depth], stdout=sys.stdout, stderr=sys.stdout)
            process_SSDRecon.wait()

        return os.path.join(self.input_file + "SSDRecon.ply")

    def SurfaceTrimmer(self, input_file, trim, smooth='5', polygonMesh=False):
        if not polygonMesh:
            process_SurfaceTrimmer = subprocess.Popen([os.path.join(self.surface_recon_bin, "SurfaceTrimmer"),
                                                       "--in", input_file,
                                                       "--out", self.input_file + ".trimmed.ply",
                                                       "--trim", trim,
                                                       "--smooth", smooth], stdout=sys.stdout, stderr=sys.stdout)
        else:
            process_SurfaceTrimmer = subprocess.Popen([os.path.join(self.surface_recon_bin, "SurfaceTrimmer"),
                                                       "--in", input_file,
                                                       "--out", self.input_file + ".trimmed.ply",
                                                       "--trim", trim,
                                                       "--smooth", smooth,
                                                       "--polygonMesh"], stdout=sys.stdout, stderr=sys.stdout)

        process_SurfaceTrimmer.wait()

        return self.input_file + ".trimmed.ply"

# s = surface(input_file = '/home/akanda/dinoTestNew/output_global/reconstruction_global/PMVS/models/option-0000.ply',output_dir = '/home/akanda/dinoTestNew/output_global/reconstruction_global/PMVS/models/')
# # s.PoissonRecon(density=True)
#
# s.SurfaceTrimmer(input_file='/home/akanda/dinoTestNew/output_global/reconstruction_global/PMVS/models/option-0000.plyPoissonRecon.ply',trim="2")
# # s.SSDRecon()
