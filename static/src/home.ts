/**
 * Created by Administrador on 22/05/2017.
 */
import {CursoInyection} from './comun.utils';

class HomeController {
    constructor() {
        new CursoInyection();
    }
}

new HomeController()