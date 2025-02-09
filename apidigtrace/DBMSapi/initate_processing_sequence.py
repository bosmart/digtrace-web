# this script will start the processor and update the processor status with running before starting and idle at the end. Multiple running script for this won't be a problem.
# The control on how many processors should run should be controlled from the website to allow multi

import sys

from DBMSapi import process_sequence

import os


def start_processor():
    try:
        from DBMSapi.update_as_running import \
            intialise  as intialise_running  # only this import updates the table, nothing else is necessary
    except:
        from .update_as_running import \
            intialise  as intialise_running  # only this import updates the table, nothing else is necessary
    # from DBMSapi.update_as_running import intialise  as intialise_running  # only this import updates the table, nothing else is necessary
    if not os.path.isdir('log'):
        os.mkdir('log')
        # LOG FILE COMMENTED OUT FOR TESTING
    # sys.stdout = open('log/log.txt', 'w+')
    while True:

        seq = process_sequence.processSequence()
        seq.get_not_started_jobs()

        if seq.id_path is not None:
            if len(seq.id_path) > 0:

                seq.update_not_started_jobs_in_q()
                # seq.get_job_params() #stop for testing
                seq.start_processor()
            else:
                # try:
                from DBMSapi.intial_status_or_update_as_idle import \
                    intialise as intialise_idle  # only this import updates the table, nothing else is necessary
                # except:
                #     from .intial_status_or_update_as_idle import intialise as intialise_idle

                break

    try:
        from DBMSapi.intial_status_or_update_as_idle import \
            intialise as intialise_idle  # only this import updates the table, nothing else is necessary
    except:
        from .intial_status_or_update_as_idle import \
            intialise as intialise_idle  # only this import updates the table, nothing else is necessary

    # from DBMSapi.intial_status_or_update_as_idle import intialise as intialise_idle  # only this import updates the table, nothing else is necessary

# start_processor()
