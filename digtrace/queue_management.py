from digtrace.api_con import submitJob, processJob, getJobStatus, getJobFiles, deleteFinishedJobs
from digtrace.api_setttings import (
    NUMBER_OF_RETRY_FOR_SENDING_FAILED_DUE_TO_FAILED_RECEIVER_JOBS as host_sending_failed_retry,
    NUMBER_OF_RETRY_FOR_SENDING_FAILED_JOBS as sending_failed_retry)
from threading import Thread
from digtrace.api_setttings import JOB_STATUS_CHECK_SLEEP
from digtrace.api_setttings import DELETE_REMOTE_FILES_EXPIRY_PERIOD, DELETION_EVENT_TIME
import datetime
import time
import sched
import traceback


class JobAssigner():
    alive_instances = 0

    def __init__(self):
        JobAssigner.alive_instances += 1

    def __del__(self):
        JobAssigner.alive_instances -= 1

    def _submitted_but_not_sent_send(self, jobs):
        from digtrace.models import JobMeta, Job
        if jobs:
            for job in jobs.all():
                if Job.objects.get(pk=job.pk).job_status == '101':
                    try:
                        job.job_status = '102'
                        job.save()
                        object_api_submit_job = submitJob(job)
                        object_api_submit_job.prepare_names_job()
                        object_api_submit_job.open_connections()
                        target_host_connection = object_api_submit_job.get_target_host_connection()
                        object_api_submit_job.transfer_job()
                        object_api_submit_job.insert_to_remote_db()

                        job_meta = JobMeta(job=job, host_id=object_api_submit_job.target_host_id,
                                           host_job_folder_name=object_api_submit_job.folder_name_job,
                                           host_job_pk=object_api_submit_job.host_job_id)
                        job_meta.save()

                        job.job_status = '200'
                        job.save()
                    except Exception as e:
                        print(e)
                        job.job_status = '502'
                        job.save()

    def _submitted_but_error_send(self, jobs):
        if jobs:
            for job in jobs:
                if job.job_status == '502':
                    job.job_status = '102'
                    job.save()
                    try:
                        object_api_submit_job = submitJob(job)
                        object_api_submit_job.prepare_names_job()
                        object_api_submit_job.open_connections()
                        target_host_connection = object_api_submit_job.get_target_host_connection()
                        object_api_submit_job.transfer_job()
                        object_api_submit_job.insert_to_remote_db()
                    except:
                        job.job_status = '502'
                        job.save()

    def _requires_admin_status_update(self, jobs):
        if jobs:
            for job in jobs:
                if job.job_status == '502':
                    job.job_status = '300'
                    job.save()

    def poke_me_after_job_submitted(self):
        from digtrace.models import Job, JobMeta

        while True:
            submitted_but_not_sent_jobs = Job.objects.all().filter(job_status='101')

            if not submitted_but_not_sent_jobs:
                break
            else:

                self._submitted_but_not_sent_send(submitted_but_not_sent_jobs)

                sending_failure_jobs = Job.objects.all().filter(job_status='502')

                for i in range(sending_failed_retry):

                    if not sending_failure_jobs:
                        break
                    else:
                        self._submitted_but_error_send(sending_failure_jobs)


class JobProcessor():
    alive_instances = 0

    def __init__(self):
        JobProcessor.alive_instances += 1

    def __del__(self):
        JobProcessor.alive_instances -= 1

    def request_processor(self, job):
        processJob_obj = processJob(job)

        processJob_obj.open_connections()
        processJob_obj.get_target_host_connection()
        Thread(target=processJob_obj.intiate_processing_if_not_running).start()

        # processJob_obj.intiate_processing_if_not_running()
        job.job_status = '201'
        job.save()


