# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-10 23:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locales_consecucion', '0012_auto_20170509_1520'),
    ]

    operations = [
        migrations.AddField(
            model_name='personal',
            name='correo',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
