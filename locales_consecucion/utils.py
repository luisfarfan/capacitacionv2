from locales_consecucion.models import Local, DirectorioLocal


def restar(num, num2):
    return int(num2) - int(num)


def sumarDisponiblesUsar(id_local, isdirectorio=False):
    if isdirectorio:
        local = DirectorioLocal.objects.get(pk=id_local)
    else:
        local = Local.objects.get(pk=id_local)

    disponible_total = int(
        local.cantidad_disponible_auditorios or 0) + int(
        local.cantidad_disponible_sala or 0) + int(
        local.cantidad_disponible_aulas or 0) + int(
        local.cantidad_disponible_computo or 0) + int(
        local.cantidad_disponible_oficina or 0) + int(
        local.cantidad_disponible_otros or 0)

    disponible_usar = int(
        local.cantidad_usar_auditorios or 0) + int(
        local.cantidad_usar_sala or 0) + int(
        local.cantidad_usar_aulas or 0) + int(
        local.cantidad_usar_computo or 0) + int(
        local.cantidad_usar_oficina or 0) + int(
        local.cantidad_usar_otros or 0)
    # print(disponible_total, disponible_usar)
    local.total_aulas = disponible_usar
    local.total_disponibles = disponible_total
    local.save()
    print(local.total_aulas, local.total_disponibles)

    return True
