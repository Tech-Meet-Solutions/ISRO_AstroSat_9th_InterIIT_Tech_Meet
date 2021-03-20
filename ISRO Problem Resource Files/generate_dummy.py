# CSV file format : Id Num, Source Name, RA, Dec, isobserved, dummy, description
# JSON file for Publications format: {{Id : Id Num, {} }}

import csv
import random

with open('data_csv.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    with open('dummy_data.csv', mode='w') as csv_file2:
        writer = csv.writer(csv_file2, delimiter=',')
        source = 1
        for row in csv_reader:
            i1 = random.randrange(1, 88)
            i2 = random.randrange(1, 88)

            writer.writerow([source, 'Src' + str(source), row[5], row[6], True, row[8], str(i1) + "," + str(i2)])

            source += 1
