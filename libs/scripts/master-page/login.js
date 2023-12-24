$(document).ready(function () {
    $('.btn').click(function (event){
        event.preventDefault()
    })   
});



const Login = (() => {
    const thisLogin = {};

    thisLogin.submit = () => {
        const username = $('#txt_username').val();
        const password = $('#txt_password').val();

        const loginUrl = '../data/controller/LoginController.php';

        $.ajax({
            type: "POST",
            url: LOGIN_CONTROLLER + '?action=verify_login',
            dataType: "json",
            data:{
                username: username,
                password: password,
            },
            success: function (response) 
            {
                if(response == "Validated") {
                    window.location.href = "home.php";
                } 
                else if(username == "" || password == ""){
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Please fill outs all fields',
                        showConfirmButton: true,
                    })
                }
                else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: response,
                        showConfirmButton: false,
                        timer: 5000
                    })
                }
                
            },
            error: function () {

            }
        }); 
    }

    return thisLogin;
})();

const togglePassword = document.querySelector('#togglePassword');
                const password = document.querySelector('#txt_password');
                togglePassword.addEventListener('click', () => {
                // toggle the type attribute
                const type = password.getAttribute('type') === 'password' ?'text' : 'password';
                password.setAttribute('type', type);
                // toggle the eye slash icon
                event.target.classList.toggle('bi-eye');
            });

 // Check for the success message in localStorage
 const logoutMessage = localStorage.getItem('logoutMessage');

 if (logoutMessage) {
     // Display the message using SweetAlert or any other method you prefer
     Swal.fire({
         position: 'center',
         icon: 'success',
         title: "Session Timeout",
         html: 'Your session has expired due to inactivity.<br>Please log in again to continue.',
         text: logoutMessage,
         showConfirmButton: true,
     });

     // Remove the message from localStorage to prevent displaying it again
     localStorage.removeItem('logoutMessage');
 }

            