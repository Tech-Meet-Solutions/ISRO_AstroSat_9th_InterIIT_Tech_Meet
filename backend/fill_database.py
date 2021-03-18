import sqlite3
import csv


with open('dummy_data/publications.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    to_db_pub = [(i['ID'], i['TITLE'], i['URL']) for i in dr]

with open('dummy_data/dummy_data.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    src_pub = [(i['NAME'], i['Publications']) for i in dr]

with open('dummy_data/dummy_data.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    to_db_src = [(i['NAME'], i['RA'], i['Dec'], i['isObserved'], i['Desc']) for i in dr]


con = sqlite3.connect('db.sqlite3')
cursor = con.cursor()

try:
    cursor.executemany("INSERT INTO source_publication(identifier,Name,URL) VALUES(?,?,?)", to_db_pub)
    con.commit()
except Exception as error:
    print(error)

try:
    cursor.executemany("INSERT INTO source_source(Name,RA,Dec,isObserved,category) VALUES(?,?,?,?,?)", to_db_src)
    con.commit()
except Exception as error:
    print(error)

for entry in src_pub:
    source = entry[0]
    papers = entry[1]
    papers = papers.split(",")
    query_res = cursor.execute("SELECT id FROM source_source" + " WHERE Name = '" + source + "';")
    for row in query_res:
        src_id = row[0]
    pprs = []
    for paper in papers:
        if paper == "-":
            continue
        query = "SELECT id FROM source_publication" + " WHERE identifier = " + paper + ";"
        query_res = cursor.execute(query)
        for row in query_res:
            pprs.append((src_id, row[0]))
    if papers[0] == "-":
        continue
    try:
        cursor.executemany("INSERT INTO source_source_Publications(source_id,publication_id) VALUES(?,?)", pprs)
        con.commit()
    except Exception as error:
        print(error)

con.commit()

con.close()
