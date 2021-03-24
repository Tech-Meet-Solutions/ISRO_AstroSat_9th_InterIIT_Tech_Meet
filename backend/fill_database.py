import csv
import numpy as np
import sqlite3
import json
import sys


def Round(a):
    return float(np.round(float(a), 4))

def convert_bool(a):
    if a=="True":
        return True
    return False


## Make a set of refs which are referred to by any source in either hm
lmxb=set()
hmxb=set()
with open("data/summaryA.csv") as file1:
    csv_reader = csv.DictReader(file1)
    for row in csv_reader:
        if row["class"] =="lmxb":
            
            for i in row["r_Opt"].split(','):
                if i =="":
                    continue
                lmxb.add(i.strip())
            for i in row["r_Fx"].split(','):
                if i =="":
                    continue
                lmxb.add(i.strip())
            for i in row["r_Vmag"].split(','):
                if i =="":
                    continue
                lmxb.add(i.strip())
            for i in row["r_Ppulse"].split(','):
                if i =="":
                    continue
                lmxb.add(i.strip())

        elif row["class"] =="hmxb":
            
            for i in row["r_Opt"].split(','):
                if i =="":
                    continue
                hmxb.add(i.strip())
            for i in row["r_Fx"].split(','):
                if i =="":
                    continue
                hmxb.add(i.strip())
            for i in row["r_Vmag"].split(','):
                if i =="":
                    continue
                hmxb.add(i.strip())
            for i in row["r_Ppulse"].split(','):
                if i =="":
                    continue
                hmxb.add(i.strip())
        else:
            print("UNKNOWN SOURCE")
            

hmxb_full = {}
lmxb_full = {}
with open("data/hmxbrefs.csv") as hmxbref_file:
    #use numpy to select only those rows  which have 
    dr = csv.DictReader(hmxbref_file)
    for row in dr:
        hmxb_full[row["id"]] = (row["id"],row["bib"],row["Name"],row["desc"])


with open("data/lmxbrefs.csv") as lmxbref_file:
    #use numpy to select only those rows  which have 
    dr = csv.DictReader(lmxbref_file)
    for row in dr:
        lmxb_full[row["id"]] = (row["id"],row["bib"],row["Name"],row["desc"])
    
hmxb_to_add=[]
for i in hmxb:
    if not i in hmxb_full:
        continue
    t = hmxb_full[i]
    hmxb_to_add.append((t[0]+"_hmxb",t[1],t[2],t[3]))

lmxb_to_add=[]
for i in lmxb:
    if not i in lmxb_full:
        continue
    t = lmxb_full[i]
    lmxb_to_add.append((t[0]+"_lmxb",t[1],t[2],t[3]))

hmxb_to_add = hmxb_to_add+lmxb_to_add
##

#sys.exit(0)


with open('data/publications.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    to_db_pub = [(i['ID'], i['TITLE'], i['URL'], "","","") for i in dr]

# sourceA -paper mapping tuple 
src_pub = []
with open('data/summaryA.csv') as f:
    dr = csv.DictReader(f)
    for row in dr:
        if row['Papers']=="":
            continue
        for ppr_id in row['Papers'].split(','):
            src_pub.append((int(row['Id']),int(ppr_id.strip())))



# To fill db with catalog B sources
with open('data/summaryB.csv', 'r') as fin:
    dr = csv.DictReader(fin)
    len_cat_B = 0
    to_db_src_B = [(i['idx'], str(i['object']),str(i['obsid']), Round(i['ra']), Round(i['dec']), str(i['ins']), 
                    str(i['date_time']),str(i['proposal_id']),str(i['target_id']),i['abstract'],i['PI'])
                    for i in dr]
                            

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
    l1 = [ (i['Id'], str(i['Name']), Round(i['RA']), Round(i['DE']), i['B-V'],i['Cat'],i['class'],i['E(B-V)'],i['Fx'],
        i['GLAT'],i['GLON'],i['Opt'],i['Porb'],i['Porb2'],i['Ppulse'],i['Range'],i['SpType'],i['Type'],i['U-B'],i['Vmag'],
        i['r_Fx'],i['r_Opt'],i['r_Ppulse'],i['r_Vmag']) for i in dr]
    
with open('data/observed_A.csv','r') as f_obs:
    l2 = []
    dr = csv.DictReader(f_obs)
    l2 = [(i["observed_uvit"], i["observed_sxt"], i["observed_laxpc"], i["observed_czti"], i['ID_A']) for i in dr]

to_db_src_A = []

for i in zip(l1,l2):
    a = i[0]
    b = i[1]
    to_db_src_A.append((a[0],a[1],a[2],a[3],convert_bool(b[0]),convert_bool(b[1]),convert_bool(b[2]),convert_bool(b[3]),a[4],a[5],
        a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15],a[16],a[17],a[18],a[19],a[20],a[21],a[22],a[23]))

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
    cursor.executemany("INSERT INTO source_publication(identifier,Name,Bib,Authors,Keywords,Abstract) VALUES(?,?,?,?,?,?)", to_db_pub)
    con.commit()
except Exception as error:
    print(error)


# insert catalog A data to db
try:
    cursor.executemany("INSERT INTO source_sourcea(id, Name,RA,Dec,isObserved_uvit,isObserved_sxt,isObserved_laxpc,isObserved_czti,B_V,Cat,Class,E_BV,Fx,GLAT,GLON,Opt,Porb,Porb2,Ppulse,Range,SpType,Type,U_B,Vmag,r_Fx,r_Opt,r_Ppulse,r_Vmag) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", to_db_src_A)
    con.commit()
except Exception as error:
    print(error)

# insert catalog B data to db
try:
    cursor.executemany("INSERT INTO source_sourceb(id,Object,obsid,RA,Dec,instrument,date_time,proposal_id,target_id,observer,abstract) VALUES(?,?,?,?,?,?,?,?,?,?,?)", to_db_src_B)
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

# insert hmxbrefs and lmxbrefs data  to db
try:
    cursor.executemany("INSERT INTO source_refs(id,bib,Name,desc) VALUES(?,?,?,?)", hmxb_to_add)
    con.commit()
except Exception as error:
    print(error)




# insert catalog B source and publication data to db
for entry in src_pub:
    try:
        cursor.execute("INSERT INTO source_sourcea_Publications(sourcea_id,publication_id) VALUES(?,?)", entry)
        con.commit()
    except Exception as error:
        print(error)

con.commit()

con.close()
