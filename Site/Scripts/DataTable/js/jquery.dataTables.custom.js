var oTable;
var currentUrl;
var selected = new Array();
function loadTableContentAjax(idTable, action, columns) {
    currentUrl = action;
    if (!oTable) {
        oTable = $('#' + idTable).dataTable({
            'bProcessing': true,
            'bServerSide': true,
            'bJQueryUI': true,
            "bAutoWidth": false,
            'iDisplayLength': 20,
            'iDisplayStart': 0,
            'sAjaxSource': currentUrl,
            "aLengthMenu": [[20, 50, 100], [20, 50, 100]],
            'sPaginationType': 'full_numbers',
            'aoColumns': columns,
            'oLanguage': {
                'sUrl': '//cdn.datatables.net/plug-ins/1.10.10/i18n/Spanish.json'
            },
            'fnServerData': function (sSource, aoData, fnCallback) {
                $.ajax({
                    "dataType": 'json',
                    "type": "POST",
                    "url": currentUrl,
                    "data": aoData,
                    "success": function (json) {
                        fnCallback(json);
                        toogleMenuButtons(idTable);
                    },
                    "fail": function (a, b, c) {
                    }
                })
            },
            'fnInitComplete': function (oSettings, json) {
                //$("select.custom-filter").each(function (i) {
                //    var column = $($("#" + idTable + " thead th")[$(this).data("index")]);
                //    column.html($(this));
                //});
                //$('.dataTables_filter label:first').addClass('search');

                $('a.fg-button').click(function () {
                    $('#selectAll').removeAttr('checked');
                });

                $('.dataTables_filter input').unbind('keypress keyup').bind('keypress keyup', function (e) {
                    if ($(this).val().length < 3 && e.keyCode != 13) {
                        if (e.keyCode === 8 && $(this).val().length === 0)
                            oTable.fnFilter($(this).val());
                        return;
                    }
                    oTable.fnFilter($(this).val());
                });

            },
            "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                $('#' + idTable + ' tbody tr').each(function () {
                    if ($.inArray($(aData[0]).val(), selected) != -1) {
                        //SM: the string replace is because the aData[0] can not be converted to jquery DOM and can not assign the property 'checked'.
                        $('td:eq(0)', nRow).html(aData[0].replace("data-replace='replace'", "checked='checked'"));
                    }
                });
                return nRow;
            },
            "fnDrawCallback": function (oSettings) {
                var id = '#' + idTable + ' tbody tr';
                $(id).each(function () {
                    var iPos = oTable.fnGetPosition(this);
                    if (iPos != null) {
                        var aData = oTable.fnGetData(iPos);
                        if ($.inArray(aData[0], selected) != -1) {
                            //SM: the string replace is because the aData[0] can not be converted to jquery DOM and can not assign the property 'checked'.
                            aData[0] = aData[0].replace("data-replace='replace'", "checked='checked'");
                        }
                    }
                    $(this).click(function () {
                        var iPos = oTable.fnGetPosition(this);
                        var aData = oTable.fnGetData(iPos);
                        var iId = $(aData[0]).val();
                        is_in_array = $.inArray(iId, selected);
                        if (is_in_array == -1) {
                            selected[selected.length] = iId;
                        }
                        else {
                            selected = $.grep(selected, function (value) {
                                return value != iId;
                            });
                        }
                    });
                });
            }
        });



        //.fnSetFilteringDelay(400); //adding delay in keyup before filtering
    }
    else {
        oTable.fnDraw();
    }
}


function loadTableContentJS(idTable, columns) {
    $(document).ready(function () {
        $('#' + idTable).dataTable({
            'iDisplayLength': 20,
            'iDisplayStart': 0,
            'sPaginationType': 'full_numbers',
            'bJQueryUI': true,
            "aLengthMenu": [[20, 50, 100], [20, 50, 100]],
            'aoColumns': columns,
            //
            //'oLanguage': {
            //    'sUrl': '/Home/GetGridTranslations'
            //},

            'fnInitComplete': function (oSettings, json) {
                $('.dataTables_filter label:first').addClass('search');
                $('a.fg-button').click(function () {
                    $('#selectAll').removeAttr('checked');
                });

            }
            //
        }); //.fnSetFilteringDelay(400);
        setToogleMenuButtons(idTable);
    });
}


function loadTableContentJSFilters(idTable, columns, filtros) {
    var oTable = $('#' + idTable).dataTable({
        'iDisplayLength': 20,
        'iDisplayStart': 0,
        'sPaginationType': 'full_numbers',
        'bJQueryUI': true,
        "aLengthMenu": [[20, 50, 100], [20, 50, 100]],
        'aoColumns': columns,
        // 'oLanguage': {
        //     'sUrl': '/Home/GetGridTranslations'
        // },
        'fnInitComplete': function (oSettings, json) {
            setTableFiltersAndFilters(oTable, idTable, filtros);
            $('.dataTables_filter label:first').addClass('search');

            $('a.fg-button').click(function () {
                $('#selectAll').removeAttr('checked');
            });

        }
    });

    setToogleMenuButtons(idTable);
};

