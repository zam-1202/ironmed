const select = document.querySelector('.sales__filters__select');
const filterGroups = document.querySelectorAll('.sales__filters__group');
const btnExport = document.querySelector('.button__export__file');

const btnSearchDaily = document.querySelector('.sales__filters__daily__button');
const btnSearchMonthly = document.querySelector('.sales__filters__monthly__button');
const btnSearchRange = document.querySelector('.sales__filters__range__button');
const btnConfirmPassword = document.querySelector('.admin__password__button');

const inpSearchDaily = document.querySelector('.sales__filters__daily__input');
const inpSearchMonthly = document.querySelector('.sales__filters__monthly__input');
const inpSearchRangeStart = document.querySelector('.sales__filters__monthly__input__start');
const inpSearchRangeEnd = document.querySelector('.sales__filters__monthly__input__end');

const btnExportRange = document.querySelector('.sales__export__daily__button');
const btnExportMonthly = document.querySelector('.sales__export__monthly__button');
const btnYearRange = document.querySelector('.sales__export__year__button');

var tableConfig = {
    paging: true,
    searching: true,
    ordering: true,
    search: {
        regex: true,
    },
};

// $(document).ready(() => {
//     // Set the desired date to February 10, 2024
//     let selectedDate = '2024-03-03';

//     // Set the value of the input field to the selected date
//     inpSearchDaily.value = selectedDate;

//     // Set the maximum allowed date to the current date
//     let currentDate = new Date().toJSON().slice(0, 10);
//     inpSearchDaily.max = currentDate;

//     // Call the function to get the invoices
//     getSales();
// });

$(document).ready(() => {
    let currentDate = new Date().toJSON().slice(0, 10);
    inpSearchDaily.value = currentDate;

    inpSearchDaily.max = currentDate;

    getSales();
});


const salesTable = document.querySelector('.sales__table');

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
    $('.sales__table tbody').html('');
    $('.table').DataTable();
});

const getSales =  () => {

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
        url: SALES_CONTROLLER + actionURL,
        dataType:'json',
        cache:false,
        success: (data) => {
            console.log(data);
            let tbody = '';
            let count = 1;
            data.forEach(sale =>{
                tbody+=`<tr>
                <td>${count++}</td>
                <td>${sale.users_name}</td>             
                <td>${sale.date_purchased}</td>
                <td>${sale.number}</td>
                <td>${sale.name}</td>
                <td>${sale.qty}</td>
                <td>${sale.original_price}</td>
                <td>${sale.total_purchase}</td>
            </tr>`;
            });

            $('.table').DataTable().destroy();
            $('.sales__table tbody').html(tbody);
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

const exportDailySales = () => {
    const selectedDate = document.getElementById('date_daily').value;
    const filename = 'SalesReport_' + selectedDate + '.xlsx';
    console.log('Selected Date:', selectedDate);
    

    $.ajax({
        type: 'GET',
        url: SALES_CONTROLLER + `?action=exportDaily&date=${selectedDate}&filename=${filename}`, // Pass the filename in the URL
        dataType: 'json',
        cache: false,
        success: (response) => {
            if (response && response.filename) {

                var filename = response.filename;
                var fileUrl = SALES_CONTROLLER + '?action=download&filename=' + filename;


                var link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', filename);


                document.body.appendChild(link);
                link.click();


                document.body.removeChild(link);
            } else if (response && response.message === 'No data available') {
               Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'No data available',
                    showConfirmButton: true,
                });
            } else {
                swal("Error", "An unexpected error occurred.", "error");
            }
        },
        error: (xhr, status, error) => {
            console.error(error);
            swal("Error", "An unexpected error occurred.", "error");
        }
    });
}

const exportMonthlySales = () => {
    const selectedMonth = document.getElementById('date_monthly').value;
    const filename = 'SalesReport_' + selectedMonth + '.xlsx';
    console.log('Selected Month:', selectedMonth);
    

    $.ajax({
        type: 'GET',
        url: SALES_CONTROLLER + `?action=exportMonthly&yearmonth=${selectedMonth}&filename=${filename}`,
        dataType: 'json',
        cache: false,
        success: (response) => {
            if (response && response.filename) {

                var filename = response.filename;
                var fileUrl = SALES_CONTROLLER + '?action=download&filename=' + filename;


                var link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', filename);


                document.body.appendChild(link);
                link.click();


                document.body.removeChild(link);
            } else if (response && response.message === 'No data available') {
               Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'No data available',
                    showConfirmButton: true,
                });
            } else {
                swal("Error", "An unexpected error occurred.", "error");
            }
        },
        error: (xhr, status, error) => {
            console.error(error);
            swal("Error", "An unexpected error occurred.", "error");
        }
    });
}

