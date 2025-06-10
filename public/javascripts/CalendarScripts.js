document.addEventListener("DOMContentLoaded", function () {
    let calendarEl = document.getElementById("calendar");

    const highlightDates = JSON.parse(calendarEl.dataset.highlightDates);

    let calendar = new FullCalendar.Calendar(calendarEl, {
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
            const dateEpch = new Date(dateStr)
            const todayEpch = Date.now()
            console.log(dateStr)
            console.log(dateEpch.getTime())
            return todayEpch <= dateEpch.getTime() ? (highlightDates.includes(dateStr) ? ["unavailable"] : ["available"]) : '';
        }

    });
    calendar.render();
}); 