function loadTableContentJSFiltersDateRange(idTable, columns, filtros) {

    $.fn.dataTableExt.afnFiltering.push(setDateRangeFilter);

    var oTable = $('#' + idTable).dataTable({
        'iDisplayLength': 20,
        'iDisplayStart': 0,
        'sPaginationType': 'full_numbers',
        'bJQueryUI': true,
        "aLengthMenu": [[20, 50, 100], [20, 50, 100]],
        'aoColumns': columns,
        'fnInitComplete': function (oSettings, json) {
            $("#" + idTable + "_filter").append($("#lblRange"));
            $("#" + idTable + "_filter label input").css("width", "150px");
            $('.dataTables_filter label:first').addClass('search');

            $('a.fg-button').click(function () {
                $('#selectAll').removeAttr('checked');
            });
            setTableFiltersAndFilters(oTable, idTable, filtros);
        }
        //'oLanguage': {
        //    'sUrl': '/Home/GetGridTranslations'
        //}
    });

    setToogleMenuButtons(idTable);
    setFilterTextClick(oTable);
    setFilterDateClick(oTable);

    $('#dateRange').keyup(function () { $('#' + idTable).dataTable().fnDraw(); });
    $('#dateRange').change(function () { $('#' + idTable).dataTable().fnDraw(); });
    $("#btnDateRange").click(function () { $('#' + idTable).dataTable().fnDraw(); });
    $('#dateRange').daterangepicker();
    $('.ui-daterangepickercontain').css("left", "532px");
};

function setDateRangeFilter(oSettings, aData, iDataIndex) {
    var dateRange = $('#dateRange').attr("value");

    // parse the range from a single field into min and max, remove " - "
    dateMin = dateRange.substring(6, 10) + dateRange.substring(0, 2) + dateRange.substring(3, 5);
    dateMax = dateRange.substring(19, 23) + dateRange.substring(13, 15) + dateRange.substring(16, 18);

    // 4 here is the column where my dates are.
    var date = $(aData[2]).text();
    //var date = aData[iDataIndex];

    // remove the time stamp out of my date
    //date = date.substring(0, 10);
    // remove the "-" characters
    date = date.substring(6) + date.substring(0, 2) + date.substring(3, 5);
    //date = date.substring(12, 16) + date.substring(6, 8) + date.substring(9, 11);

    if (dateMin == "" && dateMax == "") return true;
    else if (dateMin == "" && date <= dateMax) return true;
    else if (dateMin == "" && date <= dateMax) return true;
    else if (dateMin == date && "" == dateMax) return true;
    else if (dateMin <= date && date <= dateMax) return true;

    return false;
}
function setTableFiltersAndFilters(oTable, idTable, filtros) {
    var value = "";
    $("#" + idTable + " thead th").each(function (i) {
        if ($(this).attr("class").indexOf("filter") !== -1) {
            $(this).html(fnCreateSelect(oTable.fnGetColumnData(i).sort(), $(this).attr("aria-label"), filtros));
            setFilterChangeEvent(this, oTable, i);
        }
    });
    $("select.custom-filter").each(function (i) {
        var column = $($("#" + idTable + " thead th")[$(this).data("index")]);
        value = getFilterValueByColumnName(filtros, column.text());
        $(this).val(value);
        column.html($(this));
        setFilterChangeEvent(column, oTable, $(this).data("index"));
    });

    $("#" + idTable + " thead th").each(function (i) {
        if ($(this).attr("class").indexOf("filter") !== -1) {
            $('select', this).change();
        }
    });
    $("select.custom-filter").each(function (i) {
        $(this).change();
    });
    value = getFilterValueByColumnName(filtros, "search");
    if (value !== "") {
        if ($(".dataTables_filter label.search input").size() > 0) {
            $(".dataTables_filter label.search input").val(value);
            $(".dataTables_filter label.search input").keyup();
        }
        else {
            $(".dataTables_filter label input").val(value);
            $(".dataTables_filter label input").keyup();
        }
    }
    var value = getFilterValueByColumnName(filtros, "data-range");
    if (value !== "") {
        $('#searchBy #Date').click();
        $('#dateRange').val(value);
        $("#btnDateRange").click();
    }
}
function setTableFilters(oTable, idTable) {
    setTableFiltersAndFilters(oTable, idTable, "");
}

function setFilterChangeEvent(th, oTable, i) {
    $('select', th).change(function () {
        var sSearch = $(this).val() === "" ? "" : $(this).find("option:selected").text();
        var bSmart = !($(this).val() === "");
        if ($(this).data("equals") === false)
            bSmart = false;

        if (bSmart)
            var sSearch = "^" + sSearch + "$";
        oTable.fnFilter(sSearch, i, bSmart);
    });
}

