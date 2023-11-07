$(document).ready(function () {
  $('.btn').click(function (event) {
      event.preventDefault();
  });

  // Fetch the session timeout values (hours and minutes) from the user's session
  const hours = <?php echo isset($_SESSION['user']['hours']) ? $_SESSION['user']['hours'] : 0; ?>;
  const minutes = <?php echo isset($_SESSION['user']['minutes']) ? $_SESSION['user']['minutes'] : 0; ?>;
  let sessionTimeoutEnabled = true;
  const localStorageKey = 'sessionTimeoutEnabled'; // Key used to store and retrieve from local storage
  let timeout;

  // Function to convert hours and minutes to milliseconds
  function calculateTimeout(hours, minutes) {
    const timeoutInMilliseconds = (hours * 60 + minutes) * 60 * 1000;
    return timeoutInMilliseconds;
  }

  function startTimer() {
    timeout = setTimeout(logoutUser, calculateTimeout(hours, minutes));
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
                      // alert("error");
                  }
              });
          }
      });
    }
  }

  startTimer();

  document.addEventListener("mousemove", function () {
    if (sessionTimeoutEnabled)
        resetSessionTimeout();
  });

  document.addEventListener("keypress", function () {
    if (sessionTimeoutEnabled)
        resetSessionTimeout();
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

  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById('toggle');

    // Retrieve the toggle state from local storage on page load
    const storedValue = localStorage.getItem(localStorageKey);
    if (storedValue !== null) {
        sessionTimeoutEnabled = JSON.parse(storedValue);
        toggle.checked = sessionTimeoutEnabled;
    }

    toggle.addEventListener('change', function () {
        toggleSessionTimeout();
        // your JavaScript function goes here
        console.log('Toggle is ' + (this.checked ? 'on' : 'off'));
    });
  });

  // Fetch the session timeout values from the user's session when the page loads
  startTimer();
});

function getSessionTimeout() {
  $.ajax({
      type: 'GET',
      url: USER_CONTROLLER + '?action=getSessionTimeout',
      dataType: 'json',
      success: function (response) {
          // Response will contain the session timeout hours and minutes
          const hours = response.hours;
          const minutes = response.minutes;

          // Use the retrieved hours and minutes as needed
          // Set the session timeout based on the retrieved values

                      // Use the retrieved hours and minutes as needed
          console.log('Retrieved session timeout hours:', hours);
          console.log('Retrieved session timeout minutes:', minutes);

                      
          // For example:
          startTimer(hours, minutes);
      },
      error: function (error) {
          console.error(error);
      }
  });
}

// Call getSessionTimeout to fetch and set the session timeout values
getSessionTimeout();
