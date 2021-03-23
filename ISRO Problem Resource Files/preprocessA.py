import csv
import os
from astropy.io import ascii

tab = ascii.read("Catalog_A.dat")
tab.write("combinedA.csv", format='csv', overwrite=True)
to_include = ['Name','Type','RA','DE','GLON','GLAT','Opt','r_Opt',
			  'Vmag','B-V','U-B','E(B-V)','r_Vmag','Fx','Range','r_Fx','Porb','Porb2',
			  'Ppulse','r_Ppulse','Cat','SpType','class']
tab.write("combinedA.csv", format='csv', overwrite=True, include_names=to_include)

with open('combinedA.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    dr = csv.DictReader(csv_file)
    with open('summaryA.csv', mode='w') as csv_file2:
        writer = csv.writer(csv_file2, delimiter=',')
        writer.writerow(['Id']+to_include)
        source = 1
        for row in dr:
            writer.writerow([source,row['Name'],row['Type'],row['RA'],row['DE'],row['GLON'],row['GLAT'],row['Opt'],row['r_Opt'],
			  row['Vmag'],row['B-V'],row['U-B'],row['E(B-V)'],row['r_Vmag'],row['Fx'],row['Range'],row['r_Fx'],row['Porb'],row['Porb2'],
			  row['Ppulse'],row['r_Ppulse'],row['Cat'],row['SpType'],row['class']])
            source += 1

os.remove("combinedA.csv")
with open('hmxbrefs.dat') as ref:
	with open("hmxbrefs.csv", "w") as out_csv:
		out_writer = csv.writer(out_csv, delimiter=',')
		for line in ref:
			row=[line[0:6].strip(), line[6:25].strip(), line[25:55].strip(),line[55].strip()]
			out_writer.writerow(row)

with open('lmxbrefs.dat') as ref:
	with open("lmxbrefs.csv", "w") as out_csv:
		out_writer = csv.writer(out_csv, delimiter=',')
		for line in ref:
			bib=line[6:25].strip()
			if line[6:25].strip()=="...................":
				bib=""
			row=[line[0:6].strip(),bib , line[25:61].strip(),line[61:].strip()]
			out_writer.writerow(row)







## TO add identifier to each source in the summary.csv file
#with open('combinedA.csv') as csv_file:
#    csv_reader = csv.reader(csv_file, delimiter=',')
#    dr = csv.DictReader(csv_file)
#    with open('summaryA.csv', mode='w') as csv_file2:
#        writer = csv.writer(csv_file2, delimiter=',')
#        writer.writerow(['Id', 'Name', 'RA', 'DE', 'class'])
#        source = 1
#        for row in dr:
#            writer.writerow([source, row['Name'], row['RA'], row['DE'], row['class']])
#            source += 1
#
#
#os.remove("combinedA.csv")
