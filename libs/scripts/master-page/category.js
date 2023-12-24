$(document).ready(function () {
    Category.loadTableData();
    Category.loadSelectData();


    $('.btn').click(function (event){
        event.preventDefault()
    })
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
        const regex = /^[a-zA-Z0-9&\-'\.\s–]+$/;
        const category_name = $('#txt_category_name').val();

        if(category_name == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please input Category Name',
                showConfirmButton: true,
            })
        } else if (!regex.test(category_name)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid Category Name',
                text: 'Only letters, numbers, hyphen, ampersand, and period are allowed.',
                showConfirmButton: true,
            });
        }
        else if (category_name.trim() === "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Empty Category Name',
                text: 'Please fill out the category field.',
                showConfirmButton: true,
            });
        }
        else {
            $.ajax({
                type: "POST",
                url: CATEGORY_CONTROLLER + '?action=checkCategoryExists',
                dataType: "json",
                data:{
                    category_name: category_name
                },
                success: function (exists) {
                    if (exists) {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'Category name already exists',
                            showConfirmButton: true,
                        });
                    } else {
                        $.ajax({
                            type: "POST",
                            url: CATEGORY_CONTROLLER + '?action=save',
                            dataType: "json",
                            data: {
                                category_name: category_name
                            },
                            success: function (response) {
                                $('#txt_category_name').val("");
                                thisCategory.loadTableData();
                                thisCategory.loadSelectData();
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Category Registered Successfully',
                                    showConfirmButton: true,
                                });
    
                                $('#txt_category_name').removeClass('green-input');
                            },
                            error: function () {
    
                            }
                        });
                    }
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
                $('#txt_category').html('Update Category');
                $('#txt_category_name').removeClass('green-input');
                $('#txt_category_name').removeClass('red-input');
            },
            error: function () {

            }
        });
    }

    thisCategory.update = () => {
        const regex = /^[a-zA-Z0-9&\-'\.\s–]+$/;
        const category_name = $('#txt_category_name').val();
                

        if(category_name == "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Category field should have value',
                showConfirmButton: true,
            })
        }
        else if (!regex.test(category_name)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Invalid Category Name',
                text: 'Only letters, numbers, hyphen, ampersand, and period are allowed.',
                showConfirmButton: true,
            });
        }
        else if (category_name.trim() === "") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Empty Category Name',
                text: 'Please fill out the category field.',
                showConfirmButton: true,
            });
        }
        else{
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
                if (response.message && response.message === 'No changes made') {
                    $('#txt_category_name').val("")
                    $('#btn_save_category').html('Register Category');
                    thisCategory.loadTableData();
                    thisCategory.loadSelectData();
                    Swal.fire({
                        position: 'center',
                        icon: 'info',
                        title: 'No changes have been made',
                        showConfirmButton: true,
                    });
                } else {
                    $('#txt_category_name').val("")
                    thisCategory.loadTableData();
                    thisCategory.loadSelectData();
                    $('#btn_save_category').html('Register Category');
                    toUpdate = false;
                    $('#txt_category_name').removeClass('green-input');
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Category updated successfully',
                        showConfirmButton: true,
                    })
                }
            },
                error: function () {
    
                }
            });

        }
 
    }

    thisCategory.clickCancel = () => {
        $('#txt_category_name').val("")
        toUpdate = false;
        $('#btn_save_category').html('Register Category');
        validateCategoryName();
    }

    // thisCategory.clickDelete = (id) => {
    //     category_id = id

    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You will not be able to revert this action",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes!',
    //         cancelButtonText: 'No'
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             thisCategory.delete();
    //         }
    //     })
    // }

    // thisCategory.delete = () => {
    //     $.ajax({
    //         type: "POST",
    //         url: CATEGORY_CONTROLLER + '?action=delete',
    //         dataType: "json",
    //         data:{
    //             category_id: category_id
    //         },
    //         success: function (response) 
    //         {
    //             Swal.fire({
    //                 position: 'center',
    //                 icon: 'success',
    //                 title: 'Category Deleted Successfully ',
    //                 showConfirmButton: false,
    //                 timer: 1500
    //             })
    //             thisCategory.loadTableData();
    //             thisCategory.loadSelectData();
    //         },
    //         error: function () {

    //         }
    //     });
    // }

    return thisCategory;
})()

const validateCategoryName = () => {

    const inputElement = document.getElementById('txt_category_name');
    // inputElement.value = inputElement.value.toUpperCase();


    //Only accepts A-Z (uppercase and lowercase), digits (0-9), single quotation, hyphen, and period
    const regex = /^[a-zA-Z0-9&\-'\.\s–]+$/;
    const categoryname = $('#txt_category_name').val().trim();
    const cname = document.getElementById('cname');
    const txtCategorynameName = $('#txt_category_name');

    txtCategorynameName.removeClass('red-input green-input');
    cname.innerHTML = "";

    if (categoryname === '') {
        txtCategorynameName.removeClass('red-input green-input');
        cname.innerHTML = "";
    } else if (!regex.test(categoryname)) {
        txtCategorynameName.addClass('red-input').removeClass('green-input');
        // pname.innerHTML = "First name contains invalid characters.";
        cname.style.color = 'red';
    } else {
        txtCategorynameName.removeClass('red-input').addClass('green-input');;
        cname.style.color = 'green';
        cname.innerHTML = "";
    }
}