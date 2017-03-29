from locales_consecucion.models import LocalAmbiente, PersonalAula


def localAmbienteValid(id_localambiente):
    localambiente = LocalAmbiente.objects.get(pk=id_localambiente)
    cantidad_personal_localambiente = PersonalAula.objects.filter(id_localambiente_id=id_localambiente).count()
    print(id_localambiente)
    print(localambiente.capacidad, cantidad_personal_localambiente)
    if localambiente.capacidad is None:
        capacidad_ambiente = 0
    else:
        capacidad_ambiente = localambiente.capacidad
    if cantidad_personal_localambiente >= capacidad_ambiente:
        return 0
    return capacidad_ambiente - cantidad_personal_localambiente
