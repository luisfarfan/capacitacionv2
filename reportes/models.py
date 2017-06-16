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
    ubigeo_i = models.CharField(max_length=2)

    class Meta:
        managed = False
        db_table = 'v_inscritos_censos'


class MetaSeleccion(models.Model):
    ccdd = models.CharField(max_length=2)
    ccpp = models.CharField(max_length=2)
    ccdi = models.CharField(max_length=2)
    ubigeo = models.CharField(max_length=2)
    id_convocatoriacargo = models.IntegerField()
    id_cargofuncional = models.IntegerField()
    meta_campo = models.IntegerField()
    meta_capa = models.IntegerField()
    desc_censo = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'meta_seleccion'


class MetaSeleccion_zona(models.Model):
    ccdd = models.CharField(max_length=2)
    ccpp = models.CharField(max_length=2)
    ccdi = models.CharField(max_length=2)
    ubigeo = models.CharField(max_length=2)
    id_convocatoriacargo = models.IntegerField()
    id_cargofuncional = models.IntegerField()
    zona = models.CharField(max_length=5)
    meta = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'meta_seleccion_zona'
