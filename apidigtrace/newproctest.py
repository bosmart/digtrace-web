
import subprocess

def test_run(interpreter_path):
    if interpreter_path is None:
        myProc = subprocess.Popen(['python3', 'start_from_subprocess_initiate_processing.py'])
        # myProc.communicate()
        print('test_0')
    else:
        myProc = subprocess.Popen([interpreter_path, 'start_from_subprocess_initiate_processing.py'])
        # myProc.communicate()
        print(interpreter_path)
        print('starting from custom interpreter')
