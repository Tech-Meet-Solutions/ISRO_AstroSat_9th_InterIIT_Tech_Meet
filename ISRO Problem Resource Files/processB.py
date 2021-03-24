# CSV file format : Id Num, Source Name, RA, Dec, isobserved, dummy, description
# JSON file for Publications format: {{Id : Id Num, {} }}

import csv
import os
with open("AS_observations_cat_Sept2018.txt", "r") as in_text:
    in_reader = csv.reader(in_text, delimiter='\t')
    with open("AS_observations_cat_Sept2018.csv", "w") as out_csv:
        out_writer = csv.writer(out_csv, delimiter=',')
        for row in in_reader:
            out_writer.writerow(row)


with open('AS_observations_cat_Sept2018.csv') as csv_file:
    dr = csv.DictReader(csv_file)
    with open('summaryb.csv', mode='w') as csv_file2:
        writer = csv.writer(csv_file2, delimiter=',')
        writer.writerow(['idx', 'date_time','proposal_id','target_id','obsid','object', 'ra', 'dec', 'ins'])
        for row in dr:
            if "::" in row['obsid_object']:
                writer.writerow([row['idx'],row['date'],row['Proposal_ID'],row['Target_ID'],
                                 row['obsid_object'].partition("::")[0].strip(),row['obsid_object'].partition("::")[2].strip(), row['ra'], row['dec'], row['ins']])
            else:
                writer.writerow([row['idx'],row['date'],row['Proposal_ID'],row['Target_ID'],
                                 "",row['obsid_object'], row['ra'], row['dec'], row['ins']])

propsals={}

with open('proposals.csv') as pf:
    dr = csv.DictReader(pf)
    for row in dr:
        propsals[row["PROPOSALID"]] = [row["ABSTRACT"],row["PI"]]


with open('summaryb.csv',mode='r') as f1:
    dr = csv.DictReader(f1)
    with open('summaryB.csv', mode='w') as csv_file2:
        writer = csv.writer(csv_file2, delimiter=',')
        writer.writerow(['idx', 'date_time','proposal_id','target_id','obsid','object', 'ra', 'dec', 'ins','abstract','PI'])
        for row in dr:
            if row["proposal_id"] in propsals:
                a = propsals[row["proposal_id"]]
                abst = a[0] 
                pi = a[1]
            else:
                abst=""
                pi=""
            writer.writerow([row["idx"],row["date_time"],row["proposal_id"],row["target_id"],
                row["obsid"],row["object"],row["ra"],row["dec"],row["ins"],abst,
                pi])

os.remove("summaryb.csv")