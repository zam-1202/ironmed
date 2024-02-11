$(document).ready(function () {
    Logs.loadData();
});

const select = document.querySelector('.invoice__filters__select');
const filterGroups = document.querySelectorAll('.invoice__filters__group');

const btnSearchDaily = document.querySelector('.invoice__filters__daily__button');
const btnSearchMonthly = document.querySelector('.invoice__filters__monthly__button');
const btnSearchRange = document.querySelector('.invoice__filters__range__button');
const btnConfirmPassword = document.querySelector('.admin__password__button');

const inpSearchDaily = document.querySelector('.invoice__filters__daily__input');
const inpSearchMonthly = document.querySelector('.invoice__filters__monthly__input');
const inpSearchRangeStart = document.querySelector('.invoice__filters__monthly__input__start');
const inpSearchRangeEnd = document.querySelector('.invoice__filters__monthly__input__end');
const inpAdminPassword = document.querySelector('.admin__password__input');

$(document).ready(() => {
    let currentDate = new Date().toJSON().slice(0, 10);
    inpSearchDaily.value = currentDate;
    inpSearchDaily.max = currentDate;
    inpSearchRangeStart.value = currentDate;
    inpSearchRangeStart.max = currentDate;
    inpSearchRangeEnd.value = currentDate;
    inpSearchRangeEnd.max = currentDate;
    getActionLogs();
});


select.addEventListener('change',()=>{
    console.log(select.value);
    filterGroups.forEach(group =>{
        group.classList.contains('hidden')? '': group.classList.add('hidden');
    });
    filterGroups[select.value].classList.remove('hidden');

    $('.table').DataTable().destroy();
    $('.logs_table').html();
    $('.table').DataTable();
});

const getActionLogs =  () => {

    let actionURL;

    if(select.value == 0){
        if(inpSearchDaily.value == ''){
            inpSearchDaily.classList.add('error');
        }
        else{
            inpSearchDaily.classList.remove('error');
            actionURL = `?action=searchDaily&date=${inpSearchDaily.value}`;
        }

    }
    else if(select.value == 1){
        if(inpSearchMonthly.value == ''){
            inpSearchMonthly.classList.add('error');
        }
        else{
            inpSearchMonthly.classList.remove('error');
            actionURL = `?action=searchMonthly&yearmonth=${inpSearchMonthly.value}`;
        }

    }
    else if(select.value == 2){
        if(inpSearchRangeStart.value == '' || inpSearchRangeEnd.value == ''){
            inpSearchRangeStart.classList.add('error');
            inpSearchRangeEnd.classList.add('error');
        }
        else{
            inpSearchRangeStart.classList.remove('error');
            inpSearchRangeEnd.classList.remove('error');
            actionURL = `?action=searchRange&startDate=${inpSearchRangeStart.value}&endDate=${inpSearchRangeEnd.value}`;
        }

    }
    else{

    }

    $.ajax({
        type:'GET',
        url: ACTIONLOG_CONTROLLER + actionURL,
        dataType:'json',
        cache:false,
        success: (data) => {
            console.log(data);
            console.log("clicked");
            let tbody = '';
            let count = 1;
            data.forEach(logs =>{
                tbody+=`<tr>
                <td>${count++}</td>
                <td>${logs.datetime}</td>             
                <td>${logs.role}</td>
                <td>${logs.username}</td>
                <td>${logs.action}</td>
            </tr>`;
            });

            $('.table').DataTable().destroy();
            $('.logs_table tbody').html(tbody);
            $('.table').DataTable();
    
        },
        error: function () {

        }
    });
}

btnSearchDaily.addEventListener('click', getActionLogs);
btnSearchMonthly.addEventListener('click', getActionLogs);
btnSearchRange.addEventListener('click', getActionLogs);

    $('#txt_invoice_date').on('keydown paste', function (e) {
        e.preventDefault();
    });

    $('#txt_invoice_date').on('focus', function () {
        $(this).blur();
    });

    // Disable manual typing for the invoice month
    $('#txt_invoice_month').on('keydown paste', function (e) {
        e.preventDefault();
    });

    $('#txt_invoice_month').on('focus', function () {
        $(this).blur();
    });

    // Disable manual typing for the invoice range
    $('#txt_invoice_startdate').on('keydown paste', function (e) {
        e.preventDefault();
    });

    $('#txt_invoice_startdate').on('focus', function () {
        $(this).blur();
    });

    // Disable manual typing for the invoice range
    $('#txt_invoice_enddate').on('keydown paste', function (e) {
        e.preventDefault();
    });

    $('#txt_invoice_enddate').on('focus', function () {
        $(this).blur();
    });

    $(document).ready(function() {
        var currentDate = new Date();
        var yearMonth = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2);
        $('#txt_invoice_month').val(yearMonth);
    });



const Logs = (() => {
    const thisLogs = {};

    var tableConfig = {
        paging: true,
        searching: true,
        ordering: true,
        search: {
            regex: true,
        },
    };

    thisLogs.loadData = () => {
        $.ajax({
            type: "GET",
            url: ACTIONLOG_CONTROLLER + '?action=getTableData',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbl_data').html(response);

                $('.table').DataTable(tableConfig);

                $(document).ready(function () {
                    var table = $('.table').DataTable();
                    $('.dataTables_filter input')
                        .off()
                        .on('input', function () {
                            $('.table').DataTable().search(this.value, true, false).draw();
                            var body = $(table.table().body());
                            body.unhighlight();
                            body.highlight(table.search());
                            var searchTerm = this.value.toLowerCase();

                            var regex = searchTerm.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                            $.fn.dataTable.ext.search.push(function (settings, searchData, index, rowData, counter) {
                                for (var i = 0; i < searchData.length; i++) {
                                    if (searchData[i].toLowerCase().indexOf(regex) !== -1) {
                                        return true;
                                    }
                                }
                                return false;
                            });
    
                            table.draw();
    
                            $.fn.dataTable.ext.search.pop();
    
                            console.log('Search term in console: "' + searchTerm + '"');
    
                            var exactMatch = table
                                .rows({ search: 'applied' })
                                .data()
                                .toArray()
                                .some(row => row.some(value => value.toLowerCase() === searchTerm.toLowerCase()));
    
                            console.log('Exact match in DataTable:', exactMatch);
                            console.log('DataTable values:', table.rows({ search: 'applied' }).data().toArray());
                        });
    
                    });
    
                },
            error: function () {

            }
        });
    }

    return thisLogs;
})();