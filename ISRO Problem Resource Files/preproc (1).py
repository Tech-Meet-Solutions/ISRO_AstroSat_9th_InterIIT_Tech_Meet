from astropy.io import ascii
from astropy.table import vstack, Column
import astropy.units as u
import numpy as np

from astroquery.simbad import Simbad
from astroquery.ned import Ned

lm_tab = ascii.read("lmxbcat.dat", readme="ReadMe")
c = Column(data=['lmxb'] * len(lm_tab), name='class', dtype='str')
lm_tab.add_column(c)

hm_tab = ascii.read("hmxbcat.dat", readme="ReadMe")
c = Column(data=['hmxb'] * len(hm_tab), name='class', dtype='str')
hm_tab.add_column(c)

tab = vstack([lm_tab, hm_tab])


ra = (tab['RAh'].to(u.h)
      + tab['RAm'].to(u.min)
      + tab['RAs'].to(u.s)
      ) / u.hour * 15 * u.deg

dec = (tab['DEd'].to(u.deg)
       + tab['DEm'].to(u.deg)
       + tab['DEs'].filled(0).to(u.deg)
       )

dec = np.char.add(
    tab['DE-'].filled('+'),
    np.array(dec).astype("str")).astype(dec.dtype) * dec.unit

tab.add_column(ra, name='RA')
tab.add_column(dec, name='DE')




# tab.write("Combined.dat", format='ascii.csv', overwrite=True)
