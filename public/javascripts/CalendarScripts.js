document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        themeSystem: "bootstrap5",
        height: 300,
        contentHeight: 300,
        aspectRatio: 1.1,
        headerToolbar: {
            left: "prev",
            center: "title",
            right: "next",
        },
    });
    calendar.render();
});
