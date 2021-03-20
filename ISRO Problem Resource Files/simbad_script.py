import csv
import re
import sys

from astroquery.simbad import Simbad


def join_with_space(word_list):
    # expects a non zero word_list list
    reg_word = word_list[0]
    if "*" in word_list:
        return join_with_space(word_list[1:])

    # print(word_list)
    for word in word_list[1:]:
        if "*" in word:
            continue
        reg_word += "\s*" + word
    # print(reg_word)
    if "+" in reg_word:
        reg_word = re.sub(r"\+", r'\\s*\+\\s*', reg_word)
    # new_word=""

    # print(reg_word)
    return reg_word

#print(join_with_space("GRS 1905+251  ".split()))


def is_match(reg_word, line):
    #print("is_match  ",reg_word)
    x = re.search(reg_word, line)
    if x:
        return True
    return False


def search_source(pub, index, line, source_identifiers, not_found):
    sources_found = []

    for key in source_identifiers:

        if key in not_found:
            continue
        word = join_with_space(key.split())

        if is_match(word, line):

            sources_found.append(key)
            #print("found ", key," in ", line )
            continue
        for src in source_identifiers[key]:
            word = join_with_space(src.split())
            if is_match(src, line):
                #print("FOUND A MATCH")
                #print(line, src)
                sources_found.append(key)
                break
        #print("Sources: ",sources_found)
    pub[index] += sources_found
    # print(pub[index])
    return sources_found


data_file = "data_csv.csv"
source_names = set()


with open(data_file) as file:
    csv_reader = csv.reader(file, delimiter=",")
    for row in csv_reader:
        source_names.add(row[-2])
# print(source_names)
source_names = list(source_names)
source_identifiers = {}
not_found = []

#source_names=["M31 Field No. 2"]
for src in source_names:

    try:
        result = Simbad.query_objectids(src)

        source_identifiers[src] = result["ID"]
        #print("ERROR: ",result.errors)
        # if type(result)!=None:
        #	print(result.columns)
    except Exception as err:
        not_found.append(src)

# print(source_identifiers)
# print(source_identifiers[source_names[1]][1])
# print(source_identifiers)
publication_file = "AS_publications2019-21.txt"
# print(source_identifiers)
c = 0
bib_to_index = {}
pub = {}
with open(publication_file) as file:
    #csv_reader = csv.reader(file, delimiter=",")
    bib = ""

    index = 0
    #appeared_in = []
    for row in file:
        if "Title:" in row:
            pub[index] = []
            pl = search_source(pub, index, row, source_identifiers, not_found)
            # pub[index]+=pl
        if "Keywords:" in row:
            pl = search_source(pub, index, row, source_identifiers, not_found)
            # pub[index]+=pl
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
# print(bib_to_index)
# print(index)

values_sources = set()
count = 0
for i in source_identifiers:
    for j in source_identifiers[i]:
        count += 1
        values_sources.add(j)

# print(len(source_identifiers))
# print(len(values_sources), count)
