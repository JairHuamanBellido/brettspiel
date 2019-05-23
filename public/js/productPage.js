const firstViewOfCardProdct = document.getElementById('first-display-card');
const waitingViewOfCardProduct = document.getElementById('waitingLoadCard');
const lastViewOfCardProduct = document.getElementById('second-display-card');
const loader = document.getElementById('loader');


let startDateRent = document.getElementById("startRentData");
let endDateRent = document.getElementById("endRentData");
let priceProduct = parseFloat(document.getElementById('price-product').textContent);
let totalRent = document.getElementById('TotalRent');
let cantProduct = document.getElementById("CantProduct");
let fieldTotalRent = document.getElementById("FieldTotalRent");
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




function setStartRentDate (e) {
    console.log(dayNumber(e.value));
}

const setEndRentDate = (e) => {
    console.log(dayNumber(e.value));
}

const setQuantityProduct = (e, w) => {
    if (e.value.length == 0) {

        totalRent.textContent = priceProduct;
        fieldTotalRent.value = priceProduct;
    }
    else {

        totalRent.textContent = parseFloat(priceProduct) * parseInt(e.value);
        fieldTotalRent.value = parseFloat(priceProduct) * parseInt(e.value);
    }

}