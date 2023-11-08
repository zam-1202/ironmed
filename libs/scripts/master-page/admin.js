$(document).ready(function () {

    Admin.loadTableData();

    $('.btn').click(function (event) {
        event.preventDefault()
    })
});


const Admin = (() => {
    const thisAdmin = {};

    let user_id = '';
    let toUpdate = false;

    thisAdmin.loadTableData = () => {
        $.ajax({
            type: "GET",
            url: USER_CONTROLLER + '?action=getTableData',
            dataType: "json",
            success: function (response) {
                $('.table').DataTable().destroy();
                
                $('#tbody_users').html(response);

                $('.table').DataTable();
            },
            error: function () {

            }
        });
    }

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
                                    $('#txt_email').removeClass('green-input');
                                    $('#txt_adminnewpassword').removeClass('green-input');
                                    $('#txt_adminconfirm_password').removeClass('green-input');
                                    $('#txt_adminnewpassword').removeClass('red-input');
                                    $('#txt_adminconfirm_password').removeClass('red-input');
                                    document.getElementById('confirmPass').innerHTML = "";


                                    thisAdmin.resetFields();
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
        
    thisAdmin.clickSaveSessionButton= () => {
        const hours = $('#hours_value').val();
        const minutes = $('#minute_value').val();
        const seconds = $('#seconds_value').val();
            
            if (hours === '' || minutes === '' || seconds === '') {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Please enter both hours, minutes, and seconds',
                    showConfirmButton: true,
                });
                return; // Exit the function if the input fields are empty.
            }
          
            $.ajax({
                type: "POST",
                url: USER_CONTROLLER + '?action=save_session', // Adjust the URL to the correct path
                dataType: "json",
                data:{
                  hours: hours,
                  minutes: minutes,
                  seconds: seconds
                },
                success: function (response) {
                    // console.log('Response:', response);
                        console.log('It was successful');
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Session saved successfully',
                            showConfirmButton: true,
                        });
                },
                error: function (error) {
                    console.log(error);
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Error: An error occurred while saving the session',
                        showConfirmButton: true,
                    });
                }
            });
          }
    

    thisAdmin.clickUpdate = (id) => {
        user_id = id;
    
        $.ajax({
            type: "POST",
            url: USER_CONTROLLER + '?action=getById',
            dataType: "json",
            data: {
                user_id: user_id
            },
            success: function (response) {
                $('#txt_first_name').val(response.first_name);
                $('#txt_last_name').val(response.last_name);
                $('#txt_user_name').val(response.username);
                $('#txt_email').val(response.email);
                $('#txt_adminnewpassword').prop("disabled", true);
                $('#txt_adminconfirm_password').prop("disabled", true);
                $('#slc_role').val(response.role);
                
                // Enable the "Deactivate" option in the dropdown
                $('#slc_status option[value="0"]').removeAttr('disabled');
                $('#slc_status').val(response.status);
    
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
                document.getElementById('message').innerHTML = "";
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
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Account updated successfully',
                                        showConfirmButton: true,
                                    })

                                    $('#txt_adminnewpassword').val("");
                                    $('#txt_adminconfirm_password').val("");
                                    $('#txt_first_name').removeClass('green-input');
                                    $('#txt_last_name').removeClass('green-input');
                                    $('#txt_user_name').removeClass('green-input');
                                    $('#txt_email').removeClass('green-input');
                                    $('#txt_adminnewpassword').removeClass('green-input');
                                    $('#txt_adminconfirm_password').removeClass('green-input');
                                    $('#txt_adminnewpassword').removeClass('red-input');
                                    $('#txt_adminconfirm_password').removeClass('red-input');
                                    document.getElementById('confirmPass').innerHTML = "";

                                    thisAdmin.resetFields();
                                    thisAdmin.loadTableData();
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
                thisAdmin.resetFields();
                thisAdmin.loadTableData();
            },
            error: function () {

            }
        }); 
    }


    thisAdmin.resetFields = () => {
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
        $('#txt_first_name').removeClass('green-input');
        $('#txt_last_name').removeClass('green-input');
        $('#txt_user_name').removeClass('green-input');
        $('#txt_email').removeClass('green-input');
        $('#txt_adminnewpassword').removeClass('green-input');
        $('#txt_adminconfirm_password').removeClass('green-input');
        $('#txt_adminnewpassword').removeClass('red-input');
        $('#txt_adminconfirm_password').removeClass('red-input');
        document.getElementById('confirmPass').innerHTML = "";

    }

    thisAdmin.validateUsername = () => {
        const username = $('#txt_user_name').val();
        
        if (username != '') {
            $.ajax({
                type: "POST",
                url: USER_CONTROLLER + '?action=isUsernameTaken',
                data: {
                    username: username,
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

$("#live_search").on("input", function() {
    const searchTerm = $(this).val();
    searchUsers(searchTerm);
});


function searchUsers(searchTerm) {
    $.ajax({
        type: "GET",
        url: USER_CONTROLLER + '?action=searchUsers',
        data: { searchTerm: searchTerm },
        dataType: "json",
        success: function (response) {
            if (response.length > 0) {
                $('#tbody_users').html(response);
            } else {
                $('#tbody_users').html('<tr><td colspan="8" class="text-center">No matching records</td></tr>');
            }
            $('.table').DataTable();
        },
        error: function () {
            // Handle errors
        }
    });
}

