from .models import *
from rest_framework import routers, serializers, viewsets


class EtapasControlCalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapasControlCalidad
        fields = '__all__'


class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        fields = '__all__'


class DocumentosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documentos
        fields = '__all__'


class FormatosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formatos
        fields = '__all__'


class GrupoPreguntasSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoPreguntas
        fields = '__all__'


class PreguntasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preguntas
        fields = '__all__'


class TipoPreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPregunta
        fields = '__all__'


class OpcionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opciones
        fields = '__all__'


class LocalAmbienteRespuestasSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalAmbienteRespuestas
        fields = '__all__'
