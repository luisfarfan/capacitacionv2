# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-06-20 11:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('controlcalidad', '0018_respuetadurantemanual_manual'),
    ]

    operations = [
        migrations.CreateModel(
            name='RespuestaDuranteCapitulo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('llave', models.IntegerField(blank=True, null=True)),
                ('manual', models.IntegerField(blank=True, null=True)),
                ('capitulo', models.IntegerField(blank=True, null=True)),
                ('curso', models.IntegerField(blank=True, null=True)),
                ('instructor', models.IntegerField(blank=True, null=True)),
                ('aula', models.IntegerField(blank=True, null=True)),
                ('fecha', models.CharField(blank=True, max_length=255, null=True)),
                ('pregunta', models.IntegerField(blank=True, null=True)),
                ('respuesta1', models.IntegerField(blank=True, null=True)),
                ('respuesta2', models.IntegerField(blank=True, null=True)),
                ('respuesta3', models.IntegerField(blank=True, null=True)),
                ('respuesta4', models.IntegerField(blank=True, null=True)),
                ('respuesta5', models.IntegerField(blank=True, null=True)),
                ('respuesta6', models.IntegerField(blank=True, null=True)),
                ('respuesta7', models.IntegerField(blank=True, null=True)),
                ('respuesta8', models.IntegerField(blank=True, null=True)),
                ('respuesta9', models.IntegerField(blank=True, null=True)),
                ('respuesta10', models.IntegerField(blank=True, null=True)),
                ('respuesta11', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'RESPUESTADURANTECAPITULO',
                'managed': True,
            },
        ),
    ]
