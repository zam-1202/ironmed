$(document).ready(function () {
    $('.btn').click(function (event) {
        event.preventDefault()
    })
});

const btnUpdatePassword = document.querySelector('#btn_save');
let fieldcheck = 0;



    
const ChangePassword = (() => {
    const thisChangePassword = {};

    thisChangePassword.isValidPasswordFormat = () => {
        const dboldpass = $('#old_password').val();
        const oldpass = $('#txt_oldpassword').val();
        const adminnewpassword = $('#txt_newpassword').val();
        const adminconfirm_password = $('#txt_confirm_password').val();

        console.log("Old Password:", oldpass);
        console.log("New Password:", adminnewpassword);

        if (oldpass.trim() === '') {
            $('#txt_oldpassword').removeClass('red-input green-input');
            document.getElementById('oldp').innerHTML=" ";
            // btnUpdatePassword.disabled = true;
        } else if(dboldpass != oldpass) {
            $('#txt_oldpassword').removeClass('green-input').addClass('red-input');
            document.getElementById('oldp').innerHTML="Incorrect current password";
            document.getElementById('oldp').style.color = 'red';
            // return thisChangePassword.validateOldPassword();
        } else {
            $('#txt_oldpassword').removeClass('red-input')
            $('#txt_oldpassword').addClass('green-input')
            document.getElementById('oldp').innerHTML="";
            document.getElementById('oldp').style.color = 'green';
        } 
    
        if (adminnewpassword.trim() === '') {
            // Handle the case where 'adminnewpassword' is empty
            $('#txt_newpassword').removeClass('green-input red-input');
            document.getElementById('mess').innerHTML = "";
            if (adminconfirm_password.trim() === '') {
                // Handle the case where both fields are empty
                $('#txt_confirm_password').removeClass('red-input green-input');
                document.getElementById('confirmPass').innerHTML = "";
            } else {
                // Case 4: Fill out the first password field
                $('#txt_confirm_password').removeClass('green-input').addClass('red-input');
                // $('#oldp').removeClass('green-input').addClass('red-input');
                document.getElementById('confirmPass').innerHTML = "Fill out the first password field";
                document.getElementById('confirmPass').style.color = 'red';
            }
        } else if (adminnewpassword === oldpass) {
            $('#txt_newpassword').removeClass('green-input').addClass('red-input');
            $('#txt_oldpassword').removeClass('green-input').addClass('red-input');
            document.getElementById('mess').innerHTML = "Old and new passwords should not match";
            document.getElementById('mess').style.color = 'red';
        } else if (!isValidPasswordFormat(adminnewpassword)) {
            // Case 1: Password format is incorrect
            $('#txt_newpassword').removeClass('green-input').addClass('red-input');
            document.getElementById('mess').innerHTML = "Password format is incorrect";
            document.getElementById('mess').style.color = 'red';
            $('#txt_confirm_password').removeClass('red-input green-input');
            document.getElementById('confirmPass').innerHTML = "";
        } else {
            // Case 2: Password format is correct
            $('#txt_newpassword').removeClass('red-input').addClass('green-input');
            document.getElementById('mess').innerHTML = "";
            document.getElementById('mess').style.color = 'green';
        }
            if (adminconfirm_password.trim() === '') {
                // Handle the case where 'adminconfirm_password' is empty
                $('#txt_confirm_password').removeClass('red-input green-input');
                document.getElementById('confirmPass').innerHTML = "";
            } else if (adminnewpassword.trim() === '') {
                $('#txt_confirm_password').removeClass('green-input').addClass('red-input');
                // $('#oldp').removeClass('green-input').addClass('red-input');
                document.getElementById('confirmPass').innerHTML = "Fill out the first password field";
                document.getElementById('confirmPass').style.color = 'red';
            } else if (adminnewpassword !== adminconfirm_password) {
                // Case 5: Password doesn't match
                $('#txt_confirm_password').removeClass('green-input').addClass('red-input');
                document.getElementById('mess').innerHTML = "";
                document.getElementById('confirmPass').innerHTML = "Password doesn't match";
                document.getElementById('confirmPass').style.color = 'red';
            } else if (!isValidPasswordFormat(adminconfirm_password)) {
                // Case 3: Password format is incorrect for confirmation
                $('#txt_confirm_password').removeClass('green-input').addClass('red-input');
                document.getElementById('confirmPass').innerHTML = "Password format is incorrect";
                document.getElementById('confirmPass').style.color = 'red';
            } else {
                // Case 6: Password matches
                $('#txt_confirm_password').removeClass('red-input').addClass('green-input');
                document.getElementById('confirmPass').innerHTML = "Passwords matched";
                document.getElementById('confirmPass').style.color = 'green';
            }
       
    }
    
    function isValidPasswordFormat(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/.test(password); // Include underscore
        const hasNumber = /\d/.test(password);
        const isLongEnough = password.length >= 8;
    
        return hasUppercase && hasLowercase && hasSpecialChar && hasNumber && isLongEnough;
    }


    // thisChangePassword.validateNewPass = () => {
    //     const hasUppercase = /[A-Z]/g;
    //     const hasLowercase = /[a-z]/g;
    //     const hasNumber = /[0-9]/g;
    //     const regex_symbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g;
    //     const newpassword = $('#txt_newpassword').val();
    //     const oldpass = $('#txt_oldpassword').val();
    //     const dboldpass = $('#old_password').val();
    
    //     if (newpassword == dboldpass) {
    //         $('#txt_newpassword').addClass('red-input');
    //         document.getElementById('mess').innerHTML = "Old and new password shouldn't be the same";
    //         document.getElementById('mess').style.color = 'red';
    //         btnUpdatePassword.disabled = true;
    //     } else if (newpassword.trim() === '') {
    //         $('#txt_newpassword').removeClass('red-input green-input'); // Remove any custom classes
    //         document.getElementById('mess').innerHTML = ""; // Clear the error message
    //         btnUpdatePassword.disabled = true;
    
    //     } else if (newpassword.length < 8 || !newpassword.match(hasUppercase) || !newpassword.match(hasLowercase) || !newpassword.match(hasNumber) || !newpassword.match(regex_symbols)) {
    //         $('#txt_newpassword').removeClass('green-input').addClass('red-input');
    //         document.getElementById('mess').style.color = 'red';
    //         document.getElementById('mess').innerHTML = "Password format is incorrect";
    //         btnUpdatePassword.disabled = true;
    //     } else {
    //         btnUpdatePassword.disabled = false;
    //         $('#txt_newpassword').removeClass('red-input').addClass('green-input');
    //         document.getElementById('mess').style.color = 'green';
    //         document.getElementById('mess').innerHTML = "";
    //     }
    // }
    

    thisChangePassword.confirm = () => {
        let passcheck = 0;
        const dboldpass = $('#old_password').val();
        const oldpass = $('#txt_oldpassword').val();
        const newpassword = $('#txt_newpassword').val();
        const confirm_password = $('#txt_confirm_password').val();
        console.log(dboldpass);



            
        if(oldpass == "" || confirm_password == ""|| newpassword=="") {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Please fill out all fields',
                showConfirmButton: true,
            })

        }
        else if(dboldpass != oldpass) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Old Password is incorrect',
                showConfirmButton: true,
            })

        }
        else if(newpassword == oldpass) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Old and new passwords cannot be the same',
                showConfirmButton: true,
            })

        }  
        else if(newpassword != confirm_password) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Passwords do not match',
                showConfirmButton: true,
            })

        }
        else {
            $.ajax({
                type: "POST",
                url: USER_CONTROLLER + '?action=changePassword',
                dataType: "json",
                data:{
                    password: confirm_password,
                },
                success: function (response) 
                {
                    passcheck = 0;
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Password changed successfully',
                        text: 'You will promptly be logged out to try your new password',
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {
                        if(result.isConfirmed) {
                            window.location.href = "../../views/master-page/login.php";
                        }
                    });
                    $('#txt_oldpassword').val("");
                    $('#txt_newpassword').val("");
                    $('#txt_confirm_password').val("");
                    $('#txt_oldpassword').removeClass('green-input');
                    $('#txt_oldpassword').removeClass('red-input');
                    $('#txt_newpassword').removeClass('green-input');
                    $('#txt_confirm_password').removeClass('green-input');
                    $('#txt_newpassword').removeClass('red-input');
                    $('#txt_confirm_password').removeClass('red-input');
                    document.getElementById('oldp').innerHTML = "";
                    document.getElementById('mess').innerHTML = "";
                    document.getElementById('confirmPass').innerHTML = "";

                    thisChangePassword.resetFields();
                    thisChangePassword.loadTableData();
                },
                error: function () {
                    Swal.fire({
                        title: "Error",
                        text: "Failed to make the request to the server.",
                        icon: "error"
                    });
                }
            });
        }
    }

    return thisChangePassword;
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