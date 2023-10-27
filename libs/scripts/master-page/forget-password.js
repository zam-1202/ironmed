$(document).ready(function () {
    $('.btn').click(function (event){
        event.preventDefault()
    })   
});


function redirectToForgotPassword() {
    window.location.href = "forget-password.php";
}