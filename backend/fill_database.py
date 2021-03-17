import sqlite3
import csv

with open('dummy_data/summary.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    to_db = [(i['Name'], i['RA'], i['DE'], i['class']) for i in dr]

con = sqlite3.connect('db.sqlite3')
cursor = con.cursor()

try:
    cursor.executemany("INSERT INTO source_source(Name,RA,Dec,category) VALUES(?,?,?,?)", to_db)
    con.commit()
except Exception as error:
    pass

con.close()
