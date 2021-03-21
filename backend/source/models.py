from django.db import models


# Create your models here.
class Publication(models.Model):
    identifier = models.IntegerField(default=0, primary_key=True)
    Name = models.TextField()
    URL = models.TextField()

    def __str__(self):
        return self.Name

class SourceB(models.Model):
    # Cosmic Sources
    id = models.IntegerField(default=0, primary_key=True)
    Name = models.CharField(max_length=100)
    RA = models.FloatField()
    Dec = models.FloatField()
    category = models.CharField(max_length=10, default="")
    

    def __str__(self):
        return self.Name





class SourceA(models.Model):
    # Cosmic Sources
    id = models.IntegerField(default=0, primary_key=True)
    Name = models.CharField(max_length=100)
    RA = models.FloatField()
    Dec = models.FloatField()
    isObserved_uvit = models.BooleanField(default=False)
    isObserved_sxt = models.BooleanField(default=False)
    isObserved_laxpc = models.BooleanField(default=False)
    isObserved_czti = models.BooleanField(default=False)
    Publications = models.ManyToManyField(Publication)
    category = models.CharField(max_length=10, default="")
    uvit = models.ManyToManyField(SourceB,related_name = 'UV')
    sxt = models.ManyToManyField(SourceB,'XT')
    laxpc = models.ManyToManyField(SourceB,'PC')
    czti = models.ManyToManyField(SourceB,'CZ')

    def __str__(self):
        return self.Name
