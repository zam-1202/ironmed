$(document).ready(function() {
    allowRegister();

    Category.loadSelectData();

    Product.loadTableData();
  
});

const register_Barcode = document.querySelector('.input__barcode');
const register_ProductName = document.querySelector('.input__product__name');
const register_Category = document.querySelector('.input__category');
const register_Status = document.querySelector('.input__status');
const register_Type = document.querySelector('.input__type');
const register_Button = document.querySelector('.btn-register');
let enableCount = 0;

const allowRegister = () => {
    if (enableCount == 4 || enableCount == 5){
        register_Button.disabled=false;
        register_Button.style.backgroundColor="#00d199";
    }
    else{
        register_Button.style.backgroundColor="#808080";
    }
}

register_Barcode.addEventListener('change', (e)=> {
    enableCount++;
    allowRegister();
});

register_ProductName.addEventListener('change', (e)=> {
    enableCount++;
    allowRegister();
});

register_Category.addEventListener('change', (e)=> {
    enableCount++;
    allowRegister();
});

register_Status.addEventListener('change', (e)=> {
    enableCount++;
    allowRegister();
});

register_Type.addEventListener('change', (e)=> {
    enableCount++;
    allowRegister();
});

const Product = (() => {
    const thisProduct = {};

    thisProduct.loadTableData = () => {
        $.ajax({
            type: "POST",
            url: PRODUCT_CONTROLLER + "?action=loadTableData",
            dataType: "JSON",
            success: function(response) {
                $('.table').DataTable().destroy();
                $('#productsTable').html(response);
                $('.table').DataTable();
            },
            error: function(e) {
                console.log(e);
            }
        })
    };

    // thisProduct.addEnabler = () => {
    //     enableCount == 5;
    // }

    thisProduct.register = () => {
        const regex = /^[a-zA-Z1-9&-'.' ]+$/;
        var txt_product_barcode = $("#txt_product_barcode").val();
        var txt_product_name = $("#txt_product_name").val();
        var slc_product_category = $("#slc_product_category").val();
        var slc_status = $("#slc_status").val();
        var slc_type = $("#slc_type").val();
        var txt_location = $("#txt_location").val();

        if(txt_product_barcode == "" 
        || txt_product_name == ""
        || slc_product_category == ""
        || slc_type == null
        || slc_status == null
        || txt_location == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please fill out all fields',
                showConfirmButton: true,
            })
        }
        else if (!regex.test(txt_product_name)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid Product Name',
                text: 'Only letters, numbers, hyphen, ampersand, and period are allowed.',
                showConfirmButton: true,
            });
        }
        else if (txt_product_name.trim() === "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Empty Product Name',
                text: 'Please fill out the product name.',
                showConfirmButton: true,
            });
        }
        else{
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
                        // Clear the input fields after successful registration
                        $("#txt_product_barcode").val('');
                        $("#txt_product_name").val('');
                        $("#slc_product_category").val('');
                        $("#slc_status").val('');
                        $("#slc_type").val('');
                        $("#txt_location").val('');
                        $('#txt_product_name').removeClass('green-input');

                        thisProduct.loadTableData();
                    }
                },
                error: function(e) {
                    console.log(e);
                }
            })
        }     

    };

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

$("#regproduct_search").on("input", function() {
    const searchRegProd = $(this).val();
    searchRegisteredProduct(searchRegProd);
});


function searchRegisteredProduct(searchRegProd) {
    $.ajax({
        type: "GET",
        url: PRODUCT_CONTROLLER + '?action=searchRegisteredProduct',
        data: { searchRegProd: searchRegProd },
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                $('#productsTable').html(response);
            } else {
                $('#productsTable').html('<tr><td colspan="8" class="text-center">No matching records</td></tr>');
            }
            $('.table').DataTable();
        },
        error: function () {
            // Handle errors
        }
    });
}

const validateProductName = () => {
    //Only accepts A-Z (uppercase and lowercase), digits (0-9), single quotation, hyphen, ampersand, and period
    const regex = /^[a-zA-Z1-9&-'.' ]+$/;
    const prname = $('#txt_product_name').val().trim();
    const regname = document.getElementById('regname');
    const txtProductName = $('#txt_product_name');

    txtProductName.removeClass('red-input green-input');
    regname.innerHTML = "";

    if (prname === '') {
        txtProductName.removeClass('red-input green-input');
        regname.innerHTML = "";
    } else if (!regex.test(prname)) {
        txtProductName.addClass('red-input').removeClass('green-input');
        // pname.innerHTML = "First name contains invalid characters.";
        regname.style.color = 'red';
    } else {
        txtProductName.removeClass('red-input').addClass('green-input');;
        regname.style.color = 'green';
        regname.innerHTML = "";
    }
}