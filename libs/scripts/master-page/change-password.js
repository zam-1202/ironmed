$(document).ready(function () {
    $('.btn').click(function (event) {
        event.preventDefault()
    })
});

const btnUpdatePassword = document.querySelector('#btn_save');
let fieldcheck = 0;

const validateFirstName = () => {
    // const regex = /^[a-zA-Z1-9-'.'']+$/;
    const specialCharsRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
    const numbersRegex = /\d/;
    const firstname = $('#txt_first_name').val().trim();
    const mes = document.getElementById('mes');
    const btnUpdatePassword = document.getElementById('btnUpdatePassword');
    const txtFirstName = $('#txt_first_name');

    txtFirstName.removeClass('red-input green-input');
    mes.innerHTML = "";

    if (firstname === '') {
        txtFirstName.removeClass('red-input green-input');
        mes.innerHTML = "";
        btnUpdatePassword.disabled = true;
    } else if (/  /.test(firstname) || firstname.startsWith(' ') || firstname.endsWith(' ')) {
        txtFirstName.addClass('red-input').removeClass('green-input');
        mes.innerHTML = "First name contains multiple spaces";
        mes.style.color = 'red';
        btnUpdatePassword.disabled = true;
    } else if (specialCharsRegex.test(firstname)) {
        // Special characters detected
        txtFirstName.addClass('red-input').removeClass('green-input');
        mes.innerHTML = "First name should not contain special characters";
        mes.style.color = 'red';
        btnUpdatePassword.disabled = true;
    } else if (numbersRegex.test(firstname)) {
        // Numbers detected
        txtFirstName.addClass('red-input').removeClass('green-input');
        mes.innerHTML = "First name should not contain numbers";
        mes.style.color = 'red';
        btnUpdatePassword.disabled = true;
    } else {
        txtFirstName.removeClass('red-input').addClass('green-input');
        mes.style.color = 'green';
        mes.innerHTML = "";
        btnUpdatePassword.disabled = false;
    }
}



 
const validateLastName = () => {
    // const regex = /^[a-zA-Z1-9-'.'']+$/;
    const specialCharsRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;
    const numbersRegex = /\d/;
    const lastname = $('#txt_last_name').val().trim();
    const mesi = document.getElementById('mesi');
    const btnUpdatePassword = document.getElementById('btnUpdatePassword');
    const txtLastName = $('#txt_last_name');

    txtLastName.removeClass('red-input green-input');
    mesi.innerHTML = "";

    if (lastname === '') {
        txtLastName.removeClass('red-input green-input');
        mesi.innerHTML = "";
        btnUpdatePassword.disabled = true;
    } else if (/  /.test(lastname) || lastname.startsWith(' ') || lastname.endsWith(' ')) {
        txtLastName.addClass('red-input').removeClass('green-input');
        mesi.innerHTML = "Last name contains multiple spaces";
        mesi.style.color = 'red';
        btnUpdatePassword.disabled = true;
    } else if (specialCharsRegex.test(lastname)) {
        // Special characters detected
        txtLastName.addClass('red-input').removeClass('green-input');
        mesi.innerHTML = "Last name should not contain special characters";
        mesi.style.color = 'red';
        btnUpdatePassword.disabled = true;
    } else if (numbersRegex.test(lastname)) {
        // Numbers detected
        txtLastName.addClass('red-input').removeClass('green-input');
        mesi.innerHTML = "Last name should not contain numbers";
        mesi.style.color = 'red';
        btnUpdatePassword.disabled = true;
    } else {
        txtLastName.removeClass('red-input').addClass('green-input');
        mesi.style.color = 'green';
        mesi.innerHTML = "";
        btnUpdatePassword.disabled = false;
    }
}
 

const validateEmail = () => {
    const email = $('#txt_email').val();
    const emailField = $('#txt_email');
    const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    if (email.trim() === '') {
        emailField.removeClass('red-input green-input');
        return false;
    } else if (!email.match(emailPattern)) {
        emailField.addClass('red-input').removeClass('green-input');
        return false;
    } else {
        emailField.removeClass('red-input').addClass('green-input');
        return true;
    }
}



const validateNewPass = () => {
    const upperCaseLetters = /[A-Z]/g;
    const lowerCaseLetters = /[a-z]/g;
    const numbers = /[0-9]/g;
    const regex_symbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g;
    const newpassword = $('#txt_newpassword').val();
    const oldpass = $('#txt_oldpassword').val();
    const dboldpass = $('#old_password').val();

    if (newpassword == dboldpass) {
        $('#txt_newpassword').addClass('red-input');
        document.getElementById('mess').innerHTML = "Old and new password shouldn't be the same";
        document.getElementById('mess').style.color = 'red';
        btnUpdatePassword.disabled = true;
    } else if (newpassword.trim() === '') {
        $('#txt_newpassword').removeClass('red-input green-input'); // Remove any custom classes
        document.getElementById('mess').innerHTML = ""; // Clear the error message
        btnUpdatePassword.disabled = true;

    } else if (newpassword.length < 8 || !newpassword.match(upperCaseLetters) || !newpassword.match(lowerCaseLetters) || !newpassword.match(numbers) || !newpassword.match(regex_symbols)) {
        $('#txt_newpassword').removeClass('green-input').addClass('red-input');
        document.getElementById('mess').style.color = 'red';
        document.getElementById('mess').innerHTML = "Password format is incorrect";
        btnUpdatePassword.disabled = true;
    } else {
        btnUpdatePassword.disabled = false;
        $('#txt_newpassword').removeClass('red-input').addClass('green-input');
        document.getElementById('mess').style.color = 'green';
        document.getElementById('mess').innerHTML = "";
    }
}


