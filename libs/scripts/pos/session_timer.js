let sessionTimeoutEnabled = true;
const localStorageKey = 'sessionTimeoutEnabled'; // Key used to store and retrieve from local storage
let timeout;


function startTimer() {
  timeout = setTimeout(logoutUser, 1800000); // 30 minutes
  }

  function logoutUser() {
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
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = (Swal.getTimerLeft()/ 1000)
            .toFixed(0)
          }, 100)
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
              Swal.fire({
                title: 'Session Timeout',
                text: 'Your session has expired due to inactivity.',
                html: 'Please log in again to continue.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
              });
              setTimeout(() => {
                window.location.href = "../../views/master-page/login.php";
              }, 10000); // Redirect after 10 seconds
            },
            error: function () {
              Swal.fire({
                title: 'Session Timeout',
                text: 'Your session has expired due to inactivity.',
                html: 'Please log in again to continue.',
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
              });
              setTimeout(() => {
                window.location.href = "../../views/master-page/login.php";
              }, 5000); // Redirect after 5 seconds
            }
          });
        }
      });
    }
  }

        startTimer();

          document.addEventListener("mousemove", function() {
          if (sessionTimeoutEnabled)
          clearTimeout(timeout);
          startTimer();
          });

          document.addEventListener("keypress", function() {
          if (sessionTimeoutEnabled) 
          clearTimeout(timeout);
          startTimer();
          });

          function resetSessionTimeout() {
              clearTimeout(timeout);
              startTimer();
          }

  function toggleSessionTimeout() {
      sessionTimeoutEnabled = !sessionTimeoutEnabled;
      console.log('Session timeout enabled: ' + sessionTimeoutEnabled);
      if (sessionTimeoutEnabled) {
      resetSessionTimeout();
      console.log('Session timeout has been enabled.');
      } else {
      clearTimeout(timeout);
      console.log('Session timeout has been disabled.');
      }
          // Store the toggle state in local storage
    localStorage.setItem(localStorageKey, sessionTimeoutEnabled);
  }

  // const toggle = document.getElementById('toggle');
  document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.getElementById('toggle');
  
    // Retrieve the toggle state from local storage on page load
    const storedValue = localStorage.getItem(localStorageKey);
    if (storedValue !== null) {
      sessionTimeoutEnabled = JSON.parse(storedValue);
      toggle.checked = sessionTimeoutEnabled;
    }
  
    // toggle.addEventListener('change', function() {
    //   toggleSessionTimeout();
    //   // your JavaScript function goes here
    //   console.log('Toggle is ' + (this.checked ? 'on' : 'off'));
    // });
  
    if (sessionTimeoutEnabled) {
      startTimer(); // Start the session timeout by default
    } else {
      console.log('Session timeout is currently disabled.');
    }
  });