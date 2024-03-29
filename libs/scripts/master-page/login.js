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
            data: {
                username: username,
                password: password,
            },
            success: function (response) {
                if (response === "Validated") {
                    window.location.href = "home.php";
                } else if (response === "threeAttempts") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Locked due to many attempts',
                        text: 'Contact System admin or use the "Forgot Password".',
                    });
                } else if (response === "locked") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Account is locked',
                    });
                } else if (response === "temporary") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Temporary password has expired',
                        text: 'Contact System admin or use the "Forgot Password"".',
                    });
                } else if (response === "invalid") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Invalid Username or Password',
                    });
                } else if (username === "" || password === "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Please fill out all fields',
                        showConfirmButton: true,
                    });
                } else if (password === "") {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Please fill out all password',
                        showConfirmButton: true,
                    });
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: response,
                        showConfirmButton: false,
                        timer: 5000
                    });
                }
            },
            error: function () {
                // Handle error if needed
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