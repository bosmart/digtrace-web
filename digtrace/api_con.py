import pysftp
from digtrace.api_setttings import HOSTS, FILE_NAME_API_STATE, FILE_NAME_QUEUE
import copy
import io
import os
from django.core import serializers
from django.core.serializers.json import DjangoJSONEncoder
import json
import re
from django.core.files import File
import uuid
from slugify import slugify

from django.core.files.base import ContentFile


class submitJob:

    def __init__(self, received_job_db):
        self.folder_name_job = None
        self.folder_name_projects = []
        self.invalid_connections = []
        self.valid_connections = []
        self.job_status = '101'  # default submitted
        self.hosts = copy.deepcopy(HOSTS)
        self.hosts_valid_indices = []
        self.target_host = None
        self.received_job_db = received_job_db
        self.target_host_connection = None
        self.target_host_id = None
        self.host_job_id = None

    def prepare_names_job(self):

        images_collections = self.received_job_db.userImagesCollection.all()
        self.folder_name_job = str(self.received_job_db.user.pk) + '_' + str(self.received_job_db.pk)
        for images_collection in images_collections:
            self.folder_name_projects.append(str(images_collection.pk))

    def open_connections(self):
        counter = 0
        for host in self.hosts:

            try:
                print('before   cnopts = pysftp.CnOpts()')

                cnopts = pysftp.CnOpts()
                print('cnopts')
                cnopts.hostkeys = None
                print('cnopts.hostkeys = None')

                connection = pysftp.Connection(host['name'], username=host['user_name'], password=host['password'],
                                               port=host['port'], cnopts=cnopts)
                print('connection')

                self.valid_connections.append(connection)
                self.hosts[counter]['status'] = 'opened'
                self.hosts_valid_indices.append(counter)
                print('connection oppened on: ' + host['name'])



            except Exception as e:
                print(str(e))
                self.invalid_connections.append(str(e))
            counter += 1

        if len(self.valid_connections) == 0:
            self.job_status = '501'
            return '501'

    def get_target_host_connection(self):
        # file = io.BytesIO()
        self.target_host = None
        number_of_jobs_each_host = []
        counter = 0
        for connection in self.valid_connections:
            # connection.getfo(remotepath=self.hosts[self.hosts_valid_indices[counter]]['dir']+FILE_NAME_QUEUE, flo=file)
            opened_file = connection.open(self.hosts[self.hosts_valid_indices[counter]]['dir'] + FILE_NAME_QUEUE)
            word = opened_file.readline()
            number_of_jobs_each_host.append(int(word))
            counter += 1
        self.target_host_id = self.hosts_valid_indices[number_of_jobs_each_host.index(min(number_of_jobs_each_host))]
        self.target_host = self.hosts[self.target_host_id]
        self.target_host_connection = self.valid_connections[
            number_of_jobs_each_host.index(min(number_of_jobs_each_host))]
        return True

    def transfer_job(self):

        self.target_host_connection.chdir(self.target_host['dir'])
        self.target_host_connection.mkdir(self.folder_name_job, mode=777)

        db_data = serializers.serialize('json', [self.received_job_db, ])
        file_db_job = self.target_host_connection.open(self.folder_name_job + '/job_param_instance.json', mode='w+')
        json.dump(db_data, file_db_job)
        file_db_job.close()

        for folder_name_project in self.folder_name_projects:
            self.target_host_connection.mkdir(self.folder_name_job + '/' + folder_name_project, mode=777)

        images_collections = self.received_job_db.userImagesCollection.all()
        counter = 0
        for images_collection in images_collections:
            for image in images_collection.images_set.all():
                self.target_host_connection.put(localpath=image.image.path,
                                                remotepath=self.folder_name_job + '/' + self.folder_name_projects[
                                                    counter] + '/' + os.path.basename(image.image.path))
            counter += 1

    def insert_to_remote_db(self):
        output = self.target_host_connection.execute(
            'python3 ' + self.target_host['api_path'] + 'DBMSapi/create_jobs.py ' + self.target_host[
                'dir'] + self.folder_name_job + '/')
        self.host_job_id = str(output[0], 'utf').split()[0]

        print(output)

    def check_remote_processor_status(self):
        return self.target_host_connection.execute(
            'python3 ' + self.target_host['api_path'] + 'DBMSapi/check_processor_status.py')


class processJob(submitJob):
    def __init__(self, job):
        super(processJob, self).__init__(job)

        self.target_host_id = job.jobmeta.host_id
        # self.target_host = HOSTS[self.target_host_id]

    # def open_connections(self):
    #     counter = 0
    #     for host in self.target_host:
    #
    #         try:
    #             connection = pysftp.Connection(host['name'], username=host['user_name'], password=host['password'])
    #             self.valid_connections.append(connection)
    #             self.hosts[counter]['status'] = 'opened'
    #             self.hosts_valid_indices.append(counter)
    #
    #
    #         except Exception as e:
    #             self.invalid_connections.append(str(e))
    #         counter += 1
    #
    #     if len(self.valid_connections) == 0:
    #         self.job_status = '501'
    #         return '501'

    def get_target_host_connection(self):
        # file = io.BytesIO()
        self.target_host = None
        number_of_jobs_each_host = []
        counter = 0
        for connection in self.valid_connections:
            # connection.getfo(remotepath=self.hosts[self.hosts_valid_indices[counter]]['dir']+FILE_NAME_QUEUE, flo=file)
            opened_file = connection.open(self.hosts[self.hosts_valid_indices[counter]]['dir'] + FILE_NAME_QUEUE)
            word = opened_file.readline()
            number_of_jobs_each_host.append(int(word))
            counter += 1
        # self.target_host_id = self.hosts_valid_indices[number_of_jobs_each_host.index(min(number_of_jobs_each_host))]
        self.target_host = self.hosts[self.target_host_id]
        self.target_host_connection = self.valid_connections[self.target_host_id]
        return True

    def intiate_processing_if_not_running(self):
        output = super(processJob, self).check_remote_processor_status()
        status = str(output[0], 'utf').split()[0]

        if status == 'idle':

            if self.target_host['python_interpreter'] is None:
                self.target_host_connection.execute(
                    'python3 ' + self.target_host['api_path'] + 'api_start_processor.py')

            else:
                self.target_host_connection.execute(
                    self.target_host['python_interpreter'] + ' ' + self.target_host[
                        'api_path'] + 'api_start_processor.py ' + self.target_host['python_interpreter'])

                for o in output:
                    print(o)


class getJobStatus(submitJob):
    def __init__(self, job):
        super(getJobStatus, self).__init__(job)

        self.target_host_id = job.jobmeta.host_id

    def get_target_host_connection(self):
        # file = io.BytesIO()
        self.target_host = None
        number_of_jobs_each_host = []
        counter = 0
        for connection in self.valid_connections:
            # connection.getfo(remotepath=self.hosts[self.hosts_valid_indices[counter]]['dir']+FILE_NAME_QUEUE, flo=file)
            opened_file = connection.open(self.hosts[self.hosts_valid_indices[counter]]['dir'] + FILE_NAME_QUEUE)
            word = opened_file.readline()
            number_of_jobs_each_host.append(int(word))
            counter += 1
        # self.target_host_id = self.hosts_valid_indices[number_of_jobs_each_host.index(min(number_of_jobs_each_host))]
        self.target_host = self.hosts[self.target_host_id]
        self.target_host_connection = self.valid_connections[self.target_host_id]
        return True

    def get_job_info(self):
        if self.get_target_host_connection():
            if self.target_host['python_interpreter'] is None:
                output = self.target_host_connection.execute(
                    'python3 ' + self.target_host['api_path'] + '/DBMSapi/check_job_status.py ' + str(
                        self.received_job_db.jobmeta.host_job_pk))

            else:
                # output=self.target_host_connection.execute(
                #     self.target_host['python_interpreter']+' '+ self.target_host[
                #         'api_path']  + '/DBMSapi/check_job_status.py '+str(135))

                output = self.target_host_connection.execute(
                    self.target_host['python_interpreter'] + ' ' + self.target_host[
                        'api_path'] + '/DBMSapi/check_job_status.py ' + str(self.received_job_db.jobmeta.host_job_pk))

            if len(output) == 0:
                return None

            output_Str = str(output[0], 'utf-8').split()

            if len(output_Str) < 10:
                return None

            status = re.sub(r'[^a-zA-Z0-9_\s]+', '', output_Str[7])
            queue = re.sub(r'[^a-zA-Z0-9_\s]+', '', output_Str[9])

            return [status, queue]


