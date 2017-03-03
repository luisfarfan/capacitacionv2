/**
 * Created by Administrador on 3/03/2017.
 */
import UbigeoService from './ubigeo.service';
import * as utils from '../core/utils';

export default class UbigeoView {
    private ubigeoService = new UbigeoService();
    private ccdd: string;
    private ccpp: string;
    private ccdi: string;
    private ubigeo: string;
    private zona: string;

    private departamentos: Array<Object>;
    private provincias: Array<Object>;
    private distritos: Array<Object>;
    private zonas: Array<Object>;
    private departamento_element_id: string;
    private provincia_element_id: string;
    private distrito_element_id: string;
    private zona_element_id: string;


    constructor(departamento_id: string, provincia_element_id: string, distrito_element_id: string, zona_element_id: string = '') {
        this.setDepartamentos();
        this.departamento_element_id = departamento_id;
        this.provincia_element_id = provincia_element_id;
        this.distrito_element_id = distrito_element_id;
        this.zona_element_id = zona_element_id;

        $(`#${this.departamento_element_id}`).on('change', (event: any) => {
            this.ccdd = event.target.value;
            this.setProvincias(this.ccdd)
        });

        $(`#${this.provincia_element_id}`).on('change', (event: any) => {
            this.ccpp = event.target.value;
            this.setDistritos(this.ccdd, this.ccpp);
        });

        $(`#${this.distrito_element_id}`).on('change', (event: any) => {
            this.ccdi = event.target.value;
            this.ubigeo = `${this.ccdd}${this.ccpp}${this.ccdi}`;
            this.setZonas(this.ubigeo);
        });
    }

    setDepartamentos() {
        this.ubigeoService.getDepartamentos().done((departamentos) => {
            this.departamentos = departamentos;
            utils.setDropdown(this.departamentos, {id: 'ccdd', text: ['departamento']}, {
                id_element: this.departamento_element_id,
                bootstrap_multiselect: false,
                select2: true
            })
        }).fail((error: any) => {
            console.log(error)
        })
    }

    setProvincias(ccdd: string) {
        this.ccdd = ccdd;
        this.ubigeoService.getProvincias(this.ccdd).done((provincias) => {
            this.provincias = provincias;
            utils.setDropdown(this.provincias, {id: 'ccpp', text: ['provincia']}, {
                id_element: this.provincia_element_id,
                bootstrap_multiselect: false,
                select2: true
            })
        }).fail((error: any) => {
            console.log(error)
        })
    }

    setDistritos(ccdd: string, ccpp: string) {
        this.ccdd = ccdd;
        this.ccpp = ccpp;
        this.ubigeoService.getDistritos(this.ccdd, this.ccpp).done((distritos) => {
            this.distritos = distritos;
            utils.setDropdown(this.distritos, {id: 'ccdi', text: ['distrito']}, {
                id_element: this.distrito_element_id,
                bootstrap_multiselect: false,
                select2: true
            })
        }).fail((error: any) => {
            console.log(error)
        })
    }

    setZonas(ubigeo: string) {
        this.ubigeo = ubigeo;
        this.ubigeoService.getZonas(this.ubigeo).done((zonas) => {
            this.zonas = zonas;
            utils.setDropdown(this.zonas, {id: 'ZONA', text: ['ZONA']}, {
                id_element: this.zona_element_id,
                bootstrap_multiselect: false,
                select2: true
            })
        }).fail((error: any) => {
            console.log(error)
        })
    }
}
