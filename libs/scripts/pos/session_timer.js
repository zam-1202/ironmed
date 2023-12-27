

//   // Timer to handle session timeout
//   let timeout;
//   let sessionTimeoutEnabled = true;
//   const localStorageKey = 'sessionTimeoutEnabled';
//   let changesSaved = false;


//   let idleTimer;
//   // Function to handle session timeout
//   function handleSessionTimeout() {
//     if (sessionTimeoutEnabled) {
//       console.log('Session timeout enabled. Starting Swal...');
//       // console.log('Timeout values:', $('#hours_value').val(), $('#minute_value').val(), $('#seconds_value').val());
//       Swal.fire({
//         title: "Are you still there?",
//         html: 'I will close in <b></b> seconds.',
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Stay Logged In",
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         cancelButtonText: "Log Out",
//         reverseButtons: true,
//         timer: 10000,
//         timerProgressBar: true,
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         didOpen: () => {
//           const b = Swal.getHtmlContainer().querySelector('b');
//           timerInterval = setInterval(() => {
//             b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
//           }, 100);
//         },
//       }).then((result) => {
//         // console.log('Swal closed. Result:', result);
//         if (result.isConfirmed) {
//           clearTimeout(timeout);
//           startTimer();
//         } else {
//           $.ajax({
//             type: "POST",
//             url: LOGIN_CONTROLLER + '?action=logout',
//             dataType: "json",
//             success: function (response) {
//               localStorage.setItem('logoutMessage', 'Successfully Logout');
//               window.location.href = "../../views/master-page/login.php";
//             },
//             error: function () {
//               // Handle error if needed
//             }
//           });
//         }
//       });
//     }
//   }

//   document.addEventListener("mousemove", function() {
//     if (sessionTimeoutEnabled) {
//       clearTimeout(timeout);
//       startTimer();
//     }
//   });
  
//   document.addEventListener("keypress", function() {
//     if (sessionTimeoutEnabled) {
//       clearTimeout(timeout);
//       startTimer();
//     }
//   });
  

//     function resetSessionTimeout() {
//         clearTimeout(timeout);
//         startTimer();
//     }


// // Add an event listener to the "Enable session timeout" checkbox
// $('#enableSessionTimeout').change(function () {
//   sessionTimeoutEnabled = this.checked;
//   console.log('Toggle is ' + (this.checked ? 'on' : 'off'));
//   if (sessionTimeoutEnabled) {
//     startTimer();
//   } else {
//     clearTimeout(timeout);
//   }
//   localStorage.setItem(localStorageKey, JSON.stringify(sessionTimeoutEnabled));
// });



// // Retrieve session timeout settings and initialize the timer
// $.ajax({
//   type: "GET",
//   url: USER_CONTROLLER + '?action=getSessionTimeoutSettings',
//   dataType: "json",
//   success: function (response) {
//     console.log('Session timeout settings received:', response);
//     if (response) {
//       localStorage.setItem('sessionTimeoutSettings', JSON.stringify(response));
//       $('#hours_value').val(response.hours);
//       $('#minute_value').val(response.minutes);
//       $('#seconds_value').val(response.seconds);

//       // Reset the timer when the values are changed
//       $('#hours_value, #minute_value, #seconds_value').on('input', function () {
//         resetSessionTimeout();
//       });

//       // Now that you have retrieved the settings, start the timer here
//       startTimer();
//     }
//   },
//   error: function (error) {
//     console.log('Error retrieving session timeout settings:', error);
//   }
// });

// // Add an event listener for page load
// $(document).ready(function () {
//   // Retrieve the toggle state from local storage on page load
//   const storedValue = localStorage.getItem(localStorageKey);
//   // console.log('Stored value:', storedValue);
//   if (storedValue !== null) {
//     sessionTimeoutEnabled = JSON.parse(storedValue);
//     // console.log('Retrieved value:', sessionTimeoutEnabled);
//     $('#enableSessionTimeout').prop('checked', sessionTimeoutEnabled);
//   }
// });

//   function startTimer() {
//     console.log('startTimer called');
//     if (sessionTimeoutEnabled) {
//       clearTimeout(timeout); // Clear any existing timer
//       const hours = parseInt($('#hours_value').val());
//       const minutes = parseInt($('#minute_value').val());
//       const seconds = parseInt($('#seconds_value').val());
  
//       // console.log('Parsed values:', hours, minutes, seconds);
  
//       const timeoutDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
  
//       timeout = setTimeout(handleSessionTimeout, timeoutDuration);

//     }
//   }
  