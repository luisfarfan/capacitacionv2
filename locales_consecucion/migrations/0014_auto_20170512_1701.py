# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-12 22:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locales_consecucion', '0013_personal_correo'),
    ]

    operations = [
        migrations.AddField(
            model_name='curso',
            name='fecha_fin',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='curso',
            name='fecha_inicio',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]