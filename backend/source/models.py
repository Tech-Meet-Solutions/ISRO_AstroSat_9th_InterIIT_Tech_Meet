from django.db import models


# Create your models here.
class Publication(models.Model):
    identifier = models.IntegerField(default=0, primary_key=True)
    Name = models.TextField()
    URL = models.TextField()

    def __str__(self):
        return self.Name


# reference class for the hmxb, lmxb references
class Refs(models.Model):
    id = models.CharField(default="", primary_key=True) # actual_id in [hl]mxb + [hl]mxb
    bib = models.CharField(max_length=50,default="")
    Name = models.CharField(max_length=100)
    desc = models.CharField(max_length=500)



class SourceB(models.Model):
    # Cosmic Sources
    id = models.IntegerField(default=0, primary_key=True)
    Object = models.CharField(max_length=100)
    obsid = models.CharField(max_length=100)
    RA = models.FloatField()
    Dec = models.FloatField()
    instrument = models.CharField(max_length=50, default="")
    date_time = models.CharField(max_length=30, default="")
    proposal_id = models.CharField(max_length=50, default="")
    target_id = models.CharField(max_length=200, default="")
    observer = models.CharField(max_length=100, default="")
    abstract = models.TextField()

    def __str__(self):
        return self.Object





class SourceA(models.Model):
    # Cosmic Sources
    id = models.IntegerField(default=0, primary_key=True)
    Name = models.CharField(max_length=100)
    Type = models.CharField(max_length=100)
    RA = models.FloatField()
    Dec = models.FloatField()
    GLON = models.FloatField()
    GLAT = models.FloatField()
    Opt = models.CharField(max_length=100)
    r_Opt = models.()
    Vmag = models.FloatField()
    B_V = models.FloatField()
    U_B = models.FloatField()
    E_BV = models.FloatField()
    r_Vmag = 
    Fx = models.FloatField()
    Range = models.CharField(max_length=100)
    r_Fx = 
    Porb = models.FloatField()
    Ppulse = models.FloatField()
    r_Ppulse = 
    Cat = models.CharField(max_length=100)
    SpType = models.CharField(max_length=100)
    Class = models.CharField(max_length=100)  # lmxb or hmxb




    isObserved_uvit = models.BooleanField(default=False)
    isObserved_sxt = models.BooleanField(default=False)
    isObserved_laxpc = models.BooleanField(default=False)
    isObserved_czti = models.BooleanField(default=False)  
    uvit = models.ManyToManyField(SourceB,related_name = 'UV')
    sxt = models.ManyToManyField(SourceB,related_name='XT')
    laxpc = models.ManyToManyField(SourceB,related_name='PC')
    czti = models.ManyToManyField(SourceB,related_name='CZ')

    Publications = models.ManyToManyField(Publication)
    
    def __str__(self):
        return self.Name


