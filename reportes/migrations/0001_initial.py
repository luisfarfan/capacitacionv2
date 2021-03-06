# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-22 18:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Inscritos',
            fields=[
                ('id_per', models.IntegerField(primary_key=True, serialize=False)),
                ('id_cargofuncional', models.IntegerField()),
                ('ccdd_i', models.CharField(max_length=2)),
                ('ccpp_i', models.CharField(max_length=2)),
                ('ccdi_i', models.CharField(max_length=2)),
                ('ubigeo_i', models.CharField(max_length=2)),
            ],
            options={
                'db_table': 'v_inscritos_censos',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Reportes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(blank=True, max_length=255, null=True)),
                ('descripcion', models.CharField(blank=True, max_length=255, null=True)),
                ('slug', models.CharField(blank=True, max_length=255, null=True)),
                ('template_html', models.CharField(blank=True, max_length=255, null=True)),
                ('url_service', models.CharField(blank=True, max_length=100, null=True)),
                ('codigo', models.CharField(blank=True, max_length=6, null=True)),
                ('order', models.IntegerField(default=0)),
                ('campos', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'db_table': 'REPORTES',
                'managed': True,
            },
        ),
    ]
