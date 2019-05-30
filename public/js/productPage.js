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
let TotalOrder = document.getElementById("TotalOrder");
let fieldTotalOrder = document.getElementById("fieldTotalOrder");
let snacksField = document.getElementById("fieldTotalSnack");
let realTotal;



const ContinueWithPayment = () => {

    document.getElementById("second-TotalSnacks").textContent = snacksField.value;
    document.getElementById("second-TotalRent").textContent = fieldTotalRent.value;
    document.getElementById("second-TotalOrder").textContent = fieldTotalOrder.value;
    firstViewOfCardProdct.style.display = "none";
    waitingViewOfCardProduct.style.display = "flex";
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
    let a,b;
    a = b = 3;
    console.log("a: "+a);
    console.log("b: "+b)
    if (cantProduct.value == "0") {
        totalRent.textContent = Math.round((totalDays * priceProduct * 1)*100)/100;
        fieldTotalRent.value = Math.round((totalDays * priceProduct * 1)*100)/100;
    }
    else {
        totalRent.textContent = Math.round((totalDays * priceProduct * parseInt(cantProduct.value))*100)/100;
        fieldTotalRent.value = Math.round((totalDays * priceProduct * parseInt(cantProduct.value))*100)/100;
    }

    realTotal = totalDays * priceProduct;
    console.log("Total: " + parseFloat(fieldTotalRent.value) + parseFloat(snacksField.value));
    TotalOrder.textContent = Math.round((parseFloat(fieldTotalRent.value) + parseFloat(snacksField.value)) * 100) / 100;
    fieldTotalOrder.value = TotalOrder.textContent;
}

const setQuantityProduct = (e) => {

    if (typeof realTotal === 'undefined') {
        console.log("Seteando");
        realTotal = parseFloat(priceProduct);
    }
    console.log("Real total: " + realTotal);
    //console.log(fieldTotalRent.value);
    if (e.value == "0") {
        e.value = 1;

    }
    else if (e.value.length == 0) {
        totalRent.textContent = Math.round(realTotal * 100) / 100;
        fieldTotalRent.value = Math.round(realTotal * 100) / 100;
    }
    else if (e.value.length > 0) {
        totalRent.textContent = Math.round(realTotal * e.value * 100) / 100;
        fieldTotalRent.value = Math.round(realTotal * e.value * 100) / 100;
    }
    TotalOrder.textContent = Math.round((parseFloat(fieldTotalRent.value) + parseFloat(snacksField.value)) * 100) / 100;
    fieldTotalOrder.value = TotalOrder.textContent;
}


const openModalSnacks = () => {
    document.getElementById("snackModal").style.display = "flex";
}