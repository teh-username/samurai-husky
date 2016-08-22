import os
import sqlite3

# configs
db_dir = os.getcwd() + '/db.sqlite'

def run_migrations():
    # init db here
    conn = sqlite3.connect(db_dir)
    c = conn.cursor()

    # create traceroute table
    c.execute('CREATE TABLE IF NOT EXISTS traceroute (id INTEGER PRIMARY KEY, route TEXT, UNIQUE(route))')

    # create ping table
    c.execute('CREATE TABLE IF NOT EXISTS ping (id INTEGER PRIMARY KEY, time TEXT)')

    # create comments table
    c.execute('CREATE TABLE IF NOT EXISTS comment (id INTEGER PRIMARY KEY, blog TEXT, name TEXT, comment TEXT)')

    # commit
    conn.commit()
    conn.close()

if __name__ == '__main__':
    run_migrations()
