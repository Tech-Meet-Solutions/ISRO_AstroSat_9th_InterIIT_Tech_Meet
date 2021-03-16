import sqlite3

con = sqlite3.connect('db.sqlite3')

cursor = con.cursor()
con.close()