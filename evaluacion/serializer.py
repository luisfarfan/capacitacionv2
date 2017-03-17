from locales_consecucion.models import *
from distribucion.serializer import PersonalSerializer
from locales_consecucion.serializer import AmbienteSerializer, LocalCursoDetalleSerializer
from rest_framework import serializers, viewsets


class CriterioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criterio
        fields = '__all__'


class CursoSerializer(serializers.ModelSerializer):
    criterios = CriterioSerializer(many=True, read_only=True)

    class Meta:
        model = Curso
        fields = '__all__'


class CriterioCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoCriterio
        fields = '__all__'
