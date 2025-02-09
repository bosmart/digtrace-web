import sqlite3
import datetime
import os.path

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")
# DATABASE_NAME = os.path.abspath("database_sqlite3.db")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")


def connect():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        return conn
    except:
        return print('database not found')


def intialise():
    insertStatement = "INSERT INTO Status (current_status,datetime) VALUES (?,?)"
    conn = connect()
    try:
        if conn is not None:
            conn.execute(insertStatement, ('running', datetime.datetime.now(),))
            conn.commit()
            return ("inserted")

    except Exception as e:
        print(e)
        return ("error! cannot insert")


intialise()
