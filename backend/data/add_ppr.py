import csv

publication_file = "AS_publications2019-21.txt"
# print(source_identifiers)
c = 0
bib_to_index = {}
pub = {}
with open(publication_file) as file:
	bib = ""
	title=""
	keywords=""
	abstract=""
	index = 1
	ppr_list
    for row in file:
    	if "Title:" in row:
    		title=row
    		pl = search_source(pub, index, row, source_identifiers, not_found)
    		# pub[index]+=pl
        if "Keywords:" in row:
            pl = search_source(pub, index, row, source_identifiers, not_found)    
        if "Abstract:" in row:
            #pub[index] = []
            pl = search_source(pub, index, row, source_identifiers, not_found)
            # pub[index]+=pl
        if "URL" in row:
            index += 1
        if "Bibliographic Code:" in row:
            bib = row[29:-1]
            bib_to_index[bib] = index


print(pub)