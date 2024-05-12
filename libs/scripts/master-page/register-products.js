$(document).ready(function() {
    Category.loadSelectData();

    Product.loadTableData();
  
    $('.btn').click(function (event){
        event.preventDefault()
    })
});

var unsavedChanges = false;

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

function fileinfo() {
    return Swal.fire({
        icon: 'info',
        title: 'File Guidelines',
        text: 'You can only upload files with the extensions xlsx, xls, and csv',
    });
}

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


const Product = (() => {
    const thisProduct = {};

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
            type: "POST",
            url: PRODUCT_CONTROLLER + "?action=loadTableData",
            dataType: "JSON",
            success: function(response) {
                $('.table').DataTable().destroy();
                $('#productsTable').html(response);
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

                        // console.log('Exact match in DataTable:', exactMatch);
                        // console.log('DataTable values:', table.rows({ search: 'applied' }).data().toArray());
                    });

                });

            },
            error: function () {

            }
        });
    }

    thisProduct.resetFields = () => {
        if (unsavedChanges) {
            showLeaveConfirmation().then((result) => {
                if (result.isConfirmed) {
                    console.log('User confirmed. Resetting fields.');
                    resetFormFields();
                }
            });
        } else {
            console.log('All fields are empty. Resetting fields without confirmation.');
            resetFormFields();
        }
    };

    thisProduct.clickFileInfo = () => {
        fileinfo().then(() => {
            console.log('File info clicked');
        });
    };
    
    

    thisProduct.resetFields = () => {
        console.log('Current value of unsavedChanges:', unsavedChanges);
        if (unsavedChanges) {
            showLeaveConfirmation().then((result) => {
                if (result.isConfirmed) {
                    $('#txt_product_name').val("");
                    $('#txt_product_barcode').val("");
                    $('#slc_product_category').val("");
                    // $('#slc_status').val("");
                    $('#slc_type').val("");
                    $('#txt_product_name').removeClass('red-input');
                    unsavedChanges = false;
                }
            });
        } else {
            $('#txt_product_name').val("");
            $('#txt_product_barcode').val("");
            $('#slc_product_category').val("");
            // $('#slc_status').val("");
            $('#slc_type').val("");
            $('#txt_product_name').removeClass('red-input');
            unsavedChanges = false;
        }
    };
    
        
            thisProduct.resetFormFields = () => {
            console.log('Resetting form fields.');
            $('#txt_product_name').val("");
            $('#txt_product_barcode').val("");
            $('#slc_product_category').val("");
            // $('#slc_status').val("");
            $('#slc_type').val("");
            $('#txt_product_name').removeClass('red-input');
            unsavedChanges = false;
        }



    thisProduct.register = () => {
        const regex = /^[a-zA-Z0-9\-\. ]+$/;
        var txt_product_barcode = $("#txt_product_barcode").val();
        var txt_product_name = $("#txt_product_name").val().trim();
        var slc_product_category = $("#slc_product_category").val();
        var slc_status = $("#slc_status").val();
        var slc_type = $("#slc_type").val();
        var txt_location = $("#txt_location").val();

        if(txt_product_barcode == "" 
        || txt_product_name.trim() === ""
        || slc_product_category == ""
        || slc_type == null
        || slc_status == null
        || txt_location == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please fillout all fields',
                showConfirmButton: true,
            })   
        } else if (!regex.test(txt_product_name)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid Product Name',
                text: 'Only letters, numbers, hyphen, and period are allowed.',
                showConfirmButton: true,
            });
        } else if (txt_product_barcode.trim() === '0' || /^0+$/.test(txt_product_barcode.trim())) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Barcode has no value',
            showConfirmButton: true,
        });
    } else{
            $.ajax({
                type: "POST",
                url: PRODUCT_CONTROLLER + "?action=registerProduct",
                data: {
                    txt_product_barcode: txt_product_barcode,
                    txt_product_name: txt_product_name,
                    slc_product_category: slc_product_category,
                    slc_status: slc_status,
                    slc_type: slc_type,
                    txt_location: txt_location,
                },
                dataType: "JSON",
                success: function(response) {
                    if(response == "Successfully Save") {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Product Succesfully Registered!',
                            showConfirmButton: true,
                        })
                        thisProduct.loadTableData();
                        thisProduct.resetFormFields();
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }     
    };

    thisProduct.importExcelFile = () => {
        var formData = new FormData();
        var fileInput = document.getElementById('fileInput');
        var file = fileInput.files[0];
    
        formData.append('file', file);
    
        $.ajax({
            type: 'POST',
            url: PRODUCT_CONTROLLER + "?action=importExcel",
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                // Handle success response
                console.log('Import successful:', response);
            },
            error: function(xhr, status, error) {
                // Handle error response
                console.error('Error occurred during import:', error);
            }
        });
    }


    // $(document).on('click', '#inputGroupFileAddon04', function() {
    //     importExcelFile();
    // });
    

    return thisProduct;
})();

const Category = (() => {
    const thisCategory = {};

    let category_id = '';

    let toUpdate = false;

    thisCategory.loadTableData = () => {
        $.ajax({
            type: "GET",
            url: CATEGORY_CONTROLLER + '?action=getTableData',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                $('#tbody_category').html(response);

                $('.table').DataTable();
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

    return thisCategory;
})()

const validateProductName = () => {
    //Only accepts A-Z (uppercase and lowercase), digits (0-9), single quotation, hyphen, and period
    const regex = /^[a-zA-Z0-9\-\. ]+$/;
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
