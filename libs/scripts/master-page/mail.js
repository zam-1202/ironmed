$(document).ready(function () {
    const sendOTPButton = $('#sendOTPButton');

    sendOTPButton.on('click', function (event) {
        event.preventDefault();

        sendOTPButton.prop('disabled', true);

        sendOTP();
    });
});

const sendOTP = () => {
    const email = $('#txt_email').val();
    sessionStorage.setItem('verification_email', email);

    if (email.trim() === '') {

        enableSendOTPButton();

        Swal.fire({
            title: 'Email Required',
            text: 'Please provide your email address.',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    } else {
    $.ajax({
        url: MAIL_CONTROLLER + '?action=sendOTP',
        method: 'POST',
        data: { email: email },
        dataType: 'json',
        success: function (response) {
            if (response.success) {
                Swal.fire({
                    title: 'OTP Sent!',
                    text: 'Please check your email for the one-time password.',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('Email in sessionStorage:', sessionStorage.getItem('verification_email'));
                        window.location.href = 'verify-otp.php';
                    }
                });
            } else {
                if (response.error === 'EmailNotExists') {
                    enableSendOTPButton();
                    Swal.fire({
                        title: 'Email Not Found',
                        text: 'The provided email does not exist in database. Please check your email and try again.',
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                    });
                } else if (response.error === 'FailedToSendOTP') {
                    enableSendOTPButton();
                    Swal.fire({
                        title: 'Failed to send OTP',
                        text: 'Please try again.',
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                    });
                }
            }
        },
            error: function () {
                enableSendOTPButton();
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred during the request.',
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
            }
        });
    }
}

const enableSendOTPButton = () => {
    $('#sendOTPButton').prop('disabled', false);
}

$(document).ready(function () {
    const verifyOTPButton = $('#verifyOTPButton');

    verifyOTPButton.on('click', function (event) {
        event.preventDefault();
        verifyOTP();
    });
});


const verifyOTP = () => {
    const enteredOTP = $('#txt_otp').val();
    const email = sessionStorage.getItem('verification_email');
    console.log('Data:', { email: email, enteredOTP: enteredOTP });

    $.ajax({
        url: MAIL_CONTROLLER + '?action=verifyOTP',
        method: 'POST',
        data: { email: email, enteredOTP: enteredOTP },
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if (response.success) {
                Swal.fire({
                    title: 'OTP Verified!',
                    text: 'Your OTP has been successfully verified.',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'change-forgottenpassword.php';
                    }
                });
            } else {
                if (response.error === 'OTPExpired') {
                    Swal.fire({
                        title: 'OTP is Expired',
                        text: 'Generate a new one.',
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = 'forget-password.php';
                            }
                        });
                } else if (response.error === 'InvalidOTP') {
                    Swal.fire({
                        title: 'Invalid OTP',
                        text: 'Please check your email and try again.',
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                    });
                } else {
                    Swal.fire({
                        title: 'Unexpected Error',
                        text: 'An unexpected error occurred.',
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#d33',
                        confirmButtonText: 'OK'
                    });
                }
            }
        },
        error: function () {
            Swal.fire({
                title: 'Error',
                text: 'An error occurred during the request.',
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    });
};
