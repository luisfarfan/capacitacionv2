from locales_consecucion.models import *
from distribucion.serializer import PersonalSerializer
from locales_consecucion.serializer import AmbienteSerializer, LocalCursoDetalleSerializer
from rest_framework import serializers, viewsets


class PersonalAulaAsistenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalAulaAsistencia
        fields = '__all__'


class PersonalAulaDetalleSerializer(serializers.ModelSerializer):
    personalaula = PersonalAulaAsistenciaSerializer(many=True, read_only=True)
    id_pea = PersonalSerializer()

    class Meta:
        model = PersonalAula
        fields = '__all__'


class LocalAmbienteInstructorSerializer(serializers.ModelSerializer):
    id_ambiente = AmbienteSerializer()
    localcurso = LocalCursoDetalleSerializer()

    class Meta:
        model = LocalAmbiente
        fields = '__all__'
