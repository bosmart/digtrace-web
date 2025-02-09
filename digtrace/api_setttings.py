from django.conf import settings

from datetime import timedelta
from datetime import time

host1 = settings.HOST1
# "python_interpreter": '/usr/local/lib/python3.7',

HOSTS = settings.HOSTS

FILE_NAME_QUEUE = settings.FILE_NAME_QUEUE
FILE_NAME_API_STATE = settings.FILE_NAME_API_STATE
API_NAME = settings.API_NAME
LOCAL_RUN = settings.LOCAL_RUN

NUMBER_OF_RETRY_FOR_SENDING_FAILED_JOBS = settings.NUMBER_OF_RETRY_FOR_SENDING_FAILED_JOBS
NUMBER_OF_RETRY_FOR_SENDING_FAILED_DUE_TO_FAILED_RECEIVER_JOBS = settings.NUMBER_OF_RETRY_FOR_SENDING_FAILED_DUE_TO_FAILED_RECEIVER_JOBS
MAX_JOB_ASSIGNER_ALLOWER = settings.MAX_JOB_ASSIGNER_ALLOWER
MAX_JOB_PROCESSING_CHECKING_ALLOWED = settings.MAX_JOB_PROCESSING_CHECKING_ALLOWED
MAX_JOB__STATUS_RECIVER_ALLOWED = settings.MAX_JOB__STATUS_RECIVER_ALLOWED
MAX_JOB_FILE_RECIVER_ALLOWED = settings.MAX_JOB_FILE_RECIVER_ALLOWED

JOB_STATUS_CHECK_SLEEP = settings.JOB_STATUS_CHECK_SLEEP

# after the epoch period when the remote should be called to request deletion
DELETION_EVENT_TIME = settings.DELETION_EVENT_TIME

# waiting period for a remote job deletion since the most recent update (i.e. received ply files status 224)
DELETE_REMOTE_FILES_EXPIRY_PERIOD = settings.DELETE_REMOTE_FILES_EXPIRY_PERIOD

PLY_VIEWER_URL = settings.PLY_VIEWER_URL

### possible setups for the DELETE_REMOTE_FILES_EPOCH:
# timedelta(days=1)
# timedelta(microseconds= 500)


# 0 : every day
# 1: every two days
#
