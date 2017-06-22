from rest_framework.views import APIView
from rest_framework import generics, viewsets
from .serializer import *
from locales_consecucion.serializer import LocalSerializer, LocalAmbienteSerializer
from locales_consecucion.models import Local, LocalAmbiente
from django.http import JsonResponse
import json
from .models import RespuestaLocal, RespuestaManuales
from .mixins import CustomQueryMixin

"""
Servicio: Locales según Curso de Capacitación
"""


class LocalesCurso(APIView):
    def get(self, request, curso):
        locales = list(Local.objects.filter(localcurso__curso_id=curso, usar=1).values())
        response = []
        for local in locales:
            try:
                usuariolocales = UsuarioLocales.objects.get(local_id=local['id_local'])
            except UsuarioLocales.DoesNotExist:
                usuariolocales = None
            if usuariolocales:
                local['seleccionar'] = 1
                local['instructor'] = usuariolocales.usuario
                local['localusuario'] = usuariolocales.id
                response.append(local)
            else:
                local['seleccionar'] = 0
                local['instructor'] = None
                local['localusuario'] = None
                response.append(local)

        return JsonResponse(response, safe=False)


class LocalesCursoViewSet(generics.ListAPIView):
    serializer_class = LocalSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return Local.objects.filter(localcurso__curso_id=curso, usar=1)


class AulasLocalViewSet(generics.ListAPIView):
    serializer_class = LocalAmbienteSerializer

    def get_queryset(self):
        local = self.kwargs['local']
        return LocalAmbiente.objects.filter(localcurso_id=local)


class UsuarioLocalesViewSet(viewsets.ModelViewSet):
    queryset = UsuarioLocales.objects.all()
    serializer_class = UsuarioLocalesSerializer


class EtapasControlCalidadViewSet(viewsets.ModelViewSet):
    queryset = EtapasControlCalidad.objects.all()
    serializer_class = EtapasControlCalidadSerializer


class TipoDocumentoViewSet(viewsets.ModelViewSet):
    queryset = TipoDocumento.objects.all()
    serializer_class = TipoDocumentoSerializer


class DocumentosViewSet(viewsets.ModelViewSet):
    queryset = Documentos.objects.all()
    serializer_class = DocumentosSerializer


class FormatosViewSet(viewsets.ModelViewSet):
    queryset = Formatos.objects.all()
    serializer_class = FormatosSerializer


class GrupoPreguntasViewSet(viewsets.ModelViewSet):
    queryset = GrupoPreguntas.objects.all()
    serializer_class = GrupoPreguntasSerializer


class PreguntasViewSet(viewsets.ModelViewSet):
    queryset = Preguntas.objects.all()
    serializer_class = PreguntasSerializer


class TipoPreguntaViewSet(viewsets.ModelViewSet):
    queryset = TipoPregunta.objects.all()
    serializer_class = TipoPreguntaSerializer


class OpcionesViewSet(viewsets.ModelViewSet):
    queryset = Opciones.objects.all()
    serializer_class = OpcionesSerializer


class LocalAmbienteRespuestasViewSet(viewsets.ModelViewSet):
    queryset = LocalAmbienteRespuestas.objects.all()
    serializer_class = LocalAmbienteRespuestasSerializer


class ManualViewSet(viewsets.ModelViewSet):
    queryset = Manual.objects.all()
    serializer_class = ManualSerializer


class GrupoPreguntasFilterViewSet(generics.ListAPIView):
    serializer_class = GrupoPreguntasSerializer

    def get_queryset(self):
        formato = self.kwargs['formato']
        return GrupoPreguntas.objects.filter(formato=formato)


class ManualCursoFilterViewSet(generics.ListAPIView):
    serializer_class = ManualSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return Manual.objects.filter(curso=curso)


class PreguntasFilterViewSet(generics.ListAPIView):
    serializer_class = PreguntasSerializer

    def get_queryset(self):
        grupo_id = self.kwargs['conjunto']
        return Preguntas.objects.filter(grupo_id=grupo_id)


# class RespuestaLocalViewSet(viewsets.ModelViewSet):
#     queryset = Manual.objects.all()
#     serializer_class = RespuestaLocalSerializer

class addEditRespuestasLocales(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:
                if RespuestaLocal.objects.filter(local_id=preguntas['id'],
                                                 llave=c, curso=preguntas['curso']).count() == 0:
                    RespuestaLocal(llave=c, pregunta=preguntas['pregunta'], curso=preguntas['curso'],
                                   local_id=preguntas['id'], instructor=preguntas['instructor'],
                                   opcionselected_id=opciones['opcion'],
                                   respuesta_texto=opciones['respuesta'], opcional=opciones['opcional']).save()
                    c = c + 1

        return JsonResponse({'msg': 'Hecho'})


class addEditRespuestasAulas(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:
                if RespuestaAula.objects.filter(aula_id=preguntas['id'],
                                                llave=c, curso=preguntas['curso']).count() == 0:
                    RespuestaAula(llave=c, pregunta=preguntas['pregunta'], local=preguntas['local'],
                                  instructor=preguntas['instructor'],
                                  respuesta_texto=opciones['respuesta'], curso=preguntas['curso'],
                                  aula_id=preguntas['id'], opcionselected_id=opciones['opcion'],
                                  opcional=opciones['opcional']).save()
                    c = c + 1

        return JsonResponse({'msg': 'Hecho'})


class addEditRespuestasManuales(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:

                if RespuestaManuales.objects.filter(aula_id=preguntas['id'],
                                                    llave=c, manual_id=preguntas['id_manual'],
                                                    curso=preguntas['curso']).count() == 0:
                    RespuestaManuales(llave=c, pregunta=preguntas['pregunta'], respuesta_texto=opciones['respuesta'],
                                      aula_id=preguntas['id'], manual_id=preguntas['id_manual'],
                                      cantidaddocumentos=preguntas['cantidadDocumento'],
                                      cantidaddodefectuosos=preguntas['cantidadDefectuosos'],
                                      opcionselected_id=opciones['opcion'], curso=preguntas['curso'],
                                      opcional=opciones['opcional'], cantidad=opciones['cantidad']).save()
                    c = c + 1

        return JsonResponse({'msg': 'Hecho'})


class EstadoManualsFilterViewSet(CustomQueryMixin, generics.GenericAPIView):
    serializer_class = SuccessSerializer

    def get_queryset(self):
        idaula = self.kwargs.get('idaula')
        idmanual = self.kwargs.get('idmanual')
        datos = RespuestaManuales.objects.filter(aula_id=idaula, manual_id=idmanual)
        if datos.exists():
            return {"success": True}
        else:
            return {"success": False}


class EstadoDuranteManualsFilterViewSet(CustomQueryMixin, generics.GenericAPIView):
    serializer_class = SuccessSerializer

    def get_queryset(self):
        user = self.kwargs.get('user')
        aula = self.kwargs.get('aula')
        manual = self.kwargs.get('manual')
        curso = self.kwargs.get('curso')
        datos = RespuestaDuranteManual.objects.filter(instructor=user, aula=aula, manual=manual, curso=curso)
        if datos.exists():
            return {"success": True}
        else:
            return {"success": False}


class EstadoDuranteCapituloFilterViewSet(CustomQueryMixin, generics.GenericAPIView):
    serializer_class = SuccessSerializer

    def get_queryset(self):
        user = self.kwargs.get('user')
        aula = self.kwargs.get('aula')
        capitulo = self.kwargs.get('capitulo')
        manual = self.kwargs.get('manual')
        curso = self.kwargs.get('curso')
        datos = RespuestaDuranteCapitulo.objects.filter(instructor=user, aula=aula, capitulo=capitulo, manual=manual,
                                                        curso=curso)
        if datos.exists():
            return {"success": True}
        else:
            return {"success": False}


class EstadoLocalFilterViewSet(CustomQueryMixin, generics.GenericAPIView):
    serializer_class = SuccessSerializer

    def get_queryset(self):
        local = self.kwargs.get('local')
        curso = self.kwargs.get('curso')
        usuario = self.kwargs.get('usuario')
        datos = RespuestaLocal.objects.filter(local=local, curso=curso, instructor=usuario)
        if datos.exists():
            return {"success": True}
        else:
            return {"success": False}


class EstadoAulaFilterViewSet(CustomQueryMixin, generics.GenericAPIView):
    serializer_class = SuccessSerializer

    def get_queryset(self):
        local = self.kwargs.get('local')
        aula = self.kwargs.get('aula')
        curso = self.kwargs.get('curso')
        usuario = self.kwargs.get('usuario')
        datos = RespuestaAula.objects.filter(local=local, aula=aula, curso=curso, instructor=usuario)
        if datos.exists():
            return {"success": True}
        else:
            return {"success": False}


class AulaInstructorViewSet(viewsets.ModelViewSet):
    queryset = AulaInstructor.objects.all()
    serializer_class = AulaInstructorSerializer


class RespuestaLocalViewSet(generics.ListAPIView):
    serializer_class = RespuestaLocalSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return RespuestaLocal.objects.filter(curso=curso)


class RespuestaAulaViewSet(viewsets.ModelViewSet):
    queryset = RespuestaAula.objects.all()
    serializer_class = RespuestaAulaSerializer


class RespuestaManualViewSet(generics.ListAPIView):
    serializer_class = RespuestaManualSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return RespuestaManuales.objects.filter(curso=curso)


class RespuestaAulaLocalViewSet(generics.ListAPIView):
    serializer_class = RespuestaAulaSerializer

    def get_queryset(self):
        curso = self.kwargs['curso']
        return RespuestaAula.objects.filter(curso=curso)


class CapitulosManualViewSet(generics.ListAPIView):
    serializer_class = CapitulosManualSerializer

    def get_queryset(self):
        id = self.kwargs['id']
        return CapitulosManual.objects.filter(manual_id=id)


class CapitulosViewSet(generics.ListAPIView):
    serializer_class = CapitulosSerializer

    def get_queryset(self):
        id = self.kwargs['id']
        return Capitulos.objects.filter(id=id)


class addEditRespuestaDurante(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:
                if RespuestaDuranteManual.objects.filter(aula=preguntas['aula'],
                                                         llave=c, manual=preguntas['manual'],
                                                         curso=preguntas['curso']).count() == 0:
                    RespuestaDuranteManual(llave=c, instructor=preguntas['instructor'], aula=preguntas['aula'],
                                           fecha=preguntas['fecha'], pregunta=preguntas['pregunta'],
                                           curso=preguntas['curso'], manual=preguntas['manual'],
                                           respuesta1=opciones['respuesta1'], respuesta2=opciones['respuesta2'],
                                           respuesta3=opciones['respuesta3'], respuesta4=opciones['respuesta4']).save()
                    c = c + 1

        return JsonResponse({'msg': 'Hecho'})


class addEditRespuestaDuranteCapitulo(generics.ListAPIView):
    def post(self, request):
        postdata = request.POST['data']
        data = json.loads(postdata)
        c = 1
        for preguntas in data:
            for opciones in preguntas['opciones']:
                if RespuestaDuranteCapitulo.objects.filter(aula=preguntas['aula'],
                                                           llave=c, manual=preguntas['manual'],
                                                           curso=preguntas['curso'],
                                                           capitulo=preguntas['capitulo']).count() == 0:
                    RespuestaDuranteCapitulo(llave=c, instructor=preguntas['instructor'], aula=preguntas['aula'],
                                             fecha=preguntas['fecha'], pregunta=preguntas['pregunta'],
                                             capitulo=preguntas['capitulo'],
                                             curso=preguntas['curso'], manual=preguntas['manual'],
                                             respuesta1=opciones['respuesta1'],
                                             respuesta2=opciones['respuesta2']).save()
                c = c + 1

        return JsonResponse({'msg': 'Hecho'})
