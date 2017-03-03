# from rest_framework import generics
from .models import *
from .serializer import *


class LocalViewSet(viewsets.ModelViewSet):
    queryset = Local.objects.all()
    serializer_class = LocalSerializer
