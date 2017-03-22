/**
 * Created by lfarfan on 19/02/2017.
 */

var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();


function csrfSafeMethod(method: string) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: (xhr, settings)=> {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            console.log(csrftoken);
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});