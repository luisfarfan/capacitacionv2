# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-16 19:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locales_consecucion', '0014_personalcursocriterio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personalcursocriterio',
            name='nota',
            field=models.FloatField(blank=True, null=True),
        ),
    ]