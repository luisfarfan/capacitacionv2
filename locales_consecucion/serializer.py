from .models import *
from rest_framework import routers, serializers, viewsets


class LocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Local
        fields = '__all__'


class LocalAmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalAmbiente
        fields = '__all__'


class DirectorioLocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorioLocal
        fields = '__all__'


class DirectorioLocalCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorioLocalCurso
        fields = '__all__'


class DirectorioLocalAmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectorioLocalAmbiente
        fields = '__all__'


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'


class LocalCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalCurso
        fields = '__all__'
