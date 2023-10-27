$(document).ready(function () {
    $('.btn').click(function (event) {
        event.preventDefault()
    })
});

const btnUpdatePassword = document.querySelector('#btn_save');
let fieldcheck = 0;


// const validateUserName = () => {
//     const regex = /^[a-zA-Z1-9-'.' ]+$/;
//     const username = $('#txt_user_name').val();

//     if (username.trim() === '') {
//         $('#txt_user_name').removeClass('red-input green-input');
//         document.getElementById('message').innerHTML = "";
//         btnUpdatePassword.disabled = true;
//     }
//     else if (!regex.test(username)) {
//         $('#txt_user_name').addClass('red-input').removeClass('green-input');
//         document.getElementById('message').innerHTML = "Username contains invalid characters.";
//         document.getElementById('message').style.color = 'red';
//         btnUpdatePassword.disabled = true;
//     }
//     else {
//         $('#txt_user_name').removeClass('red-input').removeClass('green-input');
//         document.getElementById('message').style.color = 'green';
//         document.getElementById('message').innerHTML = "";
//         btnUpdatePassword.disabled = false;
//     }
// }


const validateEmail = () => {
    const email = $('#txt_email').val();
    const emailField = $('#txt_email');
    const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    if (email.trim() === '') {
        emailField.removeClass('red-input');
        return false;
    } else if (!email.match(emailPattern)) {
        emailField.addClass('red-input');
        return false;
    } else {
        emailField.removeClass('red-input');
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
        document.getElementById('mess').innerHTML = "Invalid password format";
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
        
        if(dboldpass != oldpass) {
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

    thisChangePassword.validateConfirmPassword = () => {
        const newpassword = $('#txt_newpassword').val();
        const confirm_password = $('#txt_confirm_password').val();
        
        if(newpassword != confirm_password) {
            $('#txt_confirm_password').removeClass('green-input')
            $('#txt_confirm_password').addClass('red-input')
            document.getElementById('confirmPass').innerHTML="";
            document.getElementById('confirmPass').style.color = 'red';
        }else if (confirm_password.trim() === '') {
            $('#txt_confirm_password').removeClass('red-input green-input'); // Remove any custom classes
            document.getElementById('confirmPass').innerHTML = ""; // Clear the error message
            btnUpdatePassword.disabled = true;
    
        } 
        
        
        else {
            $('#txt_confirm_password').addClass('green-input')
            $('#txt_confirm_password').addClass('red-input')
            document.getElementById('confirmPass').innerHTML=" ";
        }
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
                title: 'Please fillout all fields',
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