const ChangePassword = (() => {
    const thisChangePassword = {};

    thisChangePassword.validateOldPassword = () => {
        const dboldpass = $('#old_password').val();
        const oldpass = $('#txt_oldpassword').val();
        // console.log(dboldpass);

        if (oldpass.trim() === '') {
            $('#txt_oldpassword').removeClass('red-input green-input');
            document.getElementById('oldp').innerHTML=" ";
            btnUpdatePassword.disabled = true;
            return false;}
        else if(dboldpass != oldpass) {
            $('#txt_oldpassword').removeClass('green-input')
            $('#txt_oldpassword').addClass('red-input')
            document.getElementById('oldp').innerHTML="Incorrect current password";
            document.getElementById('oldp').style.color = 'red';
            // return thisChangePassword.validateOldPassword();
        } else {
            $('#txt_oldpassword').removeClass('red-input')
            $('#txt_oldpassword').addClass('green-input')
            document.getElementById('oldp').innerHTML=" ";
        } 
            
    }

    thisChangePassword.validateAdminConfirmPassword = () => {
        const adminnewpassword = $('#txt_adminnewpassword').val();
        const adminconfirm_password = $('#txt_adminconfirm_password').val();
    
        if (adminnewpassword.trim() === '') {
            // Handle the case where 'adminnewpassword' is empty
            $('#txt_adminnewpassword').removeClass('green-input red-input');
            document.getElementById('adminmess').innerHTML = "";
            if (adminconfirm_password.trim() === '') {
                // Handle the case where both fields are empty
                $('#txt_adminconfirm_password').removeClass('red-input green-input');
                document.getElementById('confirmPass').innerHTML = "";
            } else {
                // Case 4: Fill out the first password field
                $('#txt_adminconfirm_password').removeClass('green-input').addClass('red-input');
                document.getElementById('confirmPass').innerHTML = "Fill out the first password field";
                document.getElementById('confirmPass').style.color = 'red';
            }
        } else if (!isValidAdminPasswordFormat(adminnewpassword)) {
            // Case 1: Password format is incorrect
            $('#txt_adminnewpassword').removeClass('green-input').addClass('red-input');
            document.getElementById('adminmess').innerHTML = "Password format is incorrect";
            document.getElementById('adminmess').style.color = 'red';
            $('#txt_adminconfirm_password').removeClass('red-input green-input');
            document.getElementById('confirmPass').innerHTML = "";
        } else {
            // Case 2: Password format is correct
            $('#txt_adminnewpassword').removeClass('red-input').addClass('green-input');
            document.getElementById('adminmess').innerHTML = "";
            document.getElementById('adminmess').style.color = 'green';
    
            if (adminconfirm_password.trim() === '') {
                // Handle the case where 'adminconfirm_password' is empty
                $('#txt_adminconfirm_password').removeClass('red-input green-input');
                document.getElementById('confirmPass').innerHTML = "";
            } else if (adminnewpassword !== adminconfirm_password) {
                // Case 5: Password doesn't match
                $('#txt_adminconfirm_password').removeClass('green-input').addClass('red-input');
                document.getElementById('adminmess').innerHTML = "";
                document.getElementById('confirmPass').innerHTML = "Password doesn't match";
                document.getElementById('confirmPass').style.color = 'red';
            } else if (!isValidAdminPasswordFormat(adminconfirm_password)) {
                // Case 3: Password format is incorrect for confirmation
                $('#txt_adminconfirm_password').removeClass('green-input').addClass('red-input');
                document.getElementById('confirmPass').innerHTML = "Password format is incorrect";
                document.getElementById('confirmPass').style.color = 'red';
            } else {
                // Case 6: Password matches
                $('#txt_adminconfirm_password').removeClass('red-input').addClass('green-input');
                document.getElementById('confirmPass').innerHTML = "Passwords matched";
                document.getElementById('confirmPass').style.color = 'green';
            }
        }
    }
    
    function isValidAdminPasswordFormat(password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialChar = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/.test(password); // Include underscore
        const hasNumber = /\d/.test(password);
        const isLongEnough = password.length >= 8;
    
        return hasUppercase && hasLowercase && hasSpecialChar && hasNumber && isLongEnough;
    }
    

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
                title: 'Old and new password is the same',
                showConfirmButton: true,
            })

        }  
        else if(newpassword != confirm_password) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Password Did not match',
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
                        showConfirmButton: true,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then((result) => {
                        if(result.isConfirmed) {
                            window.location.href = 'http://localhost/pos/views/master-page/login.php';
                        }
                    });
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