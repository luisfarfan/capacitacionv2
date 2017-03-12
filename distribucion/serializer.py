from locales_consecucion.models import *
from locales_consecucion.serializer import LocalSerializer
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



