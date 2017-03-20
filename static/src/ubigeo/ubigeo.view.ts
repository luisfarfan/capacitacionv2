/**
 * Created by Administrador on 3/03/2017.
 */
import UbigeoService from './ubigeo.service';
import * as utils from '../core/utils';


export interface IUbigeo {
    ccdd: string,
    ccpp: string,
    ccdi: string,
    zona: string,
}
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
    private setUbigeo: IUbigeo = null;


    constructor(departamento_id: string, provincia_element_id: string, distrito_element_id: string, zona_element_id: string = '', setUbigeo: IUbigeo = null) {
        this.departamento_element_id = departamento_id;
        this.provincia_element_id = provincia_element_id;
        this.distrito_element_id = distrito_element_id;
        this.zona_element_id = zona_element_id;
        this.setUbigeo = setUbigeo;
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
        this.setDepartamentos();
    }

    setDepartamentos() {
        this.ubigeoService.getDepartamentos().done((departamentos) => {
            this.departamentos = departamentos;
            utils.setDropdown(this.departamentos, {id: 'ccdd', text: ['departamento']}, {
                id_element: this.departamento_element_id,
                bootstrap_multiselect: false,
                select2: true
            });
            if (this.setUbigeo !== null) {
                if (this.setUbigeo.ccdd !== "") {
                    this.ccdd = this.setUbigeo.ccdd;
                    $(`#${this.departamento_element_id}`).val(this.setUbigeo.ccdd).trigger('change');
                    $(`#${this.departamento_element_id}`).prop('disabled', true)
                }
            }
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
                select2: false
            })
            if (this.setUbigeo.ccpp !== "") {
                $(`#${this.provincia_element_id}`).val(this.setUbigeo.ccpp).trigger('change');
                $(`#${this.provincia_element_id}`).prop('disabled', true)
                this.ccpp = this.setUbigeo.ccpp
            }
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
                select2: false
            });
            if (this.setUbigeo.ccdi !== "") {
                $(`#${this.distrito_element_id}`).val(this.setUbigeo.ccdi).trigger('change');
                $(`#${this.distrito_element_id}`).prop('disabled', true);
                this.ccdi = this.setUbigeo.ccdi;
            }
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
                select2: false
            });
            utils.setDropdown(this.zonas, {id: 'ZONA', text: ['ZONA']}, {
                id_element: 'zona_ubicacion_local',
                bootstrap_multiselect: false,
                select2: true
            });
            if (this.setUbigeo.zona !== "") {''
                $(`#${this.zona_element_id}`).val(this.setUbigeo.zona).trigger('change');
                $(`#${this.zona_element_id}`).prop('disabled', true)
                this.zona = this.setUbigeo.zona
            }
        }).fail((error: any) => {
            console.log(error)
        })
    }
}