const exportRangeSales = () => {
    const startDate = document.getElementById('date_start').value;
    const endDate = document.getElementById('date_end').value;
    const filename = 'SalesReport_' + startDate + '_' + endDate + '.xlsx';
    console.log('Selected Range:', startDate + '_' + endDate);

    $.ajax({
        type: 'GET',
        url: SALES_CONTROLLER + `?action=exportRange&startDate=${inpSearchRangeStart.value}&endDate=${inpSearchRangeEnd.value}&filename=${filename}`,
        dataType: 'json',
        cache: false,
        success: (response) => {
            if (response && response.filename) {
                var fileUrl = SALES_CONTROLLER + '?action=download&filename=' + response.filename;
                var link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', response.filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (response && response.message === 'No data available') {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'No data available',
                    showConfirmButton: true,
                });
            } else {
                swal("Error", "An unexpected error occurred.", "error");
            }
        },
        error: (xhr, status, error) => {
            console.error(error);
            swal("Error", "An unexpected error occurred.", "error");
        }
    });
}



// const Sales = (() => {
//     const thisSales = {};
//     let barchart;
//     let piechart;
//     let dateFrom;
//     let dateTo;


//     thisSales.searchClick = (filter_by) => {
//         // let dateFrom;
//         // let dateTo;
//         if(filter_by == 'Daily') {
//             let txt_date = $('#date_daily').val();
//             if(txt_date == '') {
//                 alert("date should have value");
//             } else {
//                 dateFrom = txt_date;
//                 dateTo = txt_date;
//             }
//         } else if(filter_by == 'Monthly') {
//             let txt_date = $('#date_monthly').val();
//             if(txt_date == '') {
//                 alert("date should have value");
//             } else {
//                 dateFrom = `${txt_date}-01`;
//                 dateTo =  `${txt_date}-31`;
//             }

//         } else if (filter_by == 'DateRange') {
//             let date_start = $('#date_start').val();
//             let date_end = $('#date_end').val();
//             if(date_start == '' || date_end == '') {
//                 alert("date should have value");
//             } else {
//                 dateFrom = date_start;
//                 dateTo =  date_end;
//             }
//         }


//         thisSales.getReportsData(dateFrom, dateTo);
//         // thisSales.getReportTable(dateFrom, dateTo);
//         thisSales.showSalesTable(dateFrom, dateTo);
//     }

    // thisSales.getReportsData = (dateFrom, dateTo) => {
    //     const action = '?action=getReportData';
    //     $.ajax({
    //         type: "POST",
    //         url: `${SALES_CONTROLLER}${action}`,
    //         data: {
    //             dateFrom: dateFrom,
    //             dateTo: dateTo
    //         },
    //         dataType: "json",
    //         success: function (response) {   
    //             $('#lbl_total_sales').html(`Total Sales: ₱${parseFloat(response.total_sales).toFixed(2)}`)

    //             if(barchart) {
    //                 barchart.destroy();
    //                 piechart.destroy();
    //             }
                

    //             // thisSales.loadBarchart(response.labels, response.barchart_dataset)
    //             // thisSales.loadPieChart(response.labels, response.piechart_dataset)
    //         },
    //         error: function () {

    //         }
    //     });
    // }


    // thisSales.loadBarchart = (labels, dataset) => {
    //     var graphCanvas = $('#productSalesChart').get(0).getContext('2d')

    //     var areaChartData = {
    //         labels: labels,
    //         datasets: [dataset]
    //     }

    //     var barChartData = $.extend(true, {}, areaChartData)

    //     var barChartOptions = {
    //         responsive: true,
    //         scales: {
    //             yAxes: [{
    //                 display: true,
    //                 ticks: {
    //                     suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
    //                     suggestedMax: 50,    // minimum will be 0, unless there is a lower value.
    //                     // OR //
    //                     beginAtZero: true   // minimum value will be 0.
    //                 }
    //             }]
    //         }
    //     }

    //     barchart = new Chart(graphCanvas, {
    //         type: 'bar',
    //         data: barChartData,
    //         options: barChartOptions
    //     })
    // }

    // thisSales.loadPieChart = (labels, dataset) => {
    //     var pieChartCanvas = $('#piechart').get(0).getContext('2d')
    //     var pieData = {
    //         labels: labels,
    //         datasets: [
    //             dataset
    //         ]
    //     }
    //     var pieOptions = {
    //         maintainAspectRatio: false,
    //         responsive: true,
    //     }
    //     piechart = new Chart(pieChartCanvas, {
    //         type: 'pie',
    //         data: pieData,
    //         options: pieOptions
    //     })
    // }

    // thisSales.showSalesTable = (dateFrom, dateTo) => {
    //     const action = '?action=showReportTable';
    //     $.ajax({
    //         type: "POST",
    //         url: `${SALES_CONTROLLER}${action}`,
    //         data: {
    //             dateFrom: dateFrom,
    //             dateTo: dateTo
    //         },
    //         dataType: "json",
    //         success: function (response) {   
    //             $('.table').DataTable().destroy();
    //             $('#tbody_sales').html(response);
    //             // thisSales.export(response);

    //             $('.table').DataTable();
                
    //         },
    //         error: function () {

    //         }
    //     });
    // }

    // thisSales.export = () => {
    //     const action = '?action=exportData';
    //     $.ajax({
    //         type: "POST",
    //         url: `${SALES_CONTROLLER}${action}`,
    //         data: {
    //             dateFrom: dateFrom,
    //             dateTo: dateTo
    //         },
    //         dataType: "json",
    //         success: function (data) {   

    //             var currentDate = new Date();
    //             var formattedDate = currentDate.toLocaleDateString().replaceAll('/', '-'); // Format the date as desired
    //             var filename = `Sales Report ${formattedDate}.csv`; // Construct the filename with the current date
            
    //             var csvContent = "data:text/csv;charset=utf-8,";
    //             csvContent += Object.keys(data[0]).join(",") + "\n";
    //             data.forEach(function (item) {
    //                 var row = Object.values(item).join(",");
    //                 csvContent += row + "\n";
    //             });

    //             var encodedUri = encodeURI(csvContent);
    //             var link = document.createElement("a");
    //             link.setAttribute("href", encodedUri);
    //             link.setAttribute("download", filename);
    //             link.style.display = "none";  // Hide the link element
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         },
    //         error: function () {

    //         }
    //     });
    // }

    // thisSales.showSalesTable = (product_name, total_price, total_sales) => {
    //     product_name = product_name;
    //     total_price = total_price;
    //     total_sales = total_sales;
    //     $.ajax({
    //         type: "POST",
    //         url: SALES_CONTROLLER + '?action=getSalesData',
    //         dataType: "json",
    //         data:{
    //             // product_barcode: product_barcode,
    //             product_name: product_name,
    //             total_sales: total_sales,
    //             total_price: total_price,
    //         },
    //         success: function (response) 
    //         {
    //             $('#tbody_sales').html(response);
    //         },
    //         error: function () {                }
            
            
    //     });
    // }

//     return thisSales;
// })();

btnSearchDaily.addEventListener('click', getSales);
btnSearchMonthly.addEventListener('click', getSales);
btnSearchRange.addEventListener('click', getSales);

btnExportRange.addEventListener('click', exportDailySales);
btnExportMonthly.addEventListener('click', exportMonthlySales);
btnYearRange.addEventListener('click', exportRangeSales);


// Disable manual typing for the sales date
$('#date_daily').on('keydown paste', function (e) {
    e.preventDefault();
  });

  $('#date_daily').on('focus', function () {
    $(this).blur();
  });

  // Disable manual typing for the sales month
 $('#date_monthly').on('keydown paste', function (e) {
    e.preventDefault();
  });

  $('#date_monthly').on('focus', function () {
    $(this).blur();
  });

  // Disable manual typing for the sales date range
 $('#date_start').on('keydown paste', function (e) {
    e.preventDefault();
  });

  $('#date_start').on('focus', function () {
    $(this).blur();
  });

  // Disable manual typing for the sales date range
 $('#date_end').on('keydown paste', function (e) {
    e.preventDefault();
  });

  $('#date_end').on('focus', function () {
    $(this).blur();
  });

  $(document).ready(function() {
    var currentDate = new Date();
    var yearMonth = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2);
    $('#date_monthly').val(yearMonth);
});
