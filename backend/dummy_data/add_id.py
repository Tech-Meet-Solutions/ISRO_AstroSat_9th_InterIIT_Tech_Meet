# TO add identifier to each source in the summary.csv file

import csv
import random
with open('summary.csv') as csv_file:
	csv_reader = csv.reader(csv_file, delimiter=',')
	dr = csv.DictReader(csv_file)
	with open('catalog_A.csv', mode='w') as csv_file2:
		writer = csv.writer(csv_file2,delimiter=',')
		source = 1
		for row in dr:
			
			writer.writerow([source,row['Name'],row['RA'],row['DE'],row['class']])
			
			source+=1