$.fn.dataTableExt.oApi.fnGetColumnData = function (oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty) {
    // check that we have a column id
    if (typeof iColumn == "undefined") return new Array();
    // by default we only want unique data
    if (typeof bUnique == "undefined") bUnique = true;
    // by default we do want to only look at filtered data
    if (typeof bFiltered == "undefined") bFiltered = true;
    // by default we do not want to include empty values
    if (typeof bIgnoreEmpty == "undefined") bIgnoreEmpty = true;
    // list of rows which we're going to loop through
    var aiRows;

    // use only filtered rows
    if (bFiltered == true) aiRows = oSettings.aiDisplay;
        // use all rows
    else aiRows = oSettings.aiDisplayMaster; // all row numbers

    // set up data array   
    var asResultData = new Array();
    for (var i = 0, c = aiRows.length; i < c; i++) {
        iRow = aiRows[i];
        var aData = this.fnGetData(iRow);
        var sValue = aData[iColumn];

        if (sValue.indexOf("onclick") !== -1) {
            var index = sValue.indexOf(">");
            sValue = sValue.substring(index + 1, sValue.length - 4);
        }

        // ignore empty values?
        if (bIgnoreEmpty == true && sValue.length == 0) continue;
            // ignore unique values?
        else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;
            // else push the value onto the result data array
        else asResultData.push(sValue);
    }

    return asResultData;
};


function fnCreateSelect(aData, columName, filtros) {
    var r = "<select ><option value=''>" + columName + "</option>", i, iLen = aData.length;
    var filterValue = getFilterValueByColumnName(filtros, columName);
    for (i = 0; i < iLen; i++) {
        if (filtros != "") {
            var value = $(aData[i]).text() === "" ? aData[i] : $(aData[i]).text();
            if (value === filterValue) {
                r += "<option value='" + aData[i] + "' selected='selected'>" + aData[i] + "</option>";
            }
            else {
                r += "<option value='" + aData[i] + "'>" + aData[i] + "</option>";
            }
        }
        else {
            r += "<option value='" + aData[i] + "'>" + aData[i] + "</option>";
        }
    }
    return r + '</select>';
}

function getFilterValueByColumnName(filtros, columName) {
    var arrFiltros = filtros.split('|');
    var result = "";
    for (var i = 0; i < arrFiltros.length; i++) {
        var arrValFiltros = arrFiltros[i].split('=');
        var filterName = arrValFiltros[0];
        var filterValue = arrValFiltros[1];
        if (filterName === columName) {
            result = filterValue;
        }
    }
    return result;
}
function setToogleMenuButtons(idDataTable) {
    $('#' + idDataTable + ' :checkbox').change(function () {
        toogleMenuButtons(idDataTable);
    });
}

function toogleMenuButtons(idDataTable) {
    var $this = $(this);
    var array = new Array();
    $('#' + idDataTable).find('[name="selectedItems"]:checked').each(function (index, control) { array.push(control.attributes['data'].value) });
    $(".btn-toogle").show();
    $(".btn-toogle-one").show();
    if (array.length === 0) {
        $(".btn-toogle-one").hide();
        $(".btn-toogle").hide();
    }
    else if (array.length > 1) {
        $(".btn-toogle-one").hide();
        $(".btn-toogle").show();
    }
    else {
        $(".btn-toogle").show();
    }

    //Alerts
    array = [];
    $('#' + idDataTable).find('[data-delete="False"]:checked').each(function (index, control) { array.push(control.attributes['data'].value) });
    if (array.length > 0)
        $(".btn-delete").hide();

}

$(document).ready(function () {
    $(".btn-toogle").hide();
    $(".btn-toogle-one").hide();
});

function setFilterTextClick() {
    $('#searchBy #Text').click(function (e) {
        $('.dataTables_filter input').val('');
        e.preventDefault;
        //fnResetAllFilters(oTable);
        $('#lblRange input').val('');
        $('#btnDateRange').trigger('click');
        $('#lblRange').hide();
        $('#searchBy a').toggleClass('active');
        $('.search').show();
        $('#searchBy span').toggle();
    });
}


function setFilterDateClick(oTable) {
    $('#searchBy #Date').click(function (e) {
        $('.dataTables_filter input').val('');
        e.preventDefault;
        fnResetAllFilters(oTable);
        $('.search').hide();
        $('#searchBy a').toggleClass('active');
        $('#lblRange').show();
        $('#searchBy span').toggle();
    });
}


function fnResetAllFilters(oTable) {
    var oSettings = oTable.fnSettings();
    for (iCol = 0; iCol < oSettings.aoPreSearchCols.length; iCol++) {
        if ($($("#" + $(oTable).attr("id") + " thead tr th")[iCol]).attr("class").indexOf("sortable-none") == -1) {
            oSettings.aoPreSearchCols[iCol].sSearch = '';

        }
    }
    oSettings.oPreviousSearch.sSearch = '';
    oTable.fnDraw();
}
