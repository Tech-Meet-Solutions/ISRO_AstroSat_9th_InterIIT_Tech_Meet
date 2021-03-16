# Generated by Django 3.1.7 on 2021-03-16 18:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.IntegerField(default=0)),
                ('Name', models.TextField()),
                ('URL', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Name', models.TextField()),
                ('RA', models.FloatField()),
                ('Dec', models.FloatField()),
                ('isObserved', models.BooleanField()),
                ('Publications', models.ManyToManyField(to='source.Publication')),
            ],
        ),
    ]
