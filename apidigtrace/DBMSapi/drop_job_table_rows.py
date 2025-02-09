import sys
import sqlite3
import datetime
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


def drop_job_rows():
    statement = '''DELETE FROM Jobs'''
    conn = connect()
    try:
        if conn is not None:
            # cur = conn.cursor()
            conn.execute(statement)
            conn.commit()
            conn.close()
            print('dropped')


    except Exception as e:
        print(e)
        return ("error! cannot drop")


drop_job_rows()
