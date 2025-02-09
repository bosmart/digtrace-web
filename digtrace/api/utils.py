from datetime import datetime

job_status_messages = {
    # '100': 'job created but not submitted',
    # '101': 'submitted but not assigned to the queue',
    # '102': 'sending i.e. processing the job with images to be sent',
    #
    # '200': 'sent to generate ply',
    # '201': 'Initiated the processor or successfully submitted to the queue',
    # '202': 'In the queue',
    # '203': 'Currently being processed',
    # '221': 'job successful in one or more but unsuccessful in one or more image projects',
    # '222': 'job successful ',
    # '223': 'job successful and receiving files',
    # '224': 'job successful and received files',

    '100': 'job has been created, but not submitted',
    '101': 'job has been submitted but not sent',
    '102': 'job is being sent',
    '200': 'job is being sent',
    '201': 'job sent',
    '202': 'job in queue',
    '203': 'job is processing',
    '222': 'job processing finished, waiting to receive files',
    '223': 'processing finished,receiving files',
    '224': 'Finished',
    '225': 'Finished',

    '300': 'job resubmit with a new instance',
    '301': 'job locked',

    '401': 'job canceled', '400': 'job cancel request',

    '501': 'sending failed due to not being able to process i.e. compress the job',
    '502': 'sending failed due to issue(s) at the receiving end',
    '503': "Couldn't initiated the processor",
    '504': 'Cannot check status',

    '601': 'the receiving end has returned the job but it was not successful',
    '602': 'the receiving end returned unknown code',
    '603': 'job successful but failed to receive files',

    '701': 'job timed out',
    '702': 'the job size is too large to process for the receiver',
}


def tuple_to_dict(list_):
    dict_ = {}

    for item in list_:
        dict_[f'{item[0]}'] = item[1]

    return dict_


def convert_date_time(time_string):
    date = datetime.strptime(str(time_string).split('.')[0], '%Y-%m-%d %H:%M:%S')
    return datetime.strftime(date, '%b %d, %Y, %H:%M %p')
