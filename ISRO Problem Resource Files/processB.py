# CSV file format : Id Num, Source Name, RA, Dec, isobserved, dummy, description
# JSON file for Publications format: {{Id : Id Num, {} }}

import csv

with open("AS_observations_cat_Sept2018.txt", "r") as in_text:
    in_reader = csv.reader(in_text, delimiter='\t')
    with open("AS_observations_cat_Sept2018.csv", "w") as out_csv:
        out_writer = csv.writer(out_csv, delimiter=',')
        for row in in_reader:
            out_writer.writerow(row)


with open('AS_observations_cat_Sept2018.csv') as csv_file:
    dr = csv.DictReader(csv_file)
    with open('summaryB.csv', mode='w') as csv_file2:
        writer = csv.writer(csv_file2, delimiter=',')
        writer.writerow(['idx', 'date_time','proposal_id','target_id','obsid','object', 'ra', 'dec', 'ins'])
        for row in dr:
            if "::" in row['obsid_object']:
                writer.writerow([row['idx'],row['date'],row['Proposal_ID'],row['Target_ID'],
                                 row['obsid_object'].partition("::")[0].strip(),row['obsid_object'].partition("::")[2].strip(), row['ra'], row['dec'], row['ins']])
            else:
                writer.writerow([row['idx'],row['date'],row['Proposal_ID'],row['Target_ID'],
                                 "",row['obsid_object'], row['ra'], row['dec'], row['ins']])