$(document).ready(function () {
    Category.loadTableData();
    Category.loadSelectData();

    Product.loadTableData();

    $('.btn').click(function (event){
        event.preventDefault()
    })
});

var unsavedChanges = false;
var hasValues = false;

var initialFieldValues = {};

$(':input').each(function () {
    initialFieldValues[this.id] = $(this).val();
});


$(document).on('input', ':input:not(.dataTables_filter input):not([aria-controls^="DataTables_Table_"])', function () {

    var currentFieldValue = $(this).val();
    var initialFieldValue = initialFieldValues[this.id];

    console.log('Field ID:', this.id, 'Current Value:', currentFieldValue, 'Initial Value:', initialFieldValue);

    if (this.id !== 'slc_status') {
        if (currentFieldValue !== initialFieldValue) {
            unsavedChanges = true;

            // Log the field ID and its current value
            console.log('Field ID with unsaved changes:', this.id, 'Current Value:', currentFieldValue);
        } else {
            unsavedChanges = false;
        }
    }
});



function showLeaveConfirmation() {
    return Swal.fire({
        title: 'There are unsaved changes',
        text: 'Do you really want to discard changes?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    });
}

function resetUnsavedChanges() {
    unsavedChanges = false;
}

function UnsavedChangesTrue() {
    unsavedChanges = true;
}

window.onbeforeunload = function() {
    if (unsavedChanges) {
        return "There are unsaved changes";
    }
};

$(document).on('click', 'a[href]:not([target="_blank"])', function (e) {
    if ($(this).closest('.paginate_button').length === 0) {
        if (unsavedChanges) {
            var nonEmptyInputs = $(':input').filter(function () {
                return this.value.trim() !== '';
            });

            if (nonEmptyInputs.length === 0) {
                resetUnsavedChanges();
                return;
            }

            if ($(this).text().trim().toLowerCase() === 'logout') {
                window.onbeforeunload = null;
                window.location.href = e.target.href;
                return;
            }

            e.preventDefault();
            showLeaveConfirmation().then((result) => {
                if (result.isConfirmed) {
                    resetUnsavedChanges();
                    window.location.href = e.target.href;
                }
            });
        }
    }
});

const Category = (() => {
    const thisCategory = {};

    let category_id = '';

    let toUpdate = false;

    var tableConfig = {
        paging: true,
        searching: true,
        ordering: true,
        search: {
            regex: true,
        },
    };

    thisCategory.loadTableData = () => {
        $.ajax({
            type: "GET",
            url: CATEGORY_CONTROLLER + '?action=getTableData',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_category').html(response);

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

    thisCategory.loadSelectData = () => {
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

    thisCategory.clickSaveButton= () => {
        if(!toUpdate) {
            thisCategory.save()
        }
        else {
            thisCategory.update()
        }
    }

    thisCategory.save = () => {
        const category_name = $('#txt_category_name').val();

        if(category_name == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Category Field should have value',
                showConfirmButton: true,
            })
        }
        else {
            $.ajax({
                type: "POST",
                url: CATEGORY_CONTROLLER + '?action=save',
                dataType: "json",
                data:{
                    category_name: category_name
                },
                success: function (response) 
                {
                    $('#txt_category_name').val("")
                    thisCategory.loadTableData();
                    thisCategory.loadSelectData();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Category added successfully',
                        showConfirmButton: true,
                    })
                },
                error: function () {
    
                }
            });
        }        
    }

    thisCategory.clickUpdate = (id) => {
        category_id = id;

        $.ajax({
            type: "POST",
            url: CATEGORY_CONTROLLER + '?action=getById',
            dataType: "json",
            data:{
                category_id: category_id
            },
            success: function (response) 
            {
                $('#txt_category_name').val(response.name);
                toUpdate = true;

                $('#btn_save_category').html('Update Category');
            },
            error: function () {

            }
        });
    }

    thisCategory.update = () => {
        const category_name = $('#txt_category_name').val();

        $.ajax({
            type: "POST",
            url: CATEGORY_CONTROLLER + '?action=update',
            dataType: "json",
            data:{
                category_id: category_id,
                category_name: category_name
            },
            success: function (response) 
            {
                $('#txt_category_name').val("")
                thisCategory.loadTableData();
                thisCategory.loadSelectData();
                $('#btn_save_category').html('Register Category');
                toUpdate = false;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Category updated successfully',
                    showConfirmButton: true,
                })
            },
            error: function () {

            }
        });
    }

    thisCategory.clickCancel = () => {
        $('#txt_category_name').val("")
        toUpdate = false;
        $('#btn_save_category').html('Register Category');
    }

    thisCategory.clickCancel = () => {
        $('#txt_category_name').val("")
        toUpdate = false;
        $('#btn_save_category').html('Register Category');
    }

    thisCategory.clickDelete = (id) => {
        category_id = id

        Swal.fire({
            title: 'Are you sure?',
            text: "You will not be able to revert this action",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                thisCategory.delete();
            }
        })
    }

    thisCategory.delete = () => {
        $.ajax({
            type: "POST",
            url: CATEGORY_CONTROLLER + '?action=delete',
            dataType: "json",
            data:{
                category_id: category_id
            },
            success: function (response) 
            {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Category Deleted Successfully ',
                    showConfirmButton: false,
                    timer: 1500
                })
                thisCategory.loadTableData();
                thisCategory.loadSelectData();
            },
            error: function () {

            }
        });
    }

    return thisCategory;
})()

        // limit 10 years ang manufacture
        const day_today = new Date();
        const tenYearsAgo = new Date(day_today.getFullYear() - 10, day_today.getMonth(), day_today.getDate());
        const inputDate = document.getElementById("txt_manufature_date");
        inputDate.min = tenYearsAgo.toISOString().split("T")[0];

        // limit 10 years ang expiration
        const todaydate = new Date();
        const tenYearsFromNow = new Date(todaydate.getFullYear() + 10, todaydate.getMonth(), todaydate.getDate());
        const exp_date = document.getElementById("txt_expiraton_date");
        exp_date.max = tenYearsFromNow.toISOString().split("T")[0];
  
        // disable future dates
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const year = today.getFullYear();
        const month = today.getMonth();
        const dates = today.getDate();
      
        // Set max date to today's date
        const maxDate = new Date(year, month, dates).toISOString().split('T')[0];
        document.getElementById("txt_manufature_date").setAttribute("max", maxDate);
      
    //   disable past dates
      let dateInput = document.getElementById('txt_expiraton_date'); 
       
      const cur_date = new Date(); 
      const cur_month = cur_date.getMonth() > 9 ? cur_date.getMonth() + 1 : '0' + (cur_date.getMonth() + 1); 
      const cur_day = cur_date.getDate() > 9 ? cur_date.getDate() : '0' + cur_date.getDate();
      const dateStr = cur_date.getFullYear() + '-' + cur_month + '-' + cur_day; 
      dateInput.setAttribute('min', dateStr); 

