  let timeout;
  let sessionTimeoutEnabled = true;
  const localStorageKey = 'sessionTimeoutEnabled';
  let changesSaved = false;


  let idleTimer;

  function handleSessionTimeout() {
    if (sessionTimeoutEnabled) {
        console.log('Session timeout enabled. Starting Swal...');

        const timeoutDuration = (parseInt($('#hours_value').val()) * 3600 +
            parseInt($('#minute_value').val()) * 60 +
            parseInt($('#seconds_value').val())) * 1000;

        Swal.fire({
            title: "Your session will expire soon.",
            html: 'I will close in <b></b> seconds.',
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Stay Logged In",
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: "Log Out",
            reverseButtons: true,
            timer: timeoutDuration,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                const b = Swal.getHtmlContainer().querySelector('b');
                timerInterval = setInterval(() => {
                    b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
                }, 100);
            },
        }).then((result) => {
            if (result.isConfirmed) {
                clearTimeout(timeout);
                startTimer();
            } else if (result.dismiss === Swal.DismissReason.timer) {
                $.ajax({
                    type: "POST",
                    url: LOGIN_CONTROLLER + '?action=logout',
                    dataType: "json",
                    success: function (response) {
                        localStorage.setItem('logoutMessage', 'Successfully Logout');
                        window.location.href = "../../views/master-page/login.php";
                    },
                    error: function () {
                        console.log('Error initiating logout.');
                    }
                });
            } else {
                $.ajax({
                    type: "POST",
                    url: LOGIN_CONTROLLER + '?action=logout',
                    dataType: "json",
                    success: function (response) {
                        window.location.href = "../../views/master-page/login.php";
                    },
                    error: function () {

                    }
                });
            }
        });
    }
}

  

  document.addEventListener("mousemove", function() {
    if (sessionTimeoutEnabled) {
      clearTimeout(timeout);
      startTimer();
    }
  });
  
  document.addEventListener("keypress", function() {
    if (sessionTimeoutEnabled) {
      clearTimeout(timeout);
      startTimer();
    }
  });
  

function resetSessionTimeout() {
        clearTimeout(timeout);
        startTimer();
    }


    $('#enableSessionTimeout').change(function () {
    sessionTimeoutEnabled = this.checked;
    console.log('Toggle is ' + (this.checked ? 'on' : 'off'));
        if (sessionTimeoutEnabled) {
            startTimer();
        } else {
            clearTimeout(timeout);
        }
            localStorage.setItem(localStorageKey, JSON.stringify(sessionTimeoutEnabled));
        });


        $.ajax({
        type: "GET",
        url: USER_CONTROLLER + '?action=getSessionTimeoutSettings',
        dataType: "json",
        success: function (response) {
            console.log('Session timeout settings received:', response);
            if (response) {
            localStorage.setItem('sessionTimeoutSettings', JSON.stringify(response));
            $('#hours_value').val(response.hours);
            $('#minute_value').val(response.minutes);
            $('#seconds_value').val(response.seconds);

            // Reset the timer when the values are changed
            $('#hours_value, #minute_value, #seconds_value').on('input', function () {
                resetSessionTimeout();
            });

            // Now that you have retrieved the settings, start the timer here
            startTimer();
            }
        },
        error: function (error) {
            console.log('Error retrieving session timeout settings:', error);
        }
        });


    $(document).ready(function () {
    const storedValue = localStorage.getItem(localStorageKey);
    if (storedValue !== null) {
        sessionTimeoutEnabled = JSON.parse(storedValue);
        $('#enableSessionTimeout').prop('checked', sessionTimeoutEnabled);
    }
    });


  function startTimer() {
    console.log('startTimer called');
    
    clearTimeout(timeout);
    
    if (sessionTimeoutEnabled) {
      const hours = parseInt($('#hours_value').val());
      const minutes = parseInt($('#minute_value').val());
      const seconds = parseInt($('#seconds_value').val());
  
      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        const timeoutDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
  
        // Check if the duration is greater than 0 before setting the timer
        if (timeoutDuration > 0) {
          timeout = setTimeout(handleSessionTimeout, timeoutDuration);
        }
      }
    }
  }
  
  function clickSaveSessionButton() {
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
