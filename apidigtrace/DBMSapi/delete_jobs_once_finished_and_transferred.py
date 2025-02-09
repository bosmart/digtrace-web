import sqlite3
import os.path
import sys
import sched
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")

if len(sys.argv) > 1:
    try:
        job_ids = list(map(int, sys.argv[1:]))
    except:
        print('Arguments are not correct!')
else:
    exit(0)


# DATABASE_NAME = os.path.abspath("database_sqlite3.db")
def connect():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        return conn
    except:
        return print('database not found')


def delete_rows():
    conn = connect()

    Statement_job_table = '''SELECT path FROM Jobs WHERE id = ? AND status = ?'''
    Statement_job_table_delete = '''DELETE FROM Jobs WHERE id = ? AND status = ?'''

    try:
        for job_id in job_ids:
            if job_id is not None:
                if conn is not None:
                    value = conn.execute(Statement_job_table, (job_id, 'finished',))
                    main_dir = value.fetchone()
                    main_dir = str(main_dir)
                    main_dir = main_dir.strip('(),\'\'')
                    print(main_dir)
                    shutil.rmtree(main_dir)
                    deleted = conn.execute(Statement_job_table_delete, (job_id, 'finished',))
                    conn.commit()





    except Exception as e:
        print(e)
        print('error')


delete_rows()
