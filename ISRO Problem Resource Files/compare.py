import csv

with open('summaryA.csv') as f1:
	dr = csv.DictReader(f1)
	with open("sumA.csv", "w") as out_csv:
		out_writer = csv.writer(out_csv, delimiter=',')
		cols = [ 'Id', 'Name','RA','DE', 'B-V','Cat','class','E(B-V)','Fx','GLAT','GLON','Opt','Porb','Porb2','Ppulse','Range','SpType','Type','U-B','Vmag','r_Fx','r_Opt','r_Ppulse','r_Vmag']
		out_writer.writerow(cols)
		count = 1
		for i in dr:
			out_writer.writerow([count, i['Name'], i['RA'], i['DE'], i['B-V'],i['Cat'],i['class'],i['E(B-V)'],i['Fx'],i['GLAT'],i['GLON'],i['Opt'],i['Porb'],i['Porb2'],i['Ppulse'],i['Range'],i['SpType'],i['Type'],i['U-B'],i['Vmag'],i['r_Fx'],i['r_Opt'],i['r_Ppulse'],i['r_Vmag']])
			count+=1

