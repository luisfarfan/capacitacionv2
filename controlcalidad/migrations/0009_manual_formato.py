# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-13 16:30
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controlcalidad', '0008_auto_20170613_1415'),
    ]

    operations = [
        migrations.AddField(
            model_name='manual',
            name='formato',
            field=models.IntegerField(null=True),
        ),
    ]
