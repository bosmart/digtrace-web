import sqlite3
import os.path
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")

if len(sys.argv) > 1:
    job_id = int(sys.argv[1])
else:
    exit(0)


# DATABASE_NAME = os.path.abspath("database_sqlite3.db")
def connect():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        return conn
    except:
        return print('database not found')


def show():
    conn = connect()

    Statement_job_table = '''SELECT * FROM Jobs WHERE id = ?'''
    outputs = ''
    try:
        if conn is not None:
            value = conn.execute(Statement_job_table, (job_id,))

            for v in value:
                outputs = outputs + str(v)
            print(outputs)




    except Exception as e:
        print(e)
        print('error')


show()