class JobFilesReceiver():
    alive_instances = 0

    def __init__(self):
        JobFilesReceiver.alive_instances += 1

    def __del__(self):
        JobFilesReceiver.alive_instances -= 1

    def get_files_for_a_single_job(self, job):
        from .models import Job

        try:
            if not job.id in getJobFiles._current_jobs_ids:
                getJobFiles._current_jobs_ids.append(job.id)
                object_api_getJobFiles = getJobFiles(job)
                object_api_getJobFiles.open_connections()
                object_api_getJobFiles.get_target_host_connection()
                object_api_getJobFiles.get_job_file_location()
                if Job.objects.get(pk=job.pk).job_status != '224' or Job.objects.get(pk=job.pk).job_status != '223':
                    object_api_getJobFiles.get_and_save_files()
                    job.job_status = '224'
                    job.save()
                getJobFiles._current_jobs_ids.remove(job.id)
        except:
            job.job_status = '603'
            job.save()

    def get_job_files(self):

        from digtrace.models import Job, JobMeta

        job_statuses = ['222']
        while True:
            # jobs_transfered = Job.objects.all().filter(job_status='200')

            for job_status in job_statuses:
                jobs_files_ready = Job.objects.all().filter(job_status=job_status)
                if not jobs_files_ready:
                    break

                for job in jobs_files_ready:
                    if Job.objects.get(id=job.id).job_status == '222':
                        # job.job_status = '223'
                        # job.save()

                        self.get_files_for_a_single_job(job)

                # if not jobs_running:
                #     break
                # else:
                #     self.get_status_for_sent_jobs(jobs_running)

    def get_job_files_threaded(self):
        Thread(target=self.get_job_files).start()


class JobStatusReceiver():
    alive_instances = 0

    def __init__(self):
        JobStatusReceiver.alive_instances += 1

    def __del__(self):
        JobStatusReceiver.alive_instances -= 1

    def get_status_for_sent_jobs(self, jobs):
        from digtrace.models import JobMeta, Job
        test = 'test'
        if jobs:
            for job in jobs.all():
                temp_job_status = job.job_status
                # if job.job_status != '301':
                if int(Job.objects.get(pk=job.pk).job_status) >= 200:
                    try:
                        # job.job_status = '301'
                        # job.save()
                        object_api_get_job = getJobStatus(job)
                        object_api_get_job.open_connections()
                        object_api_get_job.get_target_host_connection()
                        status_q = object_api_get_job.get_job_info()
                        print('status_q***')
                        print(status_q)
                        if status_q is not None and len(status_q) > 0:

                            print('opening connection to see status is fine')
                            job.jobmeta.host_job_status = status_q[0]
                            job.jobmeta.save()

                            print(status_q[0] + ' status remote')
                            if len(status_q) > 0:
                                print(status_q[1] + ' queue remote')

                                job.jobmeta.host_job_queue = status_q[1]
                                job.jobmeta.save()

                            # test = 'status is fine'
                            #
                            # job.jobmeta.host_job_queue = 'assigning'
                            # job.jobmeta.save()

                            if status_q[0] == 'failed_params_loading' or status_q[0] == 'failed_remote_folder_file' or \
                                    status_q[0] == 'failed_processing' and job.job_status != '601':
                                job.job_status = '601'
                                job.save()

                            elif status_q[0] == 'inq' and job.job_status != '202':
                                job.job_status = '202'
                                job.save()

                            elif status_q[0] == 'processing' and job.job_status != '203':
                                job.job_status = '203'
                                job.save()
                            elif status_q[0] == 'finished' and job.job_status != '222':
                                job.job_status = '222'
                                job.save()

                            elif status_q[0] == 'created' and job.job_status != '200':
                                job.job_status = '200'
                                job.save()

                    except Exception as e:
                        print(e)
                        print(test + 'get_status_for_sent_jobs')
                        if job.job_status != '504':
                            job.job_status = '504'
                            job.save()

    def get_status_for_a_single_sent_job(self, job):
        try:
            job.job_status = '301'
            job.save()
            object_api_get_job = getJobStatus(job)
            object_api_get_job.open_connections()
            object_api_get_job.get_target_host_connection()
            status_q = object_api_get_job.get_job_info()

            job.jobmeta.host_job_status = status_q[0]
            job.jobmeta.host_job_queue = status_q[1]

            if status_q[0] == 'failed_params_loading' or status_q[0] == 'failed_remote_folder_file' or \
                    status_q[0] == 'failed_processing':
                job.job_status = '601'
                job.save()

            elif status_q[0] == 'inq':
                job.job_status = '202'
                job.save()

            elif status_q[0] == 'processing':
                job.job_status = '203'
                job.save()
            elif status_q[0] == 'finished':
                job.job_status = '222'
                job.save()

            elif status_q[0] == 'created':
                pass


        except:
            job.job_status = '502'
            job.save()

    def update_jobs(self):

        from digtrace.models import Job, JobMeta

        # job_statuses = ['101', '102', '201', '202', '203', '301']
        job_statuses = ['200', '201', '202', '203', '301']

        while True:
            # jobs_transfered = Job.objects.all().filter(job_status='200')

            for job_status in job_statuses:
                jobs_running = Job.objects.all().filter(job_status=job_status)

                self.get_status_for_sent_jobs(jobs_running)

                # if not jobs_running:
                #     break
                # else:
                #     self.get_status_for_sent_jobs(jobs_running)

            time.sleep(JOB_STATUS_CHECK_SLEEP)

    def update_jobs_threaded(self):
        Thread(target=self.update_jobs).start()


