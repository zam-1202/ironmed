const select = document.querySelector('.invoice__filters__select');
const filterGroups = document.querySelectorAll('.invoice__filters__group');

const btnSearchDaily = document.querySelector('.invoice__filters__daily__button');
const btnSearchMonthly = document.querySelector('.invoice__filters__monthly__button');
const btnSearchRange = document.querySelector('.invoice__filters__range__button');

const btnExportRange = document.querySelector('.invoice__export__daily__button');
const btnExportMonthly = document.querySelector('.invoice__export__monthly__button');
const btnYearRange = document.querySelector('.invoice__export__year__button');

const btnConfirmPassword = document.querySelector('.admin__password__button');

const inpSearchDaily = document.querySelector('.invoice__filters__daily__input');
const inpSearchMonthly = document.querySelector('.invoice__filters__monthly__input');
const inpSearchRangeStart = document.querySelector('.invoice__filters__monthly__input__start');
const inpSearchRangeEnd = document.querySelector('.invoice__filters__monthly__input__end');
const inpAdminPassword = document.querySelector('.admin__password__input');

const SessionRole = document.querySelector('#SessionRole');

let invoice_id;
let product_id;

var tableConfig = {
    paging: true,
    searching: true,
    ordering: true,
    search: {
        regex: true,
    },
};


$(document).ready(() => {
    let currentDate = new Date().toJSON().slice(0, 10);
    inpSearchDaily.value = currentDate;

    inpSearchDaily.max = currentDate;

    getInvoices();
});
// $(document).ready(() => {
//     // Set the desired date to February 10, 2024
//     let selectedDate = '2024-02-10';

//     // Set the value of the input field to the selected date
//     inpSearchDaily.value = selectedDate;

//     // Set the maximum allowed date to the current date
//     let currentDate = new Date().toJSON().slice(0, 10);
//     inpSearchDaily.max = currentDate;

//     // Call the function to get the invoices
//     getInvoices();
// });


const invoiceTable = document.querySelector('.invoice__table');

select.addEventListener('change',()=>{
    console.log(select.value);
    filterGroups.forEach(group =>{
        group.classList.contains('hidden')? '': group.classList.add('hidden');
    });
    filterGroups[select.value].classList.remove('hidden');

    inpSearchDaily.classList.remove('error');
    inpSearchMonthly.classList.remove('error');
    inpSearchRangeStart.classList.remove('error');
    inpSearchRangeEnd.classList.remove('error');
    inpSearchRangeStart.value = '';
    inpSearchRangeEnd.value = '';

    $('.table').DataTable().destroy();
    $('.invoice__table tbody').html('');
    $('.table').DataTable();
});

