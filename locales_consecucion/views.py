# from rest_framework import generics
from .serializer import *
from rest_framework import generics, viewsets


class LocalViewSet(viewsets.ModelViewSet):
    queryset = Local.objects.all()
    serializer_class = LocalSerializer


class LocalCursoViewSet(viewsets.ModelViewSet):
    queryset = LocalCurso.objects.all()
    serializer_class = LocalCursoSerializer


class LocalAmbienteViewSet(viewsets.ModelViewSet):
    queryset = LocalAmbiente.objects.all()
    serializer_class = LocalAmbienteSerializer


class DirectorioLocalViewSet(viewsets.ModelViewSet):
    queryset = DirectorioLocal.objects.all()
    serializer_class = DirectorioLocalSerializer


class DirectorioLocalCursoViewSet(viewsets.ModelViewSet):
    queryset = DirectorioLocalCurso.objects.all()
    serializer_class = DirectorioLocalCursoSerializer


class DirectorioLocalAmbienteViewSet(viewsets.ModelViewSet):
    queryset = DirectorioLocalAmbiente.objects.all()
    serializer_class = DirectorioLocalAmbienteSerializer


class CursoEtapaViewSet(generics.ListAPIView):
    serializer_class = CursoSerializer

    def get_queryset(self):
        etapa_id = self.kwargs['etapa_id']
        return Curso.objects.filter(etapa_id=etapa_id)


class DirectorioLocalbyUbigeo(viewsets.ModelViewSet):
    queryset = DirectorioLocalSerializer

    # def get_queryset(self):
