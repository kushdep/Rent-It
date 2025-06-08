document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");

    console.log(calendarEl.dataset)
    const highlightDates = JSON.parse(calendarEl.dataset.highlightDates);
    console.log(highlightDates)

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
            console.log("called for" + JSON.stringify(arg))
            const dateStr = arg.date.toLocaleDateString('en-CA');
            return highlightDates.includes(dateStr) ? ["highlight-day"] : [];
        }

    });
    calendar.render();
});
