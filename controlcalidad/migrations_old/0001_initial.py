# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-05-22 19:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('locales_consecucion', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Documentos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Curso')),
            ],
            options={
                'managed': True,
                'db_table': 'DOCUMENTOS',
            },
        ),
        migrations.CreateModel(
            name='EtapasControlCalidad',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
            ],
            options={
                'managed': True,
                'db_table': 'ETAPAS_CONTROLCALIDAD',
            },
        ),
        migrations.CreateModel(
            name='Formatos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.CharField(blank=True, max_length=255, null=True)),
                ('curso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.Curso')),
            ],
            options={
                'managed': True,
                'db_table': 'FORMATOS',
            },
        ),
        migrations.CreateModel(
            name='GrupoPreguntas',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo1', models.CharField(blank=True, max_length=100, null=True)),
                ('titulo2', models.CharField(blank=True, max_length=100, null=True)),
                ('formato', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='controlcalidad.Formatos')),
            ],
            options={
                'managed': True,
                'db_table': 'GRUPO_PREGUNTAS',
            },
        ),
        migrations.CreateModel(
            name='LocalAmbienteRespuestas',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('respuesta', models.IntegerField()),
                ('otros', models.CharField(max_length=255)),
                ('localambiente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='locales_consecucion.LocalAmbiente')),
            ],
            options={
                'managed': True,
                'db_table': 'LOCALAMBIENTE_RESPUESTAS',
            },
        ),
        migrations.CreateModel(
            name='Opciones',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'managed': True,
                'db_table': 'OPCIONES',
            },
        ),
        migrations.CreateModel(
            name='Preguntas',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('order', models.IntegerField()),
                ('grupo', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='controlcalidad.GrupoPreguntas')),
            ],
            options={
                'managed': True,
                'db_table': 'PREGUNTAS',
            },
        ),
        migrations.CreateModel(
            name='TipoDocumento',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'managed': True,
                'db_table': 'TIPO_DOCUMENTO',
            },
        ),
        migrations.CreateModel(
            name='TipoPregunta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'managed': True,
                'db_table': 'TIPO_PREGUNTA',
            },
        ),
        migrations.AddField(
            model_name='preguntas',
            name='tipo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='controlcalidad.TipoPregunta'),
        ),
        migrations.AddField(
            model_name='localambienterespuestas',
            name='opcion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='controlcalidad.Opciones'),
        ),
        migrations.AddField(
            model_name='documentos',
            name='formato',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='controlcalidad.Formatos'),
        ),
        migrations.AddField(
            model_name='documentos',
            name='tipodocumento',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='controlcalidad.TipoDocumento'),
        ),
    ]