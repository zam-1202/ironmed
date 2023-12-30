$(document).ready(function () {
    const sendOTPButton = $('#sendOTPButton');

    sendOTPButton.on('click', function (event) {
        event.preventDefault();

        sendOTPButton.prop('disabled', true);

        sendOTP();
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const timerDuration = 600; // 10 minutes
    const timerDisplay = document.getElementById("timer-container");

    if (timerDisplay) {
        // Get the timestamp when the OTP was generated from sessionStorage
        const otpGenerationTime = parseInt(sessionStorage.getItem('otpGenerationTime')) || (new Date().getTime() / 1000);

        // Log the current time and the OTP generation time in seconds in the console
        const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
        console.log("Current Time (Seconds):", currentTimeInSeconds);
        console.log("OTP Generation Time (Seconds):", otpGenerationTime);

        // Calculate the remaining time based on the elapsed time
        const elapsedTime = Math.floor(currentTimeInSeconds - otpGenerationTime);
        const remainingTime = Math.max(timerDuration - elapsedTime, 0);

        // Check if the timer has expired
        if (remainingTime <= 0) {
            console.log('OTP Expired. Resend the OTP if needed.');
        } else {
            // Start the countdown with the calculated remaining time
            startCountdown(remainingTime, timerDisplay);
        }
        } else {
        console.error("Element with ID 'timer-container' not found.");
        }
        });
const resendOTPButton = $('#resendOTPButton');

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
        const otpGenerationTimeInSeconds = Math.floor(new Date().getTime() / 1000);
        sessionStorage.setItem('otpGenerationTime', otpGenerationTimeInSeconds);

        // Log the OTP generation time in seconds in the console
        console.log("OTP Generation Time (Seconds):", otpGenerationTimeInSeconds);
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
                        resendOTPButton.prop('disabled', true);
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
                    startTimer();
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
                            const email = sessionStorage.getItem('verification_email');
                            sendNewOTP(email);
                            startTimer();
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
                } else if (response.error === 'BlankOTP') {
                        Swal.fire({
                        title: 'OTP Required',
                        text: 'Please provide the OTP.',
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

const sendNewOTP = (email) => {
    console.log('Resending OTP for email:', email);

    const otpGenerationTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    sessionStorage.setItem('otpGenerationTime', otpGenerationTimeInSeconds);

    // Log the OTP generation time in seconds in the console
    console.log("OTP Generation Time (Seconds):", otpGenerationTimeInSeconds);

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
                    }
                });
            } else {
                if (response.error === 'FailedToSendOTP') {
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

$(document).ready(function () {
    const resendOTPButton = $('#resendOTPButton');

    resendOTPButton.on('click', function (event) {
        event.preventDefault();

        const email = sessionStorage.getItem('verification_email');
        sendNewOTP(email);
        startTimer();
    });
});


function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    return formattedMinutes + ":" + formattedSeconds;
}



function startCountdown(duration, display) {
    $('#resendOTPButton').prop('disabled', true);

    let startTime = new Date().getTime();
    let remainingTime = duration;

    function updateDisplay() {
        let currentTime = new Date().getTime();
        let elapsedTime = Math.floor((currentTime - startTime) / 1000);

        remainingTime = Math.max(duration - elapsedTime, 0);

        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Check if display is not null before updating textContent
        if (display) {
            display.textContent = minutes + ":" + seconds;
        }
    }

    updateDisplay();

    const intervalId = setInterval(function () {
        if (remainingTime <= 0) {
            clearInterval(intervalId);

            $('#resendOTPButton').prop('disabled', false);

            // Console log when the timer reaches zero
            console.log('OTP Expired. Resend the OTP if needed.');

            // You can add additional logic here for handling the expiration
        } else {
            remainingTime--;
            updateDisplay();
        }
    }, 1000);

    // Store start time and remaining time in session storage
    sessionStorage.setItem('startTime', startTime);
    sessionStorage.setItem('remainingTime', remainingTime);

    // Add event listener to store start time when navigating away or closing the browser
    // window.addEventListener('beforeunload', function () {
    //     sessionStorage.removeItem('remainingTime');
    //     sessionStorage.removeItem('startTime');
    //     console.log("Timer is not running.");
    // });

    // // Check if session storage is still active when navigating to another page
    // window.addEventListener('unload', function () {
    //     const storedStartTime = sessionStorage.getItem('startTime');
    //     const storedRemainingTime = sessionStorage.getItem('remainingTime');
    //     console.log("Stored Start Time:", storedStartTime);
    //     console.log("Stored Remaining Time:", storedRemainingTime);
    // });

    // Return the intervalId to be able to clear it if needed
    return intervalId;
}

function startTimer() {
    const timerDuration = 600; // 10 minutes
    const timerDisplay = document.getElementById("timer-container");

    if (timerDisplay) {

        $('#resendOTPButton').prop('disabled', true);
        
        // Clear any existing interval before starting a new one
        const existingIntervalId = sessionStorage.getItem('intervalId');
        if (existingIntervalId) {
            clearInterval(parseInt(existingIntervalId, 10));
        }

        // Clear existing start time and remaining time from sessionStorage
        sessionStorage.removeItem('startTime');
        sessionStorage.removeItem('remainingTime');

        // Start the countdown and store the intervalId in session storage
        const intervalId = startCountdown(timerDuration, timerDisplay);
        sessionStorage.setItem('intervalId', intervalId.toString());
    } else {
        console.error("Element with ID 'timer-container' not found.");
    }
}

