import sqlite3
import os.path
import datetime
import json
from API_akanda.safe_call_pipelines import api_all_steps_SfM_global_all_params, test_api_all_steps_SfM_global_all_params
from API_akanda.safe_call_pipelines import api_all_steps_SfM_sequential_all_params, \
    test_api_all_steps_SfM_sequential_all_params

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")

# DATABASE_NAME = os.path.join('/DBMSapi/', "database_sqlite3.db")

# DATABASE_NAME = os.path.abspath("database_sqlite3.db")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")


# print(DATABASE_NAME)
class processSequence():
    def __init__(self):

        self.conn = self.connect()
        self.id_path = None
        self.params = None

    def connect(self):

        try:
            print(DATABASE_NAME)

            conn = sqlite3.connect(DATABASE_NAME)
            return conn
        except:
            return print('database not found')

    #
    def set_status_running(self):
        insertStatement = "INSERT INTO Status (current_status,datetime) VALUES (?,?)"
        try:
            if self.conn is not None:
                self.conn.execute(insertStatement, ('running', datetime.datetime.now(),))
                self.conn.commit()
                return ("inserted")

        except Exception as e:
            print(e)
            return ("error! cannot insert")

    # set_status_running()

    # not tested
    def update_not_started_jobs_in_q(self):

        statement_update = '''UPDATE Jobs SET status = ?, queue = ? WHERE id = ?'''
        c = self.conn.cursor()
        try:
            if self.conn is not None:
                print('Jobs Table')
                counter_q = 1
                for row in self.id_path:
                    c.execute(statement_update, ('inq', counter_q, row[0],))
                    self.conn.commit()
                    counter_q += 1



        except Exception as e:
            print(e)
            return ("error! cannot update")

    # not tested
    def _update_job_status_processing_and_all_q(self, id):

        statement_update_the_job = '''UPDATE Jobs SET status = ?, datetime_processing_started = ? WHERE id = ?'''
        statement_update_other_jobs = '''UPDATE Jobs SET queue=queue-1 WHERE id = ?'''

        c = self.conn.cursor()
        try:
            if self.conn is not None:
                c.execute(statement_update_the_job, ('processing', datetime.datetime.now(), id,))
                self.conn.commit()

                for row in self.id_path:
                    c.execute(statement_update_other_jobs, (row[0],))
                    self.conn.commit()



        except Exception as e:
            print(e)
            return ("error! cannot update")

    def _update_job_status_failed_cannot_load_params_and_all_q(self, id):

        statement_update_the_job = '''UPDATE Jobs SET status = ?, datetime_processing_started = ? WHERE id = ?'''
        statement_update_other_jobs = '''UPDATE Jobs SET queue=queue-1 WHERE id = ?'''

        c = self.conn.cursor()
        try:
            if self.conn is not None:
                c.execute(statement_update_the_job, ('failed_params_loading', datetime.datetime.now(), id,))
                self.conn.commit()

                # for row in self.id_path:
                #     c.execute(statement_update_other_jobs, (row[0],))
                #     self.conn.commit()
                #


        except Exception as e:
            print(e)
            return ("error! cannot update")

    def _update_job_status_failed_remote_file_creation_and_all_q(self, id):

        statement_update_the_job = '''UPDATE Jobs SET status = ?, datetime_processing_started = ? WHERE id = ?'''
        statement_update_other_jobs = '''UPDATE Jobs SET queue=queue-1 WHERE id = ?'''

        c = self.conn.cursor()
        try:
            if self.conn is not None:
                c.execute(statement_update_the_job, ('failed_remote_folder_file', datetime.datetime.now(), id,))
                self.conn.commit()

                # for row in self.id_path:
                #     c.execute(statement_update_other_jobs, (row[0],))
                #     self.conn.commit()



        except Exception as e:
            print(e)
            return ("error! cannot update")

    def _update_job_status_failed_processing_and_all_q(self, id):

        statement_update_the_job = '''UPDATE Jobs SET status = ?, datetime_processing_started = ? WHERE id = ?'''
        statement_update_other_jobs = '''UPDATE Jobs SET queue=queue-1 WHERE id = ?'''

        c = self.conn.cursor()
        try:
            if self.conn is not None:
                c.execute(statement_update_the_job, ('failed_processing', datetime.datetime.now(), id,))
                self.conn.commit()
                # TODO: check if commenting the q updates for failing gives the expected results
                # for row in self.id_path:
                #     c.execute(statement_update_other_jobs, (row[0],))
                #     self.conn.commit()



        except Exception as e:
            print(e)
            return ("error! cannot update")

    def _update_job_status_finished(self, id):

        statement_update_the_job = '''UPDATE Jobs SET status = ? WHERE id = ?'''

        c = self.conn.cursor()
        try:
            if self.conn is not None:
                c.execute(statement_update_the_job, ('finished', id,))
                self.conn.commit()



        except Exception as e:
            print(e)
            return ("error! cannot update")

    def get_not_started_jobs(self):

        self.conn = self.connect()

        statement_get = '''SELECT id, path FROM Jobs WHERE status=?'''

        c = self.conn.cursor()
        try:
            if self.conn is not None:
                print('Jobs Table')
                c.execute(statement_get, ('created',))
                rows = []
                for row in c.fetchall():
                    print(row)
                    rows.append(row)
                self.id_path = rows


        except Exception as e:
            print(e)
            return ("error! cannot fetch")

    def get_job_params(self):
        params = []
        for row in self.id_path:
            file = open(row[1] + '/job_param_instance.json')
            params.append(json.load(file))
            file.close()
        self.params = params

    def _get_a_single_job_params(self, id_path):
        params = None
        file = open(id_path[1] + '/job_param_instance.json')
        params = json.load(file)
        file.close()
        return params

    def _get_immediate_subdirectories(self, a_dir):
        return [name for name in os.listdir(a_dir)
                if os.path.isdir(os.path.join(a_dir, name))]

    def start_processor(self):
        counter = 0
        for ip in self.id_path:

            flag_failed = False

            id = ip[0]

            self._update_job_status_processing_and_all_q(id)

            path = ip[1]

            # commeted for testing
            try:
                param = json.loads(self._get_a_single_job_params(ip), encoding='utf-8')
                gen_model = param[0]['fields']['gen_model']
                force_focal_len_calc = param[0]['fields']['force_focal_len_calc']
                focal_len = param[0]['fields']['focal_len']
                surface_recon = param[0]['fields']['surface_recon']
                surface_recon_depth = param[0]['fields']['surface_recon_depth']
                poisson_recon_degree = param[0]['fields']['poisson_recon_degree']
                surface_recon_colour = param[0]['fields']['surface_recon_colour']

                poisson_recon_sample_per_node = param[0]['fields']['poisson_recon_sample_per_node']
                poisson_recon_density = param[0]['fields']['poisson_recon_density']
                ssd_recon_degree = param[0]['fields']['ssd_recon_degree']
                surface_trim = param[0]['fields']['surface_trim']
                surface_trim_trim_threshold = param[0]['fields']['surface_trim_trim_threshold']
                surface_trim_polygon_mesh = param[0]['fields']['surface_trim_polygon_mesh']
                surface_trim_smooth = param[0]['fields']['surface_trim_smooth']
                job_note = param[0]['fields']['job_note']
            except:
                flag_failed = True
                self._update_job_status_failed_cannot_load_params_and_all_q(id)

            # commented for testing
            if not flag_failed:
                paths_image_projects = self._get_immediate_subdirectories(path)

                try:
                    paths_image_projects.remove('outputs')
                except:
                    print('not in the list')

                try:
                    if not os.path.isdir(path + '/outputs'):
                        os.mkdir(path + '/outputs')
                    output_dir = path + '/outputs'
                    output_paths = []
                    for paths_image_project in paths_image_projects:
                        if not os.path.isdir(output_dir + '/' + os.path.basename(paths_image_project)):
                            os.mkdir(output_dir + '/' + os.path.basename(paths_image_project))
                        output_dir_image_projects = output_dir + '/' + os.path.basename(paths_image_project)
                        output_path = None
                except:
                    self._update_job_status_failed_remote_file_creation_and_all_q(id)
                    flag_failed = True

                # commented for testing
            if not flag_failed:
                try:
                    if gen_model == 'GLB':

                        ### commmented for testing!
                        output_path = api_all_steps_SfM_global_all_params(
                            input_dir=path + '/' + paths_image_project + '/',
                            output_dir=output_dir_image_projects + '/',
                            force_focal_len_calc=force_focal_len_calc,
                            focal_len=focal_len,
                            surface_recon=surface_recon,
                            surface_recon_depth=surface_recon_depth,
                            poisson_recon_degree=poisson_recon_degree,
                            surface_recon_colour=surface_recon_colour,
                            poisson_recon_sample_per_node=poisson_recon_sample_per_node,
                            poisson_recon_density=poisson_recon_density,
                            ssd_recon_degree=ssd_recon_degree,
                            surface_trim=surface_trim,
                            surface_trim_trim_threshold=surface_trim_trim_threshold,
                            surface_trim_polygon_mesh=surface_trim_polygon_mesh,
                            surface_trim_smooth=surface_trim_smooth)

                    elif gen_model == 'SEQ':
                        output_path = api_all_steps_SfM_sequential_all_params(paths_image_project + '/',
                                                                              output_dir_image_projects + '/',
                                                                              force_focal_len_calc=force_focal_len_calc,
                                                                              focal_len=focal_len,
                                                                              surface_recon=surface_recon,
                                                                              surface_recon_depth=surface_recon_depth,
                                                                              poisson_recon_degree=poisson_recon_degree,
                                                                              surface_recon_colour=surface_recon_colour,
                                                                              poisson_recon_sample_per_node=poisson_recon_sample_per_node,
                                                                              poisson_recon_density=poisson_recon_density,
                                                                              ssd_recon_degree=ssd_recon_degree,
                                                                              surface_trim=surface_trim,
                                                                              surface_trim_trim_threshold=surface_trim_trim_threshold,
                                                                              surface_trim_polygon_mesh=surface_trim_polygon_mesh,
                                                                              surface_trim_smooth=surface_trim_smooth)
                    output_paths.append(output_path)
                    self._update_job_status_finished(id)
                except Exception as e:
                    print(e)
                    self._update_job_status_failed_processing_and_all_q(id)

#
# obj = processSequence()
# obj.get_not_started_jobs()
# print('test')
