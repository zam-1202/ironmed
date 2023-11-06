

$(document).ready(function () {
  $('.btn').click(function (event){
      event.preventDefault()
  })   
});

let sessionTimeoutEnabled = true;
const localStorageKey = 'sessionTimeoutEnabled'; // Key used to store and retrieve from local storage
let timeout;

const Session = (() => {
  const thisSession = {};

thisSession.clickSaveButton= () => {
  const hours = $('#hours_value').val();
  const minutes = $('#minute_value').val();
  
  if (hours === '' || minutes === '') {
      Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Please enter both hours and minutes',
          showConfirmButton: true,
      });
      return; // Exit the function if the input fields are empty.
  }

  // const requestData = {
  //     hours: hours,
  //     minutes: minutes
  // };

  $.ajax({
      type: "POST",
      url: SESSION_CONTROLLER + '?action=save', // Adjust the URL to the correct path
      dataType: "json",
      data:{
        hours: hours,
        minutes: minutes
      },
      success: function (response) {
          if (response === 'Successfully Save') {
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Session saved successfully',
                  showConfirmButton: true,
              });
          } else {
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Error: ' + response,
                  showConfirmButton: true,
              });
          }
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
return thisSession;
})()

// ----------------------------------------------------------------------

function startTimer() {
  timeout = setTimeout(logoutUser, 3000000); // 30 minutes
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
            success: function (response)
            {
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