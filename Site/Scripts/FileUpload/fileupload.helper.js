var _progressUrl = "";
function initFileUpload(formId, onUploadSuccess, urlHandler, fileTypesRegex, maxFileUpload, progressUrl) {
    // Initialize the jQuery File Upload widget:
    _progressUrl = (progressUrl ? progressUrl : "");
    $('#' + formId).fileupload();
    if (maxFileUpload == null)
        maxFileUpload = 1;
   
    $('#' + formId).fileupload('option', {
        url: urlHandler,
        maxFileSize: 500000000,
        resizeMaxWidth: 1920,
        resizeMaxHeight: 1200,
        limitMultiFileUploads: 1,
        maxNumberOfFiles: maxFileUpload,
        acceptFileTypes: fileTypesRegex,
        done: function (e, data) {
            onUploadSuccess($("#" + formId), data.result[0], _progressUrl);
            $(this).find("div.cancel button").click();
            $(this).find("div.files").empty();
        }        
    });
}