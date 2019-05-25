// ANIMATIONS CARD ELEMENTS
const firstViewOfCardProdct = document.getElementById('first-display-card');
const waitingViewOfCardProduct = document.getElementById('waitingLoadCard');
const lastViewOfCardProduct = document.getElementById('second-display-card');
const loader = document.getElementById('loader');

// IMPORTANT ELEMENTS
let startDateRent = document.getElementById("startRentDate");
let endDateRent = document.getElementById("endRentData");
let priceProduct = parseFloat(document.getElementById('price-product').textContent);
let totalRent = document.getElementById('TotalRent');
let cantProduct = document.getElementById("CantProduct");
let fieldTotalRent = document.getElementById("FieldTotalRent");
let fieldTotalOrder = document.getElementById("FieldTotalOrder");
let snacksField = document.getElementById("fieldTotalSnack");
let realTotal;



const ContinueWithPayment = () => {

    firstViewOfCardProdct.style.display = "none";
    waitingViewOfCardProduct.style.display = "block";
    loader.setAttribute("class", "loader-effect");
    console.log("Esperando");
    setTimeout(() => {
        loader.setAttribute("class", "");
        waitingViewOfCardProduct.style.display = "none";
        lastViewOfCardProduct.style.display = "block";
    }, 2300);
}





const setEndRentDate = (e) => {
    let totalDays = (dayNumber(e.value) - dayNumber(startDateRent.value));

    if (cantProduct.value == "0") {
        totalRent.textContent = totalDays * priceProduct * 1;
        fieldTotalRent.value = totalDays * priceProduct * 1;
    }
    else {
        totalRent.textContent = totalDays * priceProduct * parseInt(cantProduct.value);
        fieldTotalRent.value = totalDays * priceProduct * parseInt(cantProduct.value);;
    }

    realTotal = totalDays * priceProduct;
    console.log("Total: " + parseFloat(fieldTotalRent.value) + parseFloat(snacksField.value));
    fieldTotalOrder.textContent = Math.round((parseFloat(fieldTotalRent.value) + parseFloat(snacksField.value)) * 100) / 100;

}

const setQuantityProduct = (e) => {
    if(typeof realTotal === 'undefined'){
        realTotal = parseFloat(priceProduct);
    }
    console.log("Real total: "+realTotal);
    //console.log(fieldTotalRent.value);
    if (e.value == "0") {
        e.value = 1;

    }
    else if (e.value.length == 0) {
        totalRent.textContent = realTotal;
        fieldTotalRent.value = realTotal;
    }
    else if (e.value.length > 0) {
        totalRent.textContent = realTotal * e.value;
        fieldTotalRent.value = realTotal * e.value;
    }
    fieldTotalOrder.textContent = Math.round((parseFloat(fieldTotalRent.value) + parseFloat(snacksField.value)) * 100) / 100;
}


const openModalSnacks = () => {
    document.getElementById("snackModal").style.display = "flex";
}