const Product = (() => {


    let thisProduct = {};

    let product_id;
    let product_details_id;
    let toUpdate = false;


    thisProduct.loadTableData = () => {
        $.ajax({
            type: "GET",
            url: PRODUCT_CONTROLLER + '?action=getTableDataRegister',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_product').html(response);

                $('.table').DataTable();
                
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
    
                            // console.log('Exact match in DataTable:', exactMatch);
                            // console.log('DataTable values:', table.rows({ search: 'applied' }).data().toArray());
                        });
    
                    });
    
                },
                error: function () {
    
                }
            });
        }

    thisProduct.clickSaveButton = () => {
        console.log('test');
        if(!toUpdate) {
            console.log('test2');
            thisProduct.save()
        }
        else {
            thisProduct.update()
        }
    }

    thisProduct.save = () => {
        const regex = /^[a-zA-Z0-9-'.' ]+$/;
        const product_barcode = $('#txt_product_barcode').val();
        const product_name = $('#txt_product_name').val();
        const product_category = $('#slc_product_category').val();
        const lot_num = $('#txt_lot_number').val();
        const buying_price = $('#txt_buying_price').val();
        const selling_price = $('#txt_selling_price').val();
        const manufature_date = $('#txt_manufature_date').val();
        const expiraton_date = $('#txt_expiraton_date').val();
        const status = $('#slc_status').val();
        const quantity = $('#txt_quantity').val();
        const type = $('#slc_type').val();
        const location = $('#txt_location').val();
        const date = new Date();
        date.setDate(date.getDate() + 180);
        var expiration = new Date(expiraton_date);
        // var todayDate = Date(expiraton_date);
        const datetoday = new Date();
        datetoday.setDate(datetoday.getDate());
        var manufacture = new Date(manufature_date);
        // a = todayDate.toString();

        if(product_barcode == "" 
        || product_name == ""
        || product_category == ""
        || lot_num == ""
        || buying_price == ""
        || selling_price == ""
        || manufature_date == ""
        || expiraton_date == ""
        || quantity == ""
        || type == null
        || status == null
        || location == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please fill out all fields',
                showConfirmButton: true,
            })
            
        }
        else if (manufacture >= datetoday){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Cannot add products that is not manufactured yet',
                showConfirmButton: true,
            })
        }          
        else if (date >= expiration){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Expiration date is due in less than six months',
                showConfirmButton: true,
            })
        }    
        else if (expiration <= date){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Invalid expiration date',
                showConfirmButton: true,
            })
        }
        else if (buying_price >= selling_price){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Buying price should be lower than Selling price',
                showConfirmButton: true,
            })
        }
        else if (!regex.test(product_name)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid Product Name',
                text: 'Only letters, numbers, hyphen, and period are allowed.',
                showConfirmButton: true,
            });
        }
        else if (product_name.trim() === "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Empty Product Name',
                text: 'Please fill out the name field.',
                showConfirmButton: true,
            });
        }
        else if (!regex.test(location)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid Location Name',
                text: 'Only letters, numbers, hyphen, and period are allowed.',
                showConfirmButton: true,
            });
        }
        else if (location.trim() === "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Empty Location Name',
                text: 'Please fill out the location field.',
                showConfirmButton: true,
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: PRODUCT_CONTROLLER + '?action=save',
                dataType: "json",
                data:{
                    product_barcode: product_barcode,
                    product_name: product_name,
                    product_category: product_category,
                    lot_num: lot_num,
                    buying_price: buying_price,
                    selling_price: selling_price,
                    manufature_date: manufature_date,
                    expiraton_date: expiraton_date,
                    status: status,
                    quantity: quantity,
                    type: type,
                    location: location,
                },
                success: function (response) 
                {
                    thisProduct.loadTableData();
                    thisProduct.resetFormFields();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Product added successfully',
                        showConfirmButton: true,
                    })
                },
                error: function () {                }
                
                
            });
        }
    }

    thisProduct.clickUpdate = (id, product_table_id) => {
        
        product_details_id = id;
        product_id = product_table_id;
        if(id == 0) {
            $.ajax({
                type: "POST",
                url: PRODUCT_CONTROLLER + '?action=getRegisteredProductsById',
                dataType: "json",
                data:{product_id : product_id},
                success: function(response) {
                    console.log('Response:', response); 
                    // $originallot_num = response.name;
                    // $originalbuying_price = response.name;
                    // $originalselling_price = response.name;
                    // $originalmanufature_date = response.name;
                    // $originalexpiraton_date = response.name;
                    // $originalquantity = response.name;
                    // $originallocation = response.name;
                    $('#txt_product_barcode').val(response[0]['barcode']);
                    $('#txt_product_name').val(response[0]['name']);
                    $('#slc_product_category').val(response[0]['category_id']);
                    $('#slc_type').val(response[0]['type']);
                }
            })
        } else {
            if (unsavedChanges) {
                showLeaveConfirmation().then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            type: "POST",
                            url: PRODUCT_CONTROLLER + '?action=getById',
                            dataType: "json",
                            data: { product_details_id: product_details_id },
                            success: function (response) {
                                $originalLotNum = response.name;
                                $originalBuyingPrice = response.name;
                                $originalSellingPrice = response.name;
                                $originalManufactureDate = response.name;
                                $originalExpirationDate = response.name;
                                $originalQuantity = response.name;
                                $originalLocation = response.name;
                                $('#txt_product_barcode').val(response.barcode);
                                $('#txt_product_barcode').prop( "disabled", true );
                                $('#txt_product_name').val(response.product_name);
                                $('#txt_product_name').prop( "disabled", true );
                                $('#slc_product_category').val(response.category_id);
                                $('#slc_product_category').prop( "disabled", true );
                                $('#txt_lot_number').val(response.lot_num);
                                $('#txt_lot_number').prop( "disabled", false );
                                $('#txt_buying_price').val(response.buy_price);
                                $('#txt_selling_price').val(response.sale_price);
                                $('#txt_selling_price').prop( "disabled", false );
                                $('#txt_manufature_date').val(response.manufacture_date);
                                $('#txt_manufature_date').prop( "disabled", false );
                                $('#txt_expiraton_date').val(response.expiration_date);
                                $('#txt_expiraton_date').prop( "disabled", false );
                                $('#slc_status').val(response.status);
                                $('#slc_status').prop( "disabled", true );
                                $('#txt_quantity').val(response.quantity);
                                $('#slc_type').val(response.type);
                                $('#slc_type').prop( "disabled", true );
                                $('#txt_location').val(response.location);
                                $('#txt_location').prop( "disabled", false );
                                $('#txt_location').removeClass('red-input');
                                
                                toUpdate = true;
                                
            
                                $('#btn_save_product').html('Update');
                                $('#txt_title').html('Update Product');
                                unsavedChanges = true;
                                hasValues = true;
            
                            },
                            error: function () {
                            }
                        });
                    }
                });
        } else {
            $.ajax({
                type: "POST",
                url: PRODUCT_CONTROLLER + '?action=getById',
                dataType: "json",
                data:{
                    product_details_id: product_details_id
                },
                success: function (response) 
                {
                    $originalLotNum = response.name;
                    $originalBuyingPrice = response.name;
                    $originalSellingPrice = response.name;
                    $originalManufactureDate = response.name;
                    $originalExpirationDate = response.name;
                    $originalQuantity = response.name;
                    $originalLocation = response.name;
                    $('#txt_product_barcode').val(response.barcode);
                    $('#txt_product_barcode').prop( "disabled", true );
                    $('#txt_product_name').val(response.product_name);
                    $('#txt_product_name').prop( "disabled", true );
                    $('#slc_product_category').val(response.category_id);
                    $('#slc_product_category').prop( "disabled", true );
                    $('#txt_lot_number').val(response.lot_num);
                    $('#txt_lot_number').prop( "disabled", true );
                    $('#txt_buying_price').val(response.buy_price);
                    $('#txt_selling_price').val(response.sale_price);
                    $('#txt_selling_price').prop( "disabled", false );
                    $('#txt_manufature_date').val(response.manufacture_date);
                    $('#txt_manufature_date').prop( "disabled", true );
                    $('#txt_expiraton_date').val(response.expiration_date);
                    $('#txt_expiraton_date').prop( "disabled", true );
                    $('#slc_status').val(response.status);
                    $('#slc_status').prop( "disabled", true );
                    $('#txt_quantity').val(response.quantity);
                    $('#slc_type').val(response.type);
                    $('#slc_type').prop( "disabled", true );
                    $('#txt_location').val(response.location);
                    $('#txt_location').prop( "disabled", false );
                    $('#txt_location').removeClass('red-input');
                    
                    toUpdate = true;
                    

                    $('#btn_save_product').html('Update');
                    $('#txt_title').html('Update Product');
                    unsavedChanges = true;
                    hasValues = true;

                },
                error: function () {

                }
            });
        }
    }
};

    thisProduct.update = () => {
        const regex = /^[a-zA-Z0-9-'.' ]+$/;
        const buying_price = $('#txt_buying_price').val();
        const selling_price = $('#txt_selling_price').val();
        const lot_num = $('#txt_lot_number').val();
        const quantity = $('#txt_quantity').val();
        const manufature_date = $('#txt_manufature_date').val();
        const expiraton_date = $('#txt_expiraton_date').val();
        const location = $('#txt_location').val();
        const type = $('#slc_type').val();

        if(buying_price == ""
        || lot_num == ""
        || selling_price == ""
        || location == ""
        || quantity == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please fill out all fields',
                showConfirmButton: true,
            })
        }
        else if (!regex.test(location)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid Location Name',
                text: 'Only letters, numbers, hyphen, and period are allowed.',
                showConfirmButton: true,
            });
        }
        else if (location.trim() === "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Empty Location Name',
                text: 'Please fill out the location field.',
                showConfirmButton: true,
            });
        }
        else if (buying_price >= selling_price){
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Buying price should be lower than Selling price',
                showConfirmButton: true,
            })
        }
        else {
            console.log("Location:", location);
            $.ajax({
                type: "POST",
                url: PRODUCT_CONTROLLER + '?action=updateProductDetails',
                dataType: "json",
                data:{
                    product_id: product_id,
                    product_details_id: product_details_id,
                    selling_price: selling_price,
                    buying_price: buying_price,
                    lot_num: lot_num,
                    quantity: quantity,
                    manufature_date: manufature_date,
                    expiraton_date: expiraton_date,
                    location: location,
                    type: type,
                },
                success: function (response){ 
                    if (response.message && response.message === 'No changes made') {
                        unsavedChanges = false;
                        hasValues = false
                        Swal.fire({
                            position: 'center',
                            icon: 'info',
                            title: 'No changes have been made',
                            showConfirmButton: true,
                        });
                    } else {
                        unsavedChanges = false;
                        hasValues = false
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Product updated successfully',
                        showConfirmButton: true,
                    })

                    $('#txt_product_barcode').val("");
                    $('#txt_product_name').val("");
                    $('#slc_product_category').val("");
                    $('#txt_lot_number').val("");
                    $('#txt_buying_price').val("");
                    $('#txt_selling_price').val("");
                    $('#txt_manufature_date').val("");
                    $('#txt_expiraton_date').val("");
                    $('#slc_status').val("");
                    $('#txt_quantity').val("");
                    $('#slc_type').val("");
                    $('#txt_location').val("");

                    $('.form-control').prop("disabled", false);

                    $('#txt_product_name').prop( "disabled", true );
                    $('#slc_product_category').prop( "disabled", true );
                    console.log("Location field enabled");
                    $('#txt_location').prop( "disabled", false );
                    $('#txt_location').removeClass('red-input');

                    $('#txt_title').html('Register Product');
                    $('#btn_save_product').html('Register');
                    thisProduct.loadTableData();
                    
                    }
                },
                error: function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error!',
                        showConfirmButton: true,
                    })
                }
            });
        }
        
    }

    thisProduct.resetFields = () => {
        console.log('Current value of unsavedChanges:', unsavedChanges);
        toUpdate = false;

                    if (unsavedChanges || hasValues) {
                        showLeaveConfirmation().then((result) => {
                            if (result.isConfirmed) {
                                toUpdate = false;


                    $('#txt_product_barcode').val("");
                    $('#txt_product_name').val("");
                    $('#slc_product_category').val("");
                    $('#txt_lot_number').val("");
                    $('#txt_buying_price').val("");
                    $('#txt_selling_price').val("");
                    $('#txt_manufature_date').val("");
                    $('#txt_expiraton_date').val("");
                    $('#slc_status').val("");
                    $('#txt_quantity').val("");
                    $('#slc_type').val("");
                    $('#txt_location').val("");

                    $('.form-control').prop("disabled", false);

                    $('#txt_product_name').prop( "disabled", true );
                    $('#slc_product_category').prop( "disabled", true );
                    // $('#txt_location').prop( "disabled", true );
                    $('#txt_location').removeClass('red-input');
                    $('#txt_title').html('Register Product');
                    $('#btn_save_product').html('Register');
                    unsavedChanges = false;
                    hasValues = false
                            }
                        });
                } else {
                toUpdate = false;
                $('#txt_product_barcode').val("");
                $('#txt_product_name').val("");
                $('#slc_product_category').val("");
                $('#txt_lot_number').val("");
                $('#txt_buying_price').val("");
                $('#txt_selling_price').val("");
                $('#txt_manufature_date').val("");
                $('#txt_expiraton_date').val("");
                $('#slc_status').val("");
                $('#txt_quantity').val("");
                $('#slc_type').val("");
                $('#txt_location').val("");

                $('.form-control').prop("disabled", false);

                $('#txt_product_name').prop( "disabled", true );
                $('#slc_product_category').prop( "disabled", true );
                // $('#txt_location').prop( "disabled", true );
                $('#txt_location').removeClass('red-input');

                $('#btn_save_product').html('Register');
                unsavedChanges = false;
                hasValues = false
                }
            };

        thisProduct.resetFormFields = () => {
        toUpdate = false;
        $('#txt_product_barcode').val("");
        $('#txt_product_name').val("");
        $('#slc_product_category').val("");
        $('#txt_lot_number').val("");
        $('#txt_buying_price').val("");
        $('#txt_selling_price').val("");
        $('#txt_manufature_date').val("");
        $('#txt_expiraton_date').val("");
        $('#slc_status').val("");
        $('#txt_quantity').val("");
        $('#slc_type').val("");
        $('#txt_location').val("");

        $('.form-control').prop("disabled", false);

        $('#txt_product_name').prop( "disabled", true );
        $('#slc_product_category').prop( "disabled", true );
        // $('#txt_location').prop( "disabled", true );
        $('#txt_location').removeClass('red-input');

        $('#btn_save_product').html('Update');
        unsavedChanges = false;
    }


    thisProduct.limitCharacterInput = (input, maxLength) => {
        if (input.value.length > maxLength) {
            input.value = input.value.slice(0, maxLength);
          }
    }


    thisProduct.onChangeBarcode = () => {
        const product_barcode = $('#txt_product_barcode').val();
        $.ajax({
            type:'GET',
            url: PRODUCT_CONTROLLER + `?action=getAvailableProductByBarcode&barcode=${product_barcode}`,
            dataType: 'json',
            cache:false,
            success: (response) => {               
                if(response.length > 0){
                    
                    $('#txt_product_name').val(response[0].product_name);
                    $('#txt_product_name').prop( "disabled", true );
                    $('#slc_product_category').val(response[0].category_id);
                    $('#slc_product_category').prop( "disabled", true );
                    $('#txt_buying_price').val(response[0].buy_price);
                    $('#txt_selling_price').val(response[0].sale_price);
                    $('#slc_status').val(response[0].status);
                    $('#slc_status').prop( "disabled", true );
                    $('#slc_type').val(response[0].type);
                    $('#slc_type').prop( "disabled", true );
                }
                else{
                    $('#txt_product_name').val("");
                    $('#slc_product_category').val("");
                    $('#txt_buying_price').val("");
                    $('#txt_selling_price').val("");
                    $('#txt_manufature_date').val("");
                    $('#txt_expiraton_date').val("");
                    $('#slc_status').val("");
                    $('#txt_quantity').val("");
                    $('#slc_type').val("");

                    $('.form-control').prop("disabled", false);
                }
            }
        })
    }

   

    return thisProduct;
})();

