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
        return print('database not found')


def show():
    conn = connect()

    showStatement_table_status = '''SELECT * FROM Status ORDER BY id DESC LIMIT 1'''

    try:
        if conn is not None:
            value = conn.execute(showStatement_table_status)
            print(value.fetchone()[1])

    except Exception as e:
        print(e)
        print('error')


show()
