import sqlite3
import os.path

# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = os.path.join(BASE_DIR, "database_sqlite3.db")


#
# DATABASE_NAME = os.path.abspath("database_sqlite3.db")
#

def connect():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        return conn
    except:
        return print('database not found')


def show():
    showStatement_table_status = 'SELECT * FROM Status'
    conn = connect()
    try:
        if conn is not None:
            print('Status Table')
            for row in conn.execute(showStatement_table_status):
                print(row)

    except Exception as e:
        print(e)
        print("error! cannot show status table")

    showStatement_table_jobs = 'SELECT * FROM Jobs'
    conn = connect()
    try:
        if conn is not None:
            print('Jobs Table')
            for row in conn.execute(showStatement_table_jobs):
                print(row)

    except Exception as e:
        print(e)
        print("error! cannot show jobs table")


show()
