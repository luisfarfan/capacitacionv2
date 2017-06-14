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


class PersonalAulaNotaFinalDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalAulaNotaFinal
        fields = '__all__'


class PersonalAulaDetalleNotaFinalSerializer(serializers.ModelSerializer):
    personalaula_notafinal = PersonalAulaNotaFinalDetalleSerializer(many=True, read_only=True)
    id_pea = PersonalSerializer()

    class Meta:
        model = PersonalAula
        fields = '__all__'


class CargoFuncionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargoFuncional
        fields = '__all__'


class CargosCursoSerializer(serializers.ModelSerializer):
    id_cargofuncional = CargoFuncionalSerializer()

    class Meta:
        model = CursoCargoFuncional
        fields = '__all__'


class PersonalNotaFinalSinInternetSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeaNotaFinalSinInternet
        fields = '__all__'


class PeaNotaFinalSinInternetSerializer(serializers.ModelSerializer):
    pea = PersonalSerializer()

    class Meta:
        model = PeaNotaFinalSinInternet
        fields = '__all__'


class PersonalSinInternetSerializer(serializers.ModelSerializer):
    id_cargofuncional = CargoFuncionalSerializer()
    personal_notafinal = PeaNotaFinalSinInternetSerializer(many=True, read_only=True)

    class Meta:
        model = Personal
        fields = '__all__'


