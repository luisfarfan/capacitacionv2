/**
 * Created by Administrador on 16/03/2017.
 */
/**
 * Created by lfarfan on 12/03/2017.
 */
declare var BASEURL: string;
export class SinInternetService {
    private url_personalnotas_sininternet: string = `${BASEURL}/evaluacion/personalnotas_sininternet/`;
    private url_saveNotaFinalSinInternet: string = `${BASEURL}/evaluacion/saveNotaFinalSinInternet/`;
    private url_personalrankeo_sininternet: string = `${BASEURL}/evaluacion/personalrankeo_sininternet/`;


    personasSinInternet(curso: number, ubigeo: string): JQueryXHR {
        return $.ajax({
            url: `${this.url_personalnotas_sininternet}${curso}/${ubigeo}/`
        });
    }

    saveNotasFinalSinInternet(object: Array<Object>) {
        return $.ajax({
            url: this.url_saveNotaFinalSinInternet,
            type: 'POST',
            data: {data: JSON.stringify(object)}
        })
    }

    filterPersonalSinInternet(cargo: number, ccdd: string = null, ccpp: string = null, ccdi: string = null, zona: string = null): JQueryXHR {
        let url = `${this.url_personalrankeo_sininternet}${cargo}/`;
        if (ccdd != null) {
            url += `${ccdd}/`
        }
        if (ccpp != null) {
            url += `${ccpp}/`
        }
        if (ccdi != null) {
            url += `${ccdi}/`
        }
        if (zona != null) {
            url += `${zona}/`
        }
        return $.ajax({
            url: url
        });
    }


}
