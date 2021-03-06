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


class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__'


class UbigeoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ubigeo
        fields = '__all__'


class PersonalSerializer(serializers.ModelSerializer):
    ubigeo = UbigeoSerializer()

    class Meta:
        model = Personal
        fields = '__all__'


class LocalAmbienteDetalleSerializer(serializers.ModelSerializer):
    id_ambiente = AmbienteSerializer()

    # id_pea = PersonalSerializer()

    class Meta:
        model = LocalAmbiente
        fields = '__all__'


class DirectorioLocalCursoDetalleSerializer(serializers.ModelSerializer):
    local = DirectorioLocalSerializer()
    ambientes = AmbienteSerializer(many=True, read_only=True)

    class Meta:
        model = DirectorioLocalCurso
        fields = '__all__'


class LocalCursoDetalleSerializer(serializers.ModelSerializer):
    local = LocalSerializer()
    ambientes = AmbienteSerializer(many=True, read_only=True)

    class Meta:
        model = LocalCurso
        fields = '__all__'


class DirectorioLocalAmbienteSerializer(serializers.ModelSerializer):
    id_ambiente = AmbienteSerializer()

    class Meta:
        model = DirectorioLocalAmbiente
        fields = '__all__'


class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = '__all__'


class CursoSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ('id_curso', 'cod_curso', 'nombre_curso', 'etapa', 'fecha_inicio', 'fecha_fin','nota_minima')


class LocalCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalCurso
        fields = '__all__'