class jobDeleteRemote():
    is_alive = False

    def __init__(self):
        jobDeleteRemote.is_alive = True

    def __del__(self):
        JobStatusReceiver.is_alive = False

    def _delete_finished_expired_jobs(self):
        print('test _delete_finished_expired_jobs called')

        from digtrace.models import Job
        jobs_files_ready_expired = []
        jobs_files_ready = Job.objects.all().filter(job_status='224')
        target_host_ids = []
        for job_files_ready in jobs_files_ready:
            if datetime.timedelta(
                    seconds=time.time() - job_files_ready.job_date_updated.timestamp()) >= DELETE_REMOTE_FILES_EXPIRY_PERIOD:
                jobs_files_ready_expired.append(job_files_ready)
                target_host_ids.append(job_files_ready.jobmeta.host_id)

        if target_host_ids:
            unique_hosts_found = set(target_host_ids)
            host_job_pks_temp = ''
            temp_job_with_id_to_open_remote_host_connection = None
            for unique_host in unique_hosts_found:
                counter = 0
                for job in jobs_files_ready_expired:
                    host_id = target_host_ids[counter]
                    counter += 1
                    if unique_host == host_id:
                        temp_job_with_id_to_open_remote_host_connection = job
                        host_job_pks_temp += str(job.jobmeta.host_job_pk) + ' '
                        job.job_status = '225'
                        job.save()

                if host_job_pks_temp != '':
                    delete_finished_jobs_obj = deleteFinishedJobs(temp_job_with_id_to_open_remote_host_connection)
                    delete_finished_jobs_obj.open_connections()
                    try:
                        delete_finished_jobs_obj.delete_jobs_recursive(host_job_pks_temp)

                    except:
                        print('remote job removal failed')

    def delete_request(self):
        print('test, delete request called')

        s = sched.scheduler(time.time, time.sleep)

        scheduled_time = datetime.datetime.combine(datetime.date.today(), DELETION_EVENT_TIME)

        if datetime.datetime.now() < scheduled_time:
            waiting_period = scheduled_time.timestamp() - time.time()
        else:
            scheduled_time = datetime.datetime.combine(datetime.date.today() + datetime.timedelta(days=1),
                                                       DELETION_EVENT_TIME)

            waiting_period = scheduled_time.timestamp() - time.time()

        # self._delete_finished_expired_jobs()

        s = sched.scheduler(time.time, time.sleep)
        # waiting_period = 1
        s.enter(waiting_period, 1, self._delete_finished_expired_jobs)
        s.run()

    def delete_request_threaded(self):
        Thread(target=self.delete_request).start()