window.onload = function(){
    document.getElementById("txt_product_barcode").focus();
}

const validateProductName = () => {
    //Only accepts A-Z (uppercase and lowercase), digits (0-9), single quotation, hyphen, and period
    const regex = /^[a-zA-Z0-9-'.' ]+$/;
    const productname = $('#txt_product_name').val().trim();
    const pname = document.getElementById('pname');
    const txtProductName = $('#txt_product_name');

    txtProductName.removeClass('red-input green-input');
    pname.innerHTML = "";

    if (productname === '') {
        txtProductName.removeClass('red-input green-input');
        pname.innerHTML = "";
    } else if (!regex.test(productname)) {
        txtProductName.addClass('red-input').removeClass('green-input');
        // pname.innerHTML = "First name contains invalid characters.";
        pname.style.color = 'red';
    } else {
        txtProductName.removeClass('red-input');
        pname.style.color = 'green';
        pname.innerHTML = "";
    }
}

const validateLocationName = () => {
    //Only accepts A-Z (uppercase and lowercase), digits (0-9), single quotation, hyphen, and period
    const regex = /^[a-zA-Z0-9-'.' ]+$/;
    const locationname = $('#txt_location').val().trim();
    const lname = document.getElementById('pname');
    const txtLocationName = $('#txt_location');

    txtLocationName.removeClass('red-input green-input');
    lname.innerHTML = "";

    if (locationname === '') {
        txtLocationName.removeClass('red-input green-input');
        lname.innerHTML = "";
    } else if (!regex.test(locationname)) {
        txtLocationName.addClass('red-input').removeClass('green-input');
        // pname.innerHTML = "First name contains invalid characters.";
        lname.style.color = 'red';
    } else {
        txtLocationName.removeClass('red-input');
        lname.style.color = 'green';
        lname.innerHTML = "";
    }
}
// Disable manual typing for manufacturing date
$('#txt_manufature_date').on('keydown paste', function (e) {
    e.preventDefault();
});
$('#txt_manufature_date').on('focus', function () {
    $(this).blur();
});

// Disable manual typing for expiration date
$('#txt_expiraton_date').on('keydown paste', function (e) {
    e.preventDefault();
});
$('#txt_expiraton_date').on('focus', function () {
    $(this).blur();
});