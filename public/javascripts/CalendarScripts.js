document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");

    const highlightDates = JSON.parse(calendarEl.dataset.highlightDates);

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
        dayCellClassNames: function (arg) {
            const dateStr = arg.date.toLocaleDateString('en-CA');
            return highlightDates.includes(dateStr) ? ["unavailable"] : ["available"];
        }

    });
    calendar.render();
});
