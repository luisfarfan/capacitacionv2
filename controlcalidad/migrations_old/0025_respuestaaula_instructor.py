# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-20 16:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controlcalidad', '0024_respuestalocal_instructor'),
    ]

    operations = [
        migrations.AddField(
            model_name='respuestaaula',
            name='instructor',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]