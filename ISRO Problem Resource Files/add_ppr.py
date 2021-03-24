import csv

publication_file = "AS_publications2019-21.txt"
# print(source_identifiers)

with open(publication_file) as file:
	bib = ""
	title=""
	keywords=""
	abstract=""
	index = 1
	
	with open("pub.csv",'w') as f2:
		out_writer = csv.writer(f2, delimiter=',')
		out_writer.writerow(['Idx','Title','Keywords','Abstract','Bib','Authors'])
		for row in file:
			if "Title:" in row:
				title=row[14:].strip()
				# pub[index]+=pl
			if "Keywords:" in row:
				keywords=row[11:].strip()
			if "Abstract:" in row:
				abstract=row[20:].strip()
			if "URL" in row:
				out_writer.writerow([index,title,keywords,abstract,bib,authors])
				index += 1
			if "Bibliographic Code:" in row:
				bib = row[29:].strip()
				
			if "Authors:" in row:
				authors = row[17:].strip()


