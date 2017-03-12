/**
 * Created by lfarfan on 12/03/2017.
 */
import {Curso} from '../comun.utils';

class DistribucionView {
    curso: Curso;

    constructor() {
        this.curso = new Curso();
    }

    getCurso() {
        this.curso.cursos;
    }
}
new DistribucionView();