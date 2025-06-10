document.addEventListener("DOMContentLoaded", function () {
    const bookedDates = ["2025-06-10", "2025-06-15", "2025-06-18"];
    const rentDatesInput = document.getElementById("rentDates");
    const rentPrice = JSON.parse(rentDatesInput.dataset.rentPrice)

    const maxDate = JSON.parse(rentDatesInput.dataset.maxDate)
    const minDate = JSON.parse(rentDatesInput.dataset.minDate)

    const datePicker = flatpickr("#rentDates", {
        mode: 'range',
        disable: bookedDates,
        dateFormat: "Y-m-d",
        minDate: minDate,
        maxDate: maxDate,
        altInput: true,
        onChange: function () {
            let dates = rentDatesInput.value
            let from = dates.slice(0,10)
            let to = dates.slice(14,24)
            getTotalRent(from,to,rentPrice)
        }
    });
});

function getTotalRent(dateFrom, dateTo, rentPrice) {
    const priceInputEle = document.getElementById('rentPrice');

    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffTime = to - from;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    priceInputEle.value = diffDays * rentPrice;
}