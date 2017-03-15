/**
 * Created by Administrador on 13/03/2017.
 */
export abstract class ModelService {
    get(pk: number = null): JQueryXHR {
        return $.ajax({
            type: 'PUT'
        })
    }

    post(object: Object): JQueryXHR {
        return $.ajax({
            type: 'POST',
            data: object
        })
    }

    put(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            type: 'PUT',
            data: object
        })
    }

    patch(pk: number, object: Object): JQueryXHR {
        return $.ajax({
            type: 'PATCH',
            data: object
        })
    }
}