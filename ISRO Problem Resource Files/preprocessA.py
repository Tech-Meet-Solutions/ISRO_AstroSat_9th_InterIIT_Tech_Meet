import csv 
from astropy.io import ascii
import os

tab = ascii.read("Combined.dat", format='ecsv')
tab.write("combinedA.csv", format='csv', overwrite=True)

# TO add identifier to each source in the summary.csv file
with open('combinedA.csv') as csv_file:
	csv_reader = csv.reader(csv_file, delimiter=',')
	dr = csv.DictReader(csv_file)
	with open('summaryA.csv', mode='w') as csv_file2:
		writer = csv.writer(csv_file2,delimiter=',')
		source = 1
		for row in dr:
			writer.writerow([source,row['Name'],row['RA'],row['DE'],row['class']])
			source+=1


os. remove("combinedA.csv") 