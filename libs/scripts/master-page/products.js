$(document).ready(function () {

    Product.loadTableData();
    Product.loadSelectData();


    $('.btn').click(function (event) {
        event.preventDefault()
    })
});


const Product = (() => {
    const thisProduct = {};

    let product_id;

    var tableConfig = {
        paging: true,
        searching: true,
        ordering: true,
        search: {
            regex: true,
        },
    };

    thisProduct.loadTableData = () => {
        $.ajax({
            type: "GET",
            url: PRODUCT_CONTROLLER + '?action=getProductTable',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_product').html(response);

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

    thisProduct.loadSelectData = () => {
        $.ajax({
            type: "GET",
            url: CATEGORY_CONTROLLER + '?action=getSelectData',
            dataType: "json",
            success: function (response) {

                $('#slc_product_category').html(response);
            },
            error: function () {

            }
        });
    }

    //ProductsTable

    thisProduct.loadSelectData = () => {
        $.ajax({
            type: "GET",
            url: CATEGORY_CONTROLLER + '?action=getSelectDataCategory',
            dataType: "json",
            success: function (response) {

                $('#slc_product_category').html(response);
            },
            error: function () {

            }
        });
    }

    thisProduct.clickView = (id, product_name) => {
        $.ajax({
            type: "POST",
            url: PRODUCT_CONTROLLER + '?action=getProductDetailsTableModal',
            dataType: "json",
            data:{
                product_id: id
            },
            success: function (response) {
                $('#modal_view_details').modal('show')
                $('#modal_view_details_header').html(product_name)
                $('.table').DataTable().destroy();
                $('#tbody_product_details').html(response);
                
                $('.table').DataTable();
            },
            error: function () {

            }
        });
    }

    thisProduct.clickUpdate = (id, product_name) => {
        product_id = id;

        $.ajax({
            type: "POST",
            url: PRODUCT_CONTROLLER + '?action=getProductForUpdate',
            dataType: "json",
            data:{
                product_id: id
            },
            success: function (response) {
                $('#txt_product_name').val(response.name);
                $('#txt_product_barcode').val(response.barcode);
                $('#slc_product_category').val(response.category_id);
                $('#txt_selling_price').val(parseFloat(response.sale_price).toFixed(2));
                $('#slc_status').val(response.status);
                $('#txt_max_stock').val(response.max_stock);
                $('#txt_min_stock').val(response.min_stock);
                $('#slc_type').val(response.type);
               
                $('#modal_update_details').modal('show')
                $('#modal_update_details_header').html('Update ' + product_name)

                $('#txt_product_name').prop( "disabled", true );
                $('#txt_product_barcode').prop( "disabled", true );
                $('#slc_product_category').prop( "disabled", true );
            },
            error: function () {

            }
        });

    }

    thisProduct.update = () => {
        const product_name = $('#txt_product_name').val();
        const product_barcode = $('#txt_product_barcode').val();
        const product_category = $('#slc_product_category').val();
        const selling_price = $('#txt_selling_price').val();
        const status = $('#slc_status').val();
        const max_stock = $('#txt_max_stock').val();
        const min_stock = $('#txt_min_stock').val();
        const type = $('#slc_type').val();

        $.ajax({
            type: "POST",
            url: PRODUCT_CONTROLLER + '?action=updateProduct',
            dataType: "json",
            data:{
                product_id: product_id,
                product_name: product_name,
                product_barcode: product_barcode,
                product_category: product_category,
                selling_price: selling_price,
                status: status,
                max_stock: max_stock,
                min_stock: min_stock,
                type: type,
            },
            success: function (response) 
            {
                thisProduct.loadTableData();
                // thisProduct.resetFields();
                $('#modal_update_details').modal('hide')
            },
            error: function () {

            }
        });

    }

    thisProduct.chooseCSV = () => {
        $('#chosen_Export').html('Export CSV');
        thisProduct.exportCSV();
    }

    thisProduct.exportCSV = () => {
        $.ajax({
            type: "POST",
            url: PRODUCT_CONTROLLER + '?action=inventoryCSV',
            dataType: "json",
            success: function (data) {
            
                var currentDate = new Date();
                var formattedDate = currentDate.toLocaleDateString().replaceAll('/', '-'); // Format the date as desired
                var filename = `Inventory Report ${formattedDate}.csv`; // Construct the filename with the current date


                var csvContent = "data:text/csv;charset=utf-8,";
                csvContent += Object.keys(data[0]).join(",") + "\n";
                data.forEach(function (item) {
                    var row = Object.values(item).join(",");
                    csvContent += row + "\n";
                });
                
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", filename);
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
            error: function () {

            }
        });
    }

    thisProduct.chooseXLSX = () => {
        $('#chosen_Export').html('Export XLSX');
        thisProduct.exportXLSX();
    }
    
    thisProduct.exportXLSX = () => {
        $.ajax({
            type: "POST",
            url: PRODUCT_CONTROLLER + '?action=inventoryXLSX',
            dataType: "json",
            success: function (data) {
                var filename = data.filename; // Extract filename from the response
                var fileUrl = PRODUCT_CONTROLLER + '?action=download&filename=' + filename;
    

                var link = document.createElement('a');
                link.href = fileUrl;
                link.setAttribute('download', filename);
            
                document.body.appendChild(link);
                link.click();
            
                document.body.removeChild(link);
            },
            error: function () {
                // Handle error
            }
        });
    }
    
    
    
    

    thisProduct.choosePDF = () => {
        $('#chosen_Export').html('Export PDF');
        thisProduct.exportPDF();
    }

    thisProduct.exportPDF = () => {
        var currentDate = new Date();
        var formattedDate = currentDate.toLocaleDateString().replaceAll('/', '-');
        var filename = `Inventory Report ${formattedDate}.pdf`;
    
        var url = PRODUCT_CONTROLLER + '?action=inventoryPDF';
    
        // Open a new window with the PDF content
        window.open(url, '_blank');
    }


    // thisProduct.exportInventory = () => {
    //     $.ajax({
    //         type: "POST",
    //         url: PRODUCT_CONTROLLER + '?action=inventoryExcel',
    //         dataType: "json",
    //         success: function (data) {
            
    //             var currentDate = new Date();
    //             var formattedDate = currentDate.toLocaleDateString().replaceAll('/', '-'); // Format the date as desired
    //             var filename = `Inventory Report ${formattedDate}.csv`; // Construct the filename with the current date


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
    //             link.style.display = "none";
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         },
    //         error: function () {

    //         }
    //     });
    // }

    thisProduct.resetFields = () => {

        $('#txt_product_barcode').val("");
        $('#txt_product_name').val("");
        $('#slc_product_category').val("");
        $('#txt_selling_price').val("");
        $('#slc_status').val("");
        $('#txt_max_stock').val("");
        $('#txt_min_stock').val("");
        $('#txt_location').val("");

        $('#btn_save_product').html('Register Product');
    }


    thisProduct.loadFilteredTableData = () => {
        var selectedCategory = $('#slc_product_category').val();
    
        $.ajax({
            type: "GET",
            url: PRODUCT_CONTROLLER + '?action=getFilteredProductTable&category=' + selectedCategory,
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_product').html(response);
    
                $('.table').DataTable();
            },
            error: function () {
    
            }
        });
    }

    thisProduct.loadFilteredTableDataByType = () => {
        var selectedType = $('#slc_type').val();
    
        $.ajax({
            type: "GET",
            url: PRODUCT_CONTROLLER + '?action=getFilteredProductTableByType&type=' + selectedType,
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_product').html(response);
    
                $('.table').DataTable();
            },
            error: function () {
                // Handle error if needed
            }
        });
    }
    
    
    return thisProduct;
})();