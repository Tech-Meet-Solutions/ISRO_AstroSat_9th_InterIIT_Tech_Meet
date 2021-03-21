import csv
import numpy as np
import sqlite3
import json
import sys
def Round(a):
    return float(np.round(float(a), 4))


with open('data/publications.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    to_db_pub = [(i['ID'], i['TITLE'], i['URL']) for i in dr]

src_pub = []
# To fill db with catalog B sources
with open('data/summaryB.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    len_cat_B = 0
    to_db_src_B = [(i['idx'], i['name'], Round(i['ra']), Round(i['dec']), i['ins']) for i in dr]


# To fill db with catalog A sources

with open('data/summaryA.csv', 'r') as fA:
    dr = csv.DictReader(fA)
    count_A=0
    for i in dr:
        count_A+=1

print("in A ",count_A)
with open('data/summaryA.csv', 'r') as fA:
    l1=[]
    
    dr = csv.DictReader(fA)
    l1 = [ (i['Id'], i['Name'], i['RA'], i['DE'], i['class']) for i in dr]
    
with open('data/observed_A.csv','r') as f_obs:
    l2 = []
    dr = csv.DictReader(f_obs)
    l2 = [(i["observed_uvit"], i["observed_sxt"], i["observed_laxpc"], i["observed_czti"], i['ID_A']) for i in dr]

to_db_src_A = []

for i in zip(l1,l2):
    a = i[0]
    b = i[1]
    to_db_src_A.append((a[0],a[1],a[2],a[3],b[0],b[1],b[2],b[3],a[4]))

    #id,Name,RA,Dec,uvit,sxt,laxpc,czti,category


with open('data/observed_A_full.txt') as json_file:
    data = json.load(json_file)
    # dictionaries
    uvit = data['uvit']
    laxpc = data['laxpc']
    czti = data['czti']
    sxt = data['sxt']


obs_lax = []
obs_sx = []
obs_cz = []
obs_uv = []


for val in l2:
    uv = val[0]
    sx = val[1]
    lax = val[2]
    cz = val[3]
    id_src = val[4]
    if (uv=='True'):
        c = uvit[str(id_src)]
        for src_B in c:
            obs_uv.append((id_src,src_B))
    if (cz=='True'):
        c = czti[str(id_src)]
        for src_B in c:
            obs_cz.append((id_src,src_B))
    if (lax=='True'):
        c = laxpc[str(id_src)]
        for src_B in c:
            obs_lax.append((id_src,src_B))
    if (sx=='True'):
        c = sxt[str(id_src)]
        for src_B in c:
            obs_sx.append((id_src,src_B))


    

#sys.exit(0)

con = sqlite3.connect('db.sqlite3')
cursor = con.cursor()


# insert publication data to db
try:
    cursor.executemany("INSERT INTO source_publication(identifier,Name,URL) VALUES(?,?,?)", to_db_pub)
    con.commit()
except Exception as error:
    print(error)


# insert catalog A data to db
try:
    cursor.executemany("INSERT INTO source_sourcea(id, Name,RA,Dec,isObserved_uvit,isObserved_sxt,isObserved_laxpc,isObserved_czti,category) VALUES(?,?,?,?,?,?,?,?,?)", to_db_src_A)
    con.commit()
except Exception as error:
    print(error)

# insert catalog B data to db
try:
    cursor.executemany("INSERT INTO source_sourceb(id, Name,RA,Dec,category) VALUES(?,?,?,?,?)", to_db_src_B)
    con.commit()
except Exception as error:
    print(error)

# insert common uvit data to db
try:
    cursor.executemany("INSERT INTO source_sourcea_uvit(sourcea_id,sourceb_id) VALUES(?,?)", obs_uv)
    con.commit()
except Exception as error:
    print(error)

# insert common sxt data to db
try:
    cursor.executemany("INSERT INTO source_sourcea_sxt(sourcea_id,sourceb_id) VALUES(?,?)", obs_sx)
    con.commit()
except Exception as error:
    print(error)

# insert common laxpc data to db
try:
    cursor.executemany("INSERT INTO source_sourcea_laxpc(sourcea_id,sourceb_id) VALUES(?,?)", obs_lax)
    con.commit()
except Exception as error:
    print(error)

# insert common czti data to db
try:
    cursor.executemany("INSERT INTO source_sourcea_czti(sourcea_id,sourceb_id) VALUES(?,?)", obs_cz)
    con.commit()
except Exception as error:
    print(error)




# insert catalog B source and publication data to db
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
