# from DBMSapi import initate_processing_sequence
import subprocess
import sys
import os

interpreter_path = None
dir_path = os.path.dirname(os.path.realpath(__file__))

if len(sys.argv)>1:
    interpreter_path = sys.argv[1]

# uncomment for testing:
# interpreter_path = '/home/akanda/anaconda3/envs/DigTraceWeb/bin/python3.7'


if interpreter_path is None:
    myProc=subprocess.Popen(['python3', 'start_from_subprocess_initiate_processing.py'])

    # myProc.communicate()
else:
    myProc=subprocess.Popen([interpreter_path, dir_path+'/start_from_subprocess_initiate_processing.py'])
# from multiprocessing import Pool
#
# from multiprocessing import Process
# # from DBMSapi import initate_processing_sequence
# from threading import Thread


#
# class MyThread(threading.Thread):
#     def run(self):
#
#         initate_processing_sequence.start_processor()
#
# thread = MyThread()
# thread.daemon = True
# thread.start()

# Thread(target=initate_processing_sequence.start_processor()).start()
# print('done')
#
# if len(sys.argv)>1:
#     interpreter_path = sys.argv[1]
#
#
# interpreter_path = '/home/akanda/anaconda3/envs/DigTraceWeb/bin/python3.7'
# # initate_processing_sequence.start_processor()
#
#
#
# if interpreter_path is None:
#     myProc=subprocess.Popen(['python3', 'DBMSapi/initate_processing_sequence.py'])
#     # myProc.communicate()
#     print('test_0')
# else:
#     myProc=subprocess.Popen([interpreter_path,'DBMSapi/initate_processing_sequence.py'])
#     # myProc.communicate()
#
#     print('test_0')
#
#
#
# print('test_1')

