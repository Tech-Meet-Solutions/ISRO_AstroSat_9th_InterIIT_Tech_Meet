import sqlite3
import csv


with open('dummy_data/publications.csv', 'r') as fin:
	dr = csv.DictReader(fin)
	to_db_pub = [(i['ID'], i['TITLE'], i['URL']) for i in dr]

with open('dummy_data/catalog_B_dummy.csv', 'r') as fin:
	dr = csv.DictReader(fin)
	src_pub = [( int(i['ID']), ppr ) for i in dr for ppr in i['Publications'].split(',') if ppr!='-']

#To fill db with catalog B sources
with open('dummy_data/catalog_B_dummy.csv', 'r') as fin:
	dr = csv.DictReader(fin)
	len_cat_B = 0
	to_db_src_A = [(i['ID'], i['NAME'], i['RA'], i['Dec'], True, i['Desc']) for i in dr]

#count number of entries in A
with open('dummy_data/catalog_B_dummy.csv', 'r') as fin:
	dr = csv.DictReader(fin)
	len_cat_B = 0
	for i in dr:
		len_cat_B += 1

#To fill db with catalog A sources
with open('dummy_data/catalog_A.csv', 'r') as fin:
    dr = csv.DictReader(fin)
	
    to_db_src_B = [( int(i['Id'])+len_cat_B, i['Name'], i['RA'], i['DE'],False, i['class']) for i in dr]


con = sqlite3.connect('db.sqlite3')
cursor = con.cursor()

try:
    cursor.executemany("INSERT INTO source_publication(identifier,Name,URL) VALUES(?,?,?)", to_db_pub)
    con.commit()
except Exception as error:
    print(error)

try:
    cursor.executemany("INSERT INTO source_source(id, Name,RA,Dec,isObserved,category) VALUES(?,?,?,?,?,?)", to_db_src_A)
    con.commit()
except Exception as error:
    print(error)


try:
    cursor.executemany("INSERT INTO source_source(id, Name,RA,Dec,isObserved,category) VALUES(?,?,?,?,?,?)", to_db_src_B)
    con.commit()
except Exception as error:
    print(error)


for entry in src_pub:
	if entry[1][0] == "-":
		continue
	try:
		cursor.execute("INSERT INTO source_source_Publications(source_id,publication_id) VALUES(?,?)", entry)
		con.commit()
	except Exception as error:
		print(error)

con.commit()

con.close()
