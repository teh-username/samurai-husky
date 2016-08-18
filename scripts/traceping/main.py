from traceroute import Traceroute
from time import strftime
import json
import os
import sqlite3
import subprocess

# configs
db_dir = os.getcwd() + '/../../db.sqlite'
target_site = "reddit.com"
source = {"url": ("traceroute "+target_site)}

def init_db():
    if os.path.isfile(db_dir):
        return

    # init db here
    conn = sqlite3.connect(db_dir)
    c = conn.cursor()

    # create traceroute table
    c.execute('CREATE TABLE traceroute (id INTEGER PRIMARY KEY, route TEXT, UNIQUE(route))')

    # create ping table
    c.execute('CREATE TABLE ping (id INTEGER PRIMARY KEY, time TEXT)')

    # commit
    conn.commit()
    conn.close()

def perform_traceroute():
    traceroute = Traceroute(target_site, source=source, country="LO")
    last_coor = ()
    filtered_hops = []

    # removes consecutive same coor
    for hop in traceroute.traceroute():
        cur_coor = (hop['longitude'], hop['latitude'])
        if cur_coor == last_coor:
            continue
        last_coor = cur_coor
        filtered_hops.append(hop)
    
    conn = sqlite3.connect(db_dir)
    c = conn.cursor()
    c.execute('INSERT OR IGNORE INTO traceroute (route) VALUES (?)', (json.dumps(filtered_hops),))
    conn.commit()
    conn.close()

def perform_ping():
    try:
        response = subprocess.check_output(
            ['ping', '-c', '1', 'reddit.com'],
            stderr=subprocess.STDOUT,  # get all output
            universal_newlines=True  # return string not bytes
        )
        response = response.split('\n\n')[0].split('time=')[-1]
    except:
        response = None

    if response == None:
        return

    conn = sqlite3.connect(db_dir)
    c = conn.cursor()
    c.execute('INSERT INTO ping (time) VALUES (?)', (response,))
    conn.commit()
    conn.close()

if __name__ == '__main__':
    print 'traceping running: ' + strftime("%Y-%m-%d %H:%M:%S")
    init_db()
    perform_traceroute()
    perform_ping()
