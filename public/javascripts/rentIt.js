document.addEventListener("DOMContentLoaded", function () {
    const disabledDates = ["2025-06-10", "2025-06-15", "2025-06-18"];
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("To");

    const maxDate = JSON.parse(fromInput.dataset.maxDate)
    const minDate = JSON.parse(fromInput.dataset.minDate)


       function getCorrectDates() {
        const priceInputEle = document.getElementById('rentPrice');
        const rentPrice = JSON.parse(toInput.dataset.rentPrice)
        
        console.log(fromPicker.input.value)
        console.log(fromInput.value)
        console.log(toPicker.input.value)
        console.log(toInput.value)
        
        if(fromPicker.input.value!=""){
            toPicker.minDate = fromInput.value;
            console.log(toPicker.minDate)
            if (toInput.value < fromInput.value) {
                toInput.value = "";
                console.log(toInput.minDate)
            }
        }
    
    
        if(fromInput.value!="" && toInput.value!=''){
            const totalNights = getTotalNights(fromInput.value, toInput.value);
            console.log(totalNights)
            priceInputEle.value = totalNights * rentPrice;
            console.log(priceInputEle.value)
        }
    
    }

    const fromPicker = flatpickr("#from", {
        disable: disabledDates,
        dateFormat: "Y-m-d",
        minDate: minDate,
        altInput: true,
        maxDate: maxDate,
        onChange: getCorrectDates
    });

    const toPicker = flatpickr("#To", {
        disable: disabledDates,
        dateFormat: "Y-m-d",
        minDate: minDate,
        maxDate: maxDate,
        altInput: true,
        onChange: getCorrectDates
    });
    
 
});




function getTotalNights(dateFrom, dateTo) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diffTime = to - from;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
}

// document.addEventListener("DOMContentLoaded", function () {
//     const fromInput = document.getElementById("from");
//     const toInput = document.getElementById("To");
//     const priceInputEle = document.getElementById('rentPrice');
//     const rentPrice = JSON.parse(toInput.dataset.rentPrice)

//     function updatePrice() {
//         const totalNights = getTotalNights(fromInput.value, toInput.value);
//         priceInputEle.value = totalNights * rentPrice;
//     }

//     fromInput.addEventListener("change", updatePrice);
//     toInput.addEventListener("change", updatePrice);
// });


// document.addEventListener("DOMContentLoaded", function () {
//     const fromInput = document.getElementById("from");
//     const toInput = document.getElementById("To");

//     fromInput.addEventListener("change", function () {
//         toInput.min = fromInput.value;
//         if (toInput.value < fromInput.value) {
//             toInput.value = "";
//         }
//     });
// });


