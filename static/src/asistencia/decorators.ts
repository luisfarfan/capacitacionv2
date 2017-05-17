/**
 * Created by Administrador on 16/05/2017.
 */
import * as utils from '../core/utils';


export function disableAltasBajas(target: Object, // The prototype of the class
                                  propertyKey: string, // The name of the method
                                  descriptor: TypedPropertyDescriptor<any>) {
    console.log("MethodDecorator called on: ", target, propertyKey, descriptor);
    console.log(target)
    utils.showInfo('Ya no tiene acceso a bajas y altas!');
    return false;
}