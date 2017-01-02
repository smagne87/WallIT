$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip({ 'placement': 'right' });
    $("#spinner").bind("ajaxSend", function () {
        $(this).width($(window).width() + $(window).width());
        $(this).height($(window).height());
        $(this).show();
    }).bind("ajaxStop", function () {
        $(this).hide();
    }).bind("ajaxError", function () {
        $(this).hide();
    });

    $('#myTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
});

$(document).on('keyup keypress', 'form input[type="text"]', function (e) {
    if (e.which == 13) {
        e.preventDefault();
        return false;
    }
});

function addLoading() {
    $('#spinner').width($(document).width());
    $('#spinner').height($(document).height());
    $('#spinner').show();
}
function removeLoading() {
    $('#spinner').hide();
}

function onAjaxFail(data) {
    displayAlert(data);
}

function displayAlert(message, idPlaceHolder) {
    if (!idPlaceHolder) {
        idPlaceHolder = "#errorPlaceHolder";
    }

    var errorPlaceHolder = $(idPlaceHolder);
    if (errorPlaceHolder) {
        errorPlaceHolder.html("<button type='button' class='close' onclick='hideMessage(" + '"' + idPlaceHolder + '"' + ")' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + message);
        errorPlaceHolder.show();
    }
    else {
        alert('PLEASE ADD ERROR PLACEHOLDER TO AVOID THIS JS ALERT \n error: ' + message);
    }
}

function displayMessage(message, idPlaceHolder) {
    $(idPlaceHolder).show();
}

function displaySuccess(message, idPlaceHolder) {
    if (!idPlaceHolder) {
        idPlaceHolder = "#messagePlaceHolder";
    }
    $(idPlaceHolder).show();
}

function hideError() {
    $('#errorPlaceHolder').hide();
}

function hideMessage(idMessage) {
    if (!idMessage) {
        idMessage = "#messagePlaceHolder";
    }
    $(idMessage).hide();
}

function onSubmitFailed(responseText) {
    displayAlert(responseText);
}
