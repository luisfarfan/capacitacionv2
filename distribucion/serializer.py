from locales_consecucion.models import *
from locales_consecucion.serializer import LocalSerializer, LocalAmbienteDetalleSerializer
from rest_framework import routers, serializers, viewsets


class ZonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zona
        fields = '__all__'


class LocalZonasSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocalZonas
        fields = '__all__'


class LocalZonasDetalleSerializer(serializers.ModelSerializer):
    zona = ZonaSerializer()

    class Meta:
        model = LocalZonas
        fields = '__all__'


class CargoFuncionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargoFuncional
        fields = '__all__'


class _PersonalSerializer(serializers.ModelSerializer):
    id_cargofuncional = CargoFuncionalSerializer()

    class Meta:
        model = Personal
        fields = '__all__'


class PersonalSerializer(serializers.ModelSerializer):
    id_cargofuncional = CargoFuncionalSerializer()
    id_pea_reemplazo = _PersonalSerializer()

    class Meta:
        model = Personal
        fields = '__all__'


class DetallePersonalSerializer(serializers.ModelSerializer):
    id_pea_reemplazo = PersonalSerializer()

    class Meta:
        model = Personal
        fields = '__all__'


class CrudPersonalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personal
        fields = '__all__'


class PersonalAulaCrudSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalAula
        fields = '__all__'


class PersonalAulaSerializer(serializers.ModelSerializer):
    id_pea = PersonalSerializer()

    class Meta:
        model = PersonalAula
        fields = '__all__'
