let timeDisplay = document.querySelector(".pos__head__time");

function refreshTime() {
    let date = new Date();
    let options = {
        timeZone: "Asia/Manila",
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    let timeString = date.toLocaleTimeString("en-US", options);
    timeDisplay.innerHTML = timeString;
}

setInterval(refreshTime, 1000);
