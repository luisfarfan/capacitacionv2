# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-01 01:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('seguridad', '0004_auto_20170526_1739'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rolcurso',
            name='rol',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='rolcursomodulos',
            name='modulo',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='rolcursomodulosseguridad',
            name='modulo',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='rolcursomodulosseguridad',
            name='rol',
            field=models.CharField(max_length=100),
        ),
    ]
