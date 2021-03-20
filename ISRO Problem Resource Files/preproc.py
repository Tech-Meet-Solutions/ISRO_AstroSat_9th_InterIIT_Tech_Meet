import numpy as np

from astropy.io import ascii
from astropy.table import vstack, Column
import astropy.units as u

lm_tab = ascii.read("lmxbcat.dat", readme="ReadMe")
c = Column(data=['lmxb'] * len(lm_tab), name='class', dtype='str')
lm_tab.add_column(c)

hm_tab = ascii.read("hmxbcat.dat", readme="ReadMe")
c = Column(data=['hmxb'] * len(hm_tab), name='class', dtype='str')
hm_tab.add_column(c)

tab = vstack([lm_tab, hm_tab])

ra = (tab['RAm'] + tab['RAm'] + tab['RAs']).to(u.h)
dec = tab['DEd'].to(u.deg) + tab['DEm'].to(u.deg) + tab['DEs'].filled(0).to(u.deg)

dec = np.char.add(
    tab['DE-'].filled('+'),
    np.array(dec).astype("str")).astype(dec.dtype) * dec.unit

tab.remove_columns(['RAm', 'RAs', 'DE-', 'DEm', 'DEs'])
tab.replace_column('RAh', ra)
tab.replace_column('DEd', dec)
tab['RAh'].name = 'RA'
tab['DEd'].name = 'DE'

ascii.write(tab, 'summary.csv', format='csv', overwrite=True, include_names=['RA', 'DE', 'Name', 'class'])
