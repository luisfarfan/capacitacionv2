# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-29 18:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('distribucion', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='enviosms',
            table='datos_prueba_sms',
        ),
    ]
