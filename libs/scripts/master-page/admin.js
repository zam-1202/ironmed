$(document).ready(function () {

    Admin.loadTableData();

    $('.btn').click(function (event) {
        event.preventDefault()
    })
});

var unsavedChanges = false;
var hasValues = false;

var initialFieldValues = {};

$(':input').each(function () {
    initialFieldValues[this.id] = $(this).val();
});


$(document).on('input', ':input:not(.dataTables_filter input):not([aria-controls^="DataTables_Table_"]):not([name="userTable_length"]):not([aria-controls="userTable"])', function () {
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

const Admin = (() => {
    const thisAdmin = {};

    let user_id = '';
    let toUpdate = false;


    var tableConfig = {
        paging: true,
        searching: true,
        ordering: true,
        search: {
            regex: true,
        },
    };

    thisAdmin.loadTableData = () => {
        $.ajax({
            type: "GET",
            url: USER_CONTROLLER + '?action=getTableData',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().clear().destroy();
                $('#tbody_users').html(response);
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
                // Handle error
            }
        });
    };
    
    
    thisAdmin.clickSaveButton= () => {
        if(!toUpdate) {
            thisAdmin.save()
        }
        else {
            thisAdmin.update()
        }
        
    };
    
    function isValidAdminPasswordFormat(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/.test(password); // Include underscore
        const hasNumber = /\d/.test(password);
        const isLongEnough = password.length >= 8;
    
        return hasUppercase && hasLowercase && hasSpecialChar && hasNumber && isLongEnough;
    }
    
    thisAdmin.save = () => {
        const specialCharsRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
        const numbersRegex = /\d/;
        const first_name = $('#txt_first_name').val().trim();
        const last_name = $('#txt_last_name').val().trim();
        const username = $('#txt_user_name').val();
        const email = $('#txt_email').val();
        const newpassword = $('#txt_adminnewpassword').val();
        const confirm_password = $('#txt_adminconfirm_password').val();
        const role = $('#slc_role').val();
        const status = $('#slc_status').val();
        const registerButton = $('#registerButton');
    
        if (first_name === "" || /^\s+$/.test(first_name) || last_name === "" || /^\s+$/.test(last_name) || username === "" || email === "" || newpassword === "" || confirm_password === "" || role == null || status == null) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please fill out all fields',
                showConfirmButton: true,
            });
            // Disable the register button
            registerButton.prop('disabled', true);
        } else if (!first_name || /[ ]{2,}/.test(first_name)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid first name',
                    showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (/  /.test(first_name) || first_name.startsWith(' ') || first_name.endsWith(' ')) {
            txtFirstName.addClass('red-input').removeClass('green-input');
            mes.innerHTML = "First name contains multiple spaces";
            mes.style.color = 'red';
            btnUpdatePassword.disabled = true;
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (specialCharsRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (numbersRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
            } else if (!first_name || /[ ]{2,}/.test(first_name)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid first name',
                    showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (/  /.test(first_name) || first_name.startsWith(' ') || first_name.endsWith(' ')) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (specialCharsRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (numbersRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);

            
        //This VALIDATION is for last name


        } else if (!last_name || /[ ]{2,}/.test(last_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid last name',
                showConfirmButton: true,
        });
        registerButton.prop('disabled', true);
        } else if (/  /.test(last_name) || last_name.startsWith(' ') || last_name.endsWith(' ')) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (specialCharsRegex.test(last_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (numbersRegex.test(last_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
            } else if (!last_name || /[ ]{2,}/.test(last_name)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid first name',
                    showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
            } else if (!validateEmail(email)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid email address',
                    showConfirmButton: true,
                });
                // Disable the register button
                registerButton.prop('disabled', true);
            } else if (newpassword != confirm_password) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Passwords did not match',
                    showConfirmButton: true,
                });
                // Disable the register button
                registerButton.prop('disabled', true);
            } else if (!isValidAdminPasswordFormat(newpassword)) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Password format is incorrect',
                        showConfirmButton: true,
                    });
                    registerButton.prop('disabled', true);
            } else {
                // Check if the username is taken
                $.ajax({
                    type: "POST",
                    url: USER_CONTROLLER + '?action=isUsernameTaken', // Add the action for checking username
                    data: {
                        excludeUserId: user_id,
                        username: username
                    },
                    success: function (response) {
                        if (response === "1") {
                            // Username is already taken
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Username is already taken',
                                showConfirmButton: true,
                            });
                        } else {
                            // Username is available, proceed with registration
                            // Enable the register button
                            registerButton.prop('disabled', false);
                            $.ajax({
                                type: "POST",
                                url: USER_CONTROLLER + '?action=save',
                                dataType: "json",
                                data: {
                                    first_name: first_name,
                                    last_name: last_name,
                                    username: username,
                                    email: email,
                                    password: newpassword,
                                    role: role,
                                    status: status,
                                },
                                success: function (response) {
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Account created successfully',
                                        showConfirmButton: true,
                                    });

                                    $('#txt_adminnewpassword').val("");
                                    $('#txt_adminconfirm_password').val("");
                                    $('#txt_first_name').removeClass('green-input');
                                    $('#txt_last_name').removeClass('green-input');
                                    $('#txt_user_name').removeClass('green-input');
                                    $('#txt_user_name').removeClass('red-input');
                                    $('#txt_email').removeClass('green-input');
                                    $('#txt_email').removeClass('red-input');
                                    $('#txt_adminnewpassword').removeClass('green-input');
                                    $('#txt_adminconfirm_password').removeClass('green-input');
                                    $('#txt_adminnewpassword').removeClass('red-input');
                                    $('#txt_adminconfirm_password').removeClass('red-input');
                                    document.getElementById('confirmPass').innerHTML = "";


                                    thisAdmin.resetFormFields();
                                    thisAdmin.loadTableData();
                                },
                                error: function () {
                                    // Handle error
                                }
                            });
                        }
                    },
                    error: function () {
                        // Handle error
                    }
                });
            }
        }
        
    
    thisAdmin.clickUpdate = (id) => {
        user_id = id;
        unsavedChanges = true;
        hasValues = true;
        $.ajax({
            type: "POST",
            url: USER_CONTROLLER + '?action=getById',
            dataType: "json",
            data: {
                user_id: user_id
            },
            success: function (response) {
                originalFirstName = response.name;
                $('#txt_first_name').val(response.first_name);
                originalLastName = response.name;
                $('#txt_last_name').val(response.last_name);
                originalUsername = response.name;
                $('#txt_user_name').val(response.username);
                originalEmail = response.name;
                $('#txt_email').val(response.email);
                originalRole = response.name;
                $('#slc_role').val(response.role);
                
                // Enable the "Deactivate" option in the dropdown
                originalStatus = response.name;
                $('#slc_status option[value="0"]').removeAttr('disabled');
                $('#slc_status').val(response.status);
    
                $('#txt_adminnewpassword').hide();
                $('#txt_adminconfirm_password').hide();
                $('#txt_adminnewpasswordlabel').hide();
                $('#txt_adminconfirm_passwordlabel').hide();
                $('#passwordRequirements').hide();
                $('#passwordRequired').hide();
                $('#confirmPasswordRequired').hide();
                
                $('#txt_adminnewpassword-toggle').hide();
                $('#txt_adminconfirm_password-toggle').hide();

                toUpdate = true;
    
                $('#btn_save').html("Update Account");
                $('#lbl_title').html("Update Account");

                // Reset the classes and message
                document.getElementById('confirmPass').innerHTML = "";
                document.getElementById('adminmess').innerHTML = "";
                $('#txt_first_name').removeClass('green-input');
                $('#txt_first_name').removeClass('red-input');
                document.getElementById('mes').innerHTML = "";
                $('#txt_last_name').removeClass('green-input');
                $('#txt_last_name').removeClass('red-input');
                document.getElementById('mesi').innerHTML = "";
                $('#txt_user_name').removeClass('green-input');
                $('#txt_user_name').removeClass('red-input');
                document.getElementById('emailmessage').innerHTML = "";
                $('#txt_email').removeClass('green-input');
                $('#txt_email').removeClass('red-input');
                document.getElementById('message').innerHTML = "";
                $('#txt_adminnewpassword').removeClass('green-input');
                $('#txt_adminnewpassword').removeClass('red-input');
                $('#txt_adminconfirm_password').removeClass('green-input');
                $('#txt_adminconfirm_password').removeClass('red-input');
                $('#txt_adminnewpassword').val("");
                $('#txt_adminconfirm_password').val("");
            },
            error: function () {
    
            }
        });
    }
    
    thisAdmin.update = () => {
        const specialCharsRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
        const numbersRegex = /\d/;
        let first_name = $('#txt_first_name').val().trim();
        let last_name = $('#txt_last_name').val().trim();
        let username = $('#txt_user_name').val();
        let email = $('#txt_email').val();
        let newpassword = $('#txt_adminnewpassword').val();
        let confirm_password = $('#txt_adminconfirm_password').val();
        let role = $('#slc_role').val();
        let status = $('#slc_status').val();
        let registerButton = $('#registerButton');


        if (first_name === "" || /^\s+$/.test(first_name) || last_name === "" || /^\s+$/.test(last_name) || username === "" || email === "" || role == null || status == null) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please fill out all fields',
                showConfirmButton: true,
            });
            // Disable the register button
            registerButton.prop('disabled', true);
        } else if (!first_name || /[ ]{2,}/.test(first_name)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid first name',
                    showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (/  /.test(first_name) || first_name.startsWith(' ') || first_name.endsWith(' ')) {
            txtFirstName.addClass('red-input').removeClass('green-input');
            mes.innerHTML = "First name contains multiple spaces";
            mes.style.color = 'red';
            btnUpdatePassword.disabled = true;
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (specialCharsRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (numbersRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
            } else if (!first_name || /[ ]{2,}/.test(first_name)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid first name',
                    showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (/  /.test(first_name) || first_name.startsWith(' ') || first_name.endsWith(' ')) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (specialCharsRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (numbersRegex.test(first_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);

            
        //This VALIDATION is for last name


        } else if (!last_name || /[ ]{2,}/.test(last_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid last name',
                showConfirmButton: true,
        });
        registerButton.prop('disabled', true);
        } else if (/  /.test(last_name) || last_name.startsWith(' ') || last_name.endsWith(' ')) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (specialCharsRegex.test(last_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
        } else if (numbersRegex.test(last_name)) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please enter a valid name',
                showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
            } else if (!last_name || /[ ]{2,}/.test(last_name)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid first name',
                    showConfirmButton: true,
            });
            registerButton.prop('disabled', true);
            } else if (!validateEmail(email)) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter a valid email address',
                    showConfirmButton: true,
                });
                // Disable the register button
                registerButton.prop('disabled', true);
            } else {
                // Check if the username is taken
                $.ajax({
                    type: "POST",
                    url: USER_CONTROLLER + '?action=isUsernameTaken', // Add the action for checking username
                    data: {
                        excludeUserId: user_id,
                        username: username
                    },
                    success: function (response) {
                        if (response === "1") {
                            // Username is already taken
                            Swal.fire({
                                position: 'center',
                                icon: 'error',
                                title: 'Username is already taken',
                                showConfirmButton: true,
                            });
                        } else {
                            registerButton.prop('disabled', false);
                            $.ajax({
                                type: "POST",
                                url: USER_CONTROLLER + '?action=update',
                                dataType: "json",
                                data: {
                                    user_id: user_id,
                                    first_name: first_name,
                                    last_name: last_name,
                                    username: username,
                                    email: email,    
                                    role: role,
                                    status: status,
                                },
                                success: function (response) {
                                    if (response.message && response.message === 'No changes made') {
                                        thisAdmin.loadTableData();
                                        thisAdmin.resetFormFields();
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
                                            title: 'Account updated successfully',
                                            showConfirmButton: true,
                                        });
                                
                                    unsavedChanges = true;

                                    $('#txt_adminnewpassword').val("");
                                    $('#txt_adminconfirm_password').val("");
                                    $('#txt_first_name').removeClass('green-input');
                                    $('#txt_last_name').removeClass('green-input');
                                    $('#txt_user_name').removeClass('green-input');
                                    $('#txt_user_name').removeClass('red-input');
                                    $('#txt_email').removeClass('green-input');
                                    $('#txt_email').removeClass('red-input');
                                    $('#txt_adminnewpassword').removeClass('green-input');
                                    $('#txt_adminconfirm_password').removeClass('green-input');
                                    $('#txt_adminnewpassword').removeClass('red-input');
                                    $('#txt_adminconfirm_password').removeClass('red-input');
                                    document.getElementById('confirmPass').innerHTML = "";

                                    thisAdmin.resetFormFields();
                                    thisAdmin.loadTableData();
                                    }
                                },
                                error: function () {
                                }
                            });
                        }
                    }
                });
            }
        };

    thisAdmin.clickResetPassword = (id) => {
        user_id = id;

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Update to Default Password!',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                thisAdmin.resetPassword();
            }
        })
    }

    thisAdmin.resetPassword = () => {

        $.ajax({
            type: "POST",
            url: USER_CONTROLLER + '?action=resetPassword',
            dataType: "json",
            data:{
                user_id: user_id
            },
            success: function (response) 
            {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Password Reset Successfully ',
                    showConfirmButton: false,
                    timer: 1500
                })
                thisAdmin.resetFormFields();
                thisAdmin.loadTableData();
            },
            error: function () {

            }
        }); 
    }

    thisAdmin.resetFields = () => {
        console.log('Current value of unsavedChanges:', unsavedChanges);

        if (unsavedChanges || hasValues) {
            showLeaveConfirmation().then((result) => {
                if (result.isConfirmed) {
                    toUpdate = false;
                    $('#txt_first_name').val("");
                    $('#txt_last_name').val("");
                    $('#txt_user_name').val("");
                    $('#txt_email').val("");
                    $('#txt_adminnewpassword').val("");
                    $('#txt_adminconfirm_password').val("");
                    $('#slc_role').val("");
                    $('#slc_status').val("");
            
                    $('.form-control').prop("disabled", false);
            
                    $('#btn_save').html("Create Account");
                    $('#lbl_title').html("Create Account");
            
                    $('#txt_adminnewpassword').val("");
                    $('#txt_adminconfirm_password').val("");
                    $('#txt_adminnewpassword').show();
                    $('#txt_adminconfirm_password').show();
            
                    $('label[for="adminnewpassword"]').show();
                    $('label[for="adminconfirmPassword"]').show();
                    $('label[for="adminnewpassword"]').nextAll('span, p').show();
                    $('label[for="adminconfirmPassword"]').next('span').show();
            
                    $('#txt_adminnewpassword-toggle').show();
                    $('#txt_adminconfirm_password-toggle').show();
            
                    $('#slc_status option[value="0"]').prop('disabled', true);
                    
                    $('#txt_first_name').removeClass('green-input');
                    $('#txt_first_name').removeClass('red-input');
                    document.getElementById('mes').innerHTML = "";
                    $('#txt_last_name').removeClass('green-input');
                    $('#txt_last_name').removeClass('red-input');
                    document.getElementById('mesi').innerHTML = "";
                    $('#txt_user_name').removeClass('green-input');
                    $('#txt_user_name').removeClass('red-input');
                    $('#txt_email').removeClass('green-input');
                    $('#txt_email').removeClass('red-input');
                    $('#txt_adminnewpassword').removeClass('green-input');
                    $('#txt_adminconfirm_password').removeClass('green-input');
                    $('#txt_adminnewpassword').removeClass('red-input');
                    $('#txt_adminconfirm_password').removeClass('red-input');
                    document.getElementById('adminmess').innerHTML = "";
                    document.getElementById('confirmPass').innerHTML = "";
                    unsavedChanges = false;
                    hasValues = false
                }
            });
        } else {
            toUpdate = false;
            $('#txt_first_name').val("");
            $('#txt_last_name').val("");
            $('#txt_user_name').val("");
            $('#txt_email').val("");
            $('#txt_adminnewpassword').val("");
            $('#txt_adminconfirm_password').val("");
            $('#slc_role').val("");
            $('#slc_status').val("");
    
            $('.form-control').prop("disabled", false);
    
            $('#btn_save').html("Create Account");
            $('#lbl_title').html("Create Account");
    
            $('#txt_adminnewpassword').val("");
            $('#txt_adminconfirm_password').val("");
            $('#txt_adminnewpassword').show();
            $('#txt_adminconfirm_password').show();
    
            $('label[for="adminnewpassword"]').show();
            $('label[for="adminconfirmPassword"]').show();
            $('label[for="adminnewpassword"]').nextAll('span, p').show();
            $('label[for="adminconfirmPassword"]').next('span').show();
    
            $('#txt_adminnewpassword-toggle').show();
            $('#txt_adminconfirm_password-toggle').show();
    
            $('#slc_status option[value="0"]').prop('disabled', true);
            
            $('#txt_first_name').removeClass('green-input');
            $('#txt_first_name').removeClass('red-input');
            document.getElementById('mes').innerHTML = "";
            $('#txt_last_name').removeClass('green-input');
            $('#txt_last_name').removeClass('red-input');
            document.getElementById('mesi').innerHTML = "";
            $('#txt_user_name').removeClass('green-input');
            $('#txt_user_name').removeClass('red-input');
            $('#txt_email').removeClass('green-input');
            $('#txt_email').removeClass('red-input');
            $('#txt_adminnewpassword').removeClass('green-input');
            $('#txt_adminconfirm_password').removeClass('green-input');
            $('#txt_adminnewpassword').removeClass('red-input');
            $('#txt_adminconfirm_password').removeClass('red-input');
            document.getElementById('adminmess').innerHTML = "";
            document.getElementById('confirmPass').innerHTML = "";
            unsavedChanges = false;
            hasValues = false
        }
    };


    thisAdmin.resetFormFields = () => {
        toUpdate = false;
        $('#txt_first_name').val("");
        $('#txt_last_name').val("");
        $('#txt_user_name').val("");
        $('#txt_email').val("");
        $('#txt_adminnewpassword').val("");
        $('#txt_adminconfirm_password').val("");
        $('#slc_role').val("");
        // $('#slc_status').val("");

        $('.form-control').prop("disabled", false);

        $('#btn_save').html("Create Account");
        $('#lbl_title').html("Create Account");

        $('#txt_adminnewpassword').val("");
        $('#txt_adminconfirm_password').val("");
        $('#txt_adminnewpassword').show();
        $('#txt_adminconfirm_password').show();

        $('label[for="adminnewpassword"]').show();
        $('label[for="adminconfirmPassword"]').show();
        $('label[for="adminnewpassword"]').nextAll('span, p').show();
        $('label[for="adminconfirmPassword"]').next('span').show();

        $('#txt_adminnewpassword-toggle').show();
        $('#txt_adminconfirm_password-toggle').show();

        $('#slc_status option[value="0"]').prop('disabled', true);
        
        $('#txt_first_name').removeClass('green-input');
        $('#txt_first_name').removeClass('red-input');
        document.getElementById('mes').innerHTML = "";
        $('#txt_last_name').removeClass('green-input');
        $('#txt_last_name').removeClass('red-input');
        document.getElementById('mesi').innerHTML = "";
        $('#txt_user_name').removeClass('green-input');
        $('#txt_user_name').removeClass('red-input');
        $('#txt_email').removeClass('green-input');
        $('#txt_email').removeClass('red-input');
        $('#txt_adminnewpassword').removeClass('green-input');
        $('#txt_adminconfirm_password').removeClass('green-input');
        $('#txt_adminnewpassword').removeClass('red-input');
        $('#txt_adminconfirm_password').removeClass('red-input');
        document.getElementById('adminmess').innerHTML = "";
        document.getElementById('confirmPass').innerHTML = "";

        unsavedChanges = false;
    }

    thisAdmin.validateUsername = () => {
        const username = $('#txt_user_name').val();
        
        if (username != '') {
            $.ajax({
                type: "POST",
                url: USER_CONTROLLER + '?action=isUsernameTaken',
                data: {
                    username: username,
                    excludeUserId: user_id
                },
                success: function (response) {
                    console.log("Received Response:", response);
                    if (response == 1) {
                        // $('#message').text('Username already taken');
                        $('#txt_user_name').addClass('red-input').removeClass('green-input');
                    } else if (response == 0) {
                        // $('#message').text('Username is available');
                        $('#txt_user_name').addClass('green-input').removeClass('red-input');
                    } else {
                        $('#message').text('Error. Please contact the IT department.');
                    }
                }
            });
        } else {
            $('#message').text(''); // Clear the message if the input is empty
            $('#txt_user_name').removeClass('red-input green-input');
        }
    }
        
    

    return thisAdmin;
})();

function togglePasswordVisibility(inputId) {
    var toggleButton = document.getElementById(inputId + "-toggle");
    var passwordInput = document.getElementById(inputId);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "HIDE";
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "SHOW";
    }
}