$(document).ready(function () {
  $('.btn').click(function (event) {
    event.preventDefault();
  });

  // Timer to handle session timeout
  let timeout;
  let sessionTimeoutEnabled = true;
  const localStorageKey = 'sessionTimeoutEnabled';

  // Function to handle session timeout
  function handleSessionTimeout() {
    console.log('handleSessionTimeout called');

    if (sessionTimeoutEnabled) {
      Swal.fire({
        title: "Are you still there?",
        text: "You will be logged out in 2 seconds.",
        html: 'I will close in <b></b> seconds.',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Stay Logged In",
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: "Log Out",
        reverseButtons: true,
        timer: 10000,
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
        } else {
          $.ajax({
            type: "POST",
            url: LOGIN_CONTROLLER + '?action=logout',
            dataType: "json",
            success: function (response) {
              localStorage.setItem('logoutMessage', 'Successfully Logout');
              window.location.href = "../../views/master-page/login.php";
            },
            error: function () {
              // Handle error if needed
            }
          });
        }
      });
    }
  }

  // Timer to handle session timeout
  function startTimer() {
    console.log('startTimer called');
    const hours = parseInt($('#hours_value').val());
    const minutes = parseInt($('#minute_value').val());
    const seconds = parseInt($('#seconds_value').val());

    const timeoutDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;

    timeout = setTimeout(handleSessionTimeout, timeoutDuration);
  }

  // Reset the session timeout
  function resetSessionTimeout() {
    console.log('resetSessionTimeout called');
    clearTimeout(timeout);
    startTimer();
  }

  // Retrieve session timeout settings and initialize the timer
  $.ajax({
    type: "GET",
    url: USER_CONTROLLER + '?action=getSessionTimeoutSettings',
    dataType: "json",
    success: function (response) {
      if (response) {
        $('#hours_value').val(response.hours);
        $('#minute_value').val(response.minutes);
        $('#seconds_value').val(response.seconds);
        // Now that you have retrieved the settings, start the timer here if needed
        startTimer();
      }
    },
    error: function (error) {
      console.log(error);
    }
  });

  // Add an event listener to the "Enable session timeout" checkbox
  $('#enableSessionTimeout').change(function () {
    sessionTimeoutEnabled = this.checked;
    console.log('Session timeout enabled: ' + sessionTimeoutEnabled);
    if (sessionTimeoutEnabled) {
      resetSessionTimeout();
      console.log('Session timeout has been enabled.');
    } else {
      clearTimeout(timeout);
      console.log('Session timeout has been disabled.');
    }
    // Store the toggle state in local storage
    localStorage.setItem('sessionTimeoutEnabled', sessionTimeoutEnabled);
  });

    // Start the timer based on user activity
    startTimer();
    
  // Retrieve the toggle state from local storage on page load
  const storedValue = localStorage.getItem('sessionTimeoutEnabled');
  if (storedValue !== null) {
    sessionTimeoutEnabled = JSON.parse(storedValue);
    $('#enableSessionTimeout').prop('checked', sessionTimeoutEnabled);
  }

  document.addEventListener("mousemove", function () {
    if (sessionTimeoutEnabled) {
      console.log("Mouse moved. Resetting session timeout.");
      clearTimeout(timeout);
      startTimer();
    }
  });

  document.addEventListener("keypress", function () {
    if (sessionTimeoutEnabled) {
      console.log("Keypress detected. Resetting session timeout.");
      clearTimeout(timeout);
      startTimer();
    }
  });


});
