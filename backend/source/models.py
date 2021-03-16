from django.db import models

# Create your models here.

class Publication(models.Model):
    identifier = models.IntegerField(default=0)
    Name = models.TextField()
    URL = models.TextField()

    def __str__(self):
        return self.Name


class Source(models.Model):
    # Cosmic Sources
    Name = models.TextField() # Do we need CharField?
    RA = models.FloatField()
    Dec = models.FloatField()
    isObserved = models.BooleanField()
    Publications = models.ManyToManyField(Publication)

    def __str__(self):
        return self.Name


