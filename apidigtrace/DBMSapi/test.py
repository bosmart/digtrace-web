import datetime
import time

# after the epoch period when the remote should be called to request deletion
DELETION_EVENT_TIME = datetime.time(hour=1)

# waiting period for a remote job deletion since the most recent update (i.e. received ply files status 224)
DELETE_REMOTE_FILES_EXPIRY_PERIOD = datetime.timedelta(seconds=10)

scheduled_time = datetime.datetime.combine(datetime.date.today(), DELETION_EVENT_TIME)

if datetime.datetime.now() < scheduled_time:
    waiting_period = scheduled_time.timestamp() - time.time()
else:
    scheduled_time = datetime.datetime.combine(datetime.date.today() + datetime.timedelta(days=1), DELETION_EVENT_TIME)

    waiting_period = scheduled_time.timestamp() - time.time()