class getJobFiles(submitJob):
    _current_jobs_ids = []

    def __init__(self, job):
        super(getJobFiles, self).__init__(job)

        self.target_host_id = job.jobmeta.host_id
        self.job_path = None
        self.dir_list = None

    def get_target_host_connection(self):
        # file = io.BytesIO()
        self.target_host = None
        number_of_jobs_each_host = []
        counter = 0
        for connection in self.valid_connections:
            # connection.getfo(remotepath=self.hosts[self.hosts_valid_indices[counter]]['dir']+FILE_NAME_QUEUE, flo=file)
            opened_file = connection.open(self.hosts[self.hosts_valid_indices[counter]]['dir'] + FILE_NAME_QUEUE)
            word = opened_file.readline()
            number_of_jobs_each_host.append(int(word))
            counter += 1
        # self.target_host_id = self.hosts_valid_indices[number_of_jobs_each_host.index(min(number_of_jobs_each_host))]
        self.target_host = self.hosts[self.target_host_id]
        self.target_host_connection = self.valid_connections[self.target_host_id]
        return True

    def get_job_file_location(self):
        if self.get_target_host_connection():
            if self.target_host['python_interpreter'] is None:
                output = self.target_host_connection.execute(
                    'python3 ' + self.target_host['api_path'] + '/DBMSapi/check_job_status.py ' + str(
                        self.received_job_db.jobmeta.host_job_pk))

            else:
                # output=self.target_host_connection.execute(
                #     self.target_host['python_interpreter']+' '+ self.target_host[
                #         'api_path']  + '/DBMSapi/check_job_status.py '+str(135))

                output = self.target_host_connection.execute(
                    self.target_host['python_interpreter'] + ' ' + self.target_host[
                        'api_path'] + '/DBMSapi/get_job_output_paths.py ' + str(
                        self.received_job_db.jobmeta.host_job_pk))

            output_Str = str(output[0], 'utf-8').split()

            if len(output_Str) == 0:
                self.job_path = None
            else:
                self.job_path = output_Str[0]

    def _file_name(self, file, image_project_name, image_project_date, job_name):
        end_name = ''
        if "surface" in file or "Surface" in file:
            end_name = '_s.ply'
        elif "Trimmed" in file or "trimmed" in file:
            end_name = '_st.ply'
        else:
            end_name = '.ply'

        end_name = image_project_date + '_' + image_project_name

    def get_and_save_files(self):
        self.received_job_db.job_status = '223'
        self.received_job_db.save()

        inside_job_folder_directory = 'outputs/'
        from digtrace.models import JobFile, UserImagesCollection, Job
        from django.contrib.auth import get_user_model

        if self.job_path is not None:
            if self.target_host_connection.isdir(self.job_path + inside_job_folder_directory):
                self.dir_list = self.target_host_connection.listdir(self.job_path + inside_job_folder_directory)
                # self.dir_list = self._get_immediate_subdirectories(all_dir_list)
                # print(self.dir_list)

                for dir in self.dir_list:
                    if self.target_host_connection.isdir(self.job_path + inside_job_folder_directory + dir + '/plys/'):
                        files = self.target_host_connection.listdir(
                            self.job_path + inside_job_folder_directory + dir + '/plys/')
                        for file in files:
                            file_in_memory = io.BytesIO()
                            self.target_host_connection.getfo(
                                remotepath=self.job_path + inside_job_folder_directory + dir + '/plys/' + file,
                                flo=file_in_memory, callback=None)
                            file_temp = file_in_memory.getvalue()
                            django_file = ContentFile(file_temp)

                            job_file = JobFile()
                            job_file.user = self.received_job_db.user
                            job_file.job = self.received_job_db
                            userImagesCollection = UserImagesCollection.objects.get(pk=int(dir))
                            job_file.userImagesCollection = userImagesCollection

                            job_file.file_name = file

                            if Job.objects.get(pk=self.received_job_db.pk).job_status != '224':
                                job_file.file.save(content=django_file, name=str(self.received_job_db.id) + '_' + str(
                                    userImagesCollection.id) + '_' + file)
                                job_file.save()

                                # JobFile.objects.create_jobFile(user=self.received_job_db.user,
                                #                                job=self.received_job_db,
                                #                                userImagesCollection=UserImagesCollection.objects.get(
                                #                                    pk=int(dir)),
                                #                                file=File(django_file), file_name=file)

                                # job_file.save()
                                file_in_memory.close()
                                django_file.close()
                                self.received_job_db.save()
                                print('test job file reciever')

    def _get_immediate_subdirectories(self, dir_list):
        return [name for name in dir_list
                if os.path.isdir(os.path.join(dir_list, name))]

    def get_image_output_ply_files(self):

        for dir in self.dir_list:
            pass


class deleteFinishedJobs(submitJob):

    def __init__(self, job):
        super(deleteFinishedJobs, self).__init__(job)

        self.target_host_id = job.jobmeta.host_id

    def get_target_host_connection(self):
        # file = io.BytesIO()
        self.target_host = None
        number_of_jobs_each_host = []
        counter = 0
        for connection in self.valid_connections:
            # connection.getfo(remotepath=self.hosts[self.hosts_valid_indices[counter]]['dir']+FILE_NAME_QUEUE, flo=file)
            opened_file = connection.open(self.hosts[self.hosts_valid_indices[counter]]['dir'] + FILE_NAME_QUEUE)
            word = opened_file.readline()
            number_of_jobs_each_host.append(int(word))
            counter += 1
        # self.target_host_id = self.hosts_valid_indices[number_of_jobs_each_host.index(min(number_of_jobs_each_host))]
        self.target_host = self.hosts[self.target_host_id]
        self.target_host_connection = self.valid_connections[self.target_host_id]
        return True

    def delete_jobs_recursive(self, remote_host_ids):
        if self.get_target_host_connection():
            if self.target_host['python_interpreter'] is None:
                output = self.target_host_connection.execute(
                    'python3 ' + self.target_host[
                        'api_path'] + '/DBMSapi/delete_jobs_once_finished_and_transferred.py ' + remote_host_ids)

            else:
                # output=self.target_host_connection.execute(
                #     self.target_host['python_interpreter']+' '+ self.target_host[
                #         'api_path']  + '/DBMSapi/check_job_status.py '+str(135))

                output = self.target_host_connection.execute(
                    self.target_host['python_interpreter'] + ' ' + self.target_host[
                        'api_path'] + '/DBMSapi/delete_jobs_once_finished_and_transferred.py ' + remote_host_ids)
