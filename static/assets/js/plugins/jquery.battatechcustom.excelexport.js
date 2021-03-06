/**
 * Created by Administrador on 12/05/2017.
 */
var defaults = {tableSelector: null, fileName: "download.xls", worksheetName: "My Worksheet", encoding: "utf-8"};
$.fn.bootstrapExcelExport = function (e) {
    var t = $.extend({}, defaults, e);
    $(this).on("click", function () {
        var e = $("<div>").append($(t.tableSelector).clone()).html(), o = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
        o += "<head>", o += '<meta http-equiv="Content-type" content="text/html;charset="' + t.encoding + '" />', o += "<!--[if gte mso 9]>", o += "<xml>", o += "<x:ExcelWorkbook>", o += "<x:ExcelWorksheets>", o += "<x:ExcelWorksheet>", o += "<x:Name>", o += t.worksheetName, o += "</x:Name>", o += "<x:WorksheetOptions>", o += "<x:DisplayGridlines/>", o += "</x:WorksheetOptions>", o += "</x:ExcelWorksheet>", o += "</x:ExcelWorksheets>", o += "</x:ExcelWorkbook>", o += "</xml>", o += "<![endif]-->", o += "</head>", o += "<body>", o += e.replace(/"/g, "'"), o += "</body>", o += "</html>";
        var l = "data:application/vnd.ms-excel;base64,", a = l + window.btoa(unescape(o));
        $(this).attr("href", a).attr("download", t.fileName)
    })
};
