# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-05-24 16:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controlcalidad', '0003_auto_20170524_1021'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuariolocales',
            name='usuario',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
