from django.db import models


class Reportes(models.Model):
    nombre = models.CharField(max_length=255, blank=True, null=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    slug = models.CharField(max_length=255, blank=True, null=True)
    template_html = models.CharField(max_length=255, blank=True, null=True)
    url_service = models.CharField(max_length=100, blank=True, null=True)
    codigo = models.CharField(max_length=6, blank=True, null=True)
    order = models.IntegerField(default=0)
    campos = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'REPORTES'


class Inscritos(models.Model):
    id_per = models.IntegerField(primary_key=True)
    id_cargofuncional = models.IntegerField()
    ccdd_i = models.CharField(max_length=2)
    ccpp_i = models.CharField(max_length=2)
    ccdi_i = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'v_inscritos_censos'
