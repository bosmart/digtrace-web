import sqlite3
import os.path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")


# DATABASE_NAME = os.path.abspath("database_sqlite3.db")

def connect():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        return conn
    except:
        return 'database not found'


def creat_table():
    conn = connect()

    sql_create_job_table = ''' CREATE TABLE IF NOT EXISTS Jobs (
                                        id integer PRIMARY KEY,
                                        path text NOT NULL,
                                        datetime_created text,
                                        datetime_processing_started text,
                                        priority text,
                                        status text,
                                        ply text,
                                        queue integer
                                    ) '''

    sql_create_processor_status_table = ''' CREATE TABLE IF NOT EXISTS Status (
                                        id integer PRIMARY KEY,
                                        current_status text NOT NULL,
                                        datetime text
                                 
                                    ) '''

    #
    # sql_create_tasks_table = """CREATE TABLE IF NOT EXISTS tasks (
    #                                 id integer PRIMARY KEY,
    #                                 name text NOT NULL,
    #                                 priority integer,
    #                                 status_id integer NOT NULL,
    #                                 project_id integer NOT NULL,
    #                                 begin_date text NOT NULL,
    #                                 end_date text NOT NULL,
    #                                 FOREIGN KEY (project_id) REFERENCES projects (id)
    #                             );"""

    # create a database connection
    try:
        if conn is not None:
            conn.execute(sql_create_job_table)
            conn.execute(sql_create_processor_status_table)
            print("created")
            return ("created")


    except Exception as e:
        print(e)
        return ("error! cannot create the database table.")


creat_table()
