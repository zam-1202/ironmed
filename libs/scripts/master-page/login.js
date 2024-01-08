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


 const logoutMessage = localStorage.getItem('logoutMessage');
 if (logoutMessage) {
     Swal.fire({
         position: 'center',
         icon: 'success',
         title: "Session Timeout",
         html: 'Your session has expired due to inactivity.<br>Please log in again to continue.',
         text: logoutMessage,
         showConfirmButton: true,
         allowOutsideClick: false,
         allowEscapeKey: false,
     });

     localStorage.removeItem('logoutMessage');
 }

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