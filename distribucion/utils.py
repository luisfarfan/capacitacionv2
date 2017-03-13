from locales_consecucion.models import LocalAmbiente, PersonalAula


def localAmbienteValid(id_localambiente):
    localambiente = LocalAmbiente.objects.get(pk=id_localambiente)
    cantidad_personal_localambiente = PersonalAula.objects.filter(id_localambiente_id=id_localambiente).count()
    if cantidad_personal_localambiente >= localambiente.capacidad:
        return 0
    return localambiente.capacidad - cantidad_personal_localambiente
