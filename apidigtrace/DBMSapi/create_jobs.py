import sys
import sqlite3
import datetime

import os.path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")
# DATABASE_NAME = os.path.abspath("database_sqlite3.db")
job_path = sys.argv[1]


def connect():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        return conn
    except:
        return 'database not found'


def insert():
    insertStatement = '''INSERT INTO Jobs(path,datetime_created,datetime_processing_started,priority,status,ply,queue) VALUES (?,?,?,?,?,?,?)'''
    conn = connect()
    cursor = conn.cursor()

    try:
        if conn is not None:
            cursor.execute(insertStatement, (
            job_path, datetime.datetime.now(), 'not_started', 'mid', 'created', 'not_created', 'not_assigned'))
            conn.commit()
            print(cursor.lastrowid)

    except Exception as e:
        print(e)
        return ("error! cannot insert")


insert()