const getInvoices =  () => {

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
        url: INVOICE_CONTROLLER + actionURL,
        dataType:'json',
        cache:false,
        success: (data) => {
            console.log(data);
            let tbody = '';
            let count = 1;
            data.forEach(invoice =>{
                tbody+=`<tr>
                <td>${count++}</td>
                <td>${invoice.users_name}</td>             
                <td>${invoice.date_transact}</td>
                <td>${invoice.number}</td>
                <td>${invoice.total_items}</td>
                <td>${invoice.total_purchase}</td>
                <td>
                    <button onclick="openModal('${invoice.id}')">View</button>
                </td>
            </tr>`;
            });

            $('.table').DataTable().destroy();
            $('.invoice__table tbody').html(tbody);
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

                    // Remove the custom search function
                    $.fn.dataTable.ext.search.pop();

                    console.log('Search term in console: "' + searchTerm + '"');

                    // Check if the user's search exactly matches a value in the DataTable
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

const openModal = (id) => {
    $('#myModal').modal('show');
    $.ajax({
        type:'get',
        url: INVOICE_CONTROLLER + `?action=getInvoiceSales&invoice_id=${id}`,
        dataType: 'json',
        cache:false,
        success: (data) =>{
            console.log(data);
            let tbody = '';

            data.forEach(item => {
                if(item.void == null){
                tbody += `<tr>
                <td>${item.qty}</td>
                <td>${item.name}</td>
                <th>${item.price}</th>
                <td>
                    <button class="invoice__modal__void" onclick="confirmVoidItem(${item.invoice_id}, ${item.product_id})">Void</button>
                </td>
            </tr>`;
                }
                else{
                    tbody += `<tr>
                    <td>${item.qty}</td>
                    <td>${item.name}</td>
                    <th>${item.price}</th>
                    <td>
                        <button class="invoice__modal__void" disabled style="color:red">Voided</button>
                    </td>
                </tr>`;
                }
            });

            if ($.fn.DataTable.isDataTable('#sales__table')) {
                $('#sales__table').DataTable().destroy();
            }
            $('#sales__table tbody').html(tbody);

            var modalTable = $('#sales__table').DataTable(tableConfig);

            $('#sales__table_filter input').unbind().bind('input', function () {
                modalTable.search(this.value).draw();

                var searchTerm = this.value.toLowerCase();
                var body = $(modalTable.table().body());
                body.unhighlight();
                body.highlight(searchTerm);

                var regex = searchTerm.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                $.fn.dataTable.ext.search.push(function (settings, searchData, index, rowData, counter) {
                    for (var i = 0; i < searchData.length; i++) {
                        if (searchData[i].toLowerCase().indexOf(regex) !== -1) {
                            return true;
                        }
                    }
                    return false;
                });

                modalTable.draw();

                $.fn.dataTable.ext.search.pop();
            });
        },
        error: function () {
            // Handle errors
        }
    });
}

const validateAdminPassword = () => {
 
    $.ajax({
        type: 'POST',
        url: USER_CONTROLLER + `?action=validateAdminPassword`,
        data:{
            password:inpAdminPassword.value
        },
        dataType: 'json',
        cache: false,
        success: (result) => {
            if(result == true) {
                voidItem(invoice_id, product_id)
                $('#modal_confirmpassword').modal('hide');
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Invalid Password',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    });
    inpAdminPassword.value = "";
}

const confirmVoidItem = (invoice, product) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be reverted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, void it!'
    }).then((result) => {
        if (result.isConfirmed) {
            if (SessionRole.value == 3) {
                $('#modal_confirmpassword').modal('show');
            } else {
                voidItem(invoice, product);
            }
        }
    });
}

const voidItem = (invoice, product) => {
        $.ajax({
            type: 'POST',
            url: INVOICE_CONTROLLER + `?action=voidItem`,
            data:{
                invoice:invoice,
                product:product
            },
            dataType: 'json',
            cache: false,
            success: (data) => {
                // console.log(data);
                getInvoices();
                openModal(invoice);
            }
        });
}
const exportInvoices = () => {

    const selectedDate = document.getElementById('txt_invoice_date').value;
    console.log('Selected Date:', selectedDate); // Log the selected date to the console
    // Ajax request to export the invoices
    $.ajax({
        type: 'GET',
        url: INVOICE_CONTROLLER + `?action=exportDaily&date=${selectedDate}`,
        dataType: 'json',
        cache: false,
        success: (response) => {
            // Assuming your response contains the filename
            var filename = response.filename;
            var fileUrl = INVOICE_CONTROLLER + '?action=download&filename=' + filename;

            // Create a link element to trigger the download
            var link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', filename);

            // Trigger the download
            document.body.appendChild(link);
            link.click();

            // Remove the link from the DOM
            document.body.removeChild(link);
        },
        error: (xhr, status, error) => {
            console.error(error); // Log any errors to the console
        }
    });
}



btnSearchDaily.addEventListener('click', getInvoices);
btnSearchMonthly.addEventListener('click', getInvoices);
btnSearchRange.addEventListener('click', getInvoices);
btnConfirmPassword.addEventListener('click', validateAdminPassword);

btnExportRange.addEventListener('click', exportInvoices);


 // Disable manual typing for the invoice date
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
