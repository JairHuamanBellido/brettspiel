let snacks = document.getElementById("TotalSnacks");
let priceTotalSnackModal = document.getElementById("TotalSnackModal");
let priceSnack;
let _fieldTotalRent = document.getElementById("FieldTotalRent");

let _totalOrder = document.getElementById("TotalOrder");
let _snacksField = document.getElementById("fieldTotalSnack");
let _fieldTotalOrder = document.getElementById("fieldTotalOrder");
let snackId;
const DownQuantity = (e) => {


    snackId = e.parentElement.getAttribute("data-target");


    e.disabled = false;
    priceSnack = parseInt(e.nextElementSibling.textContent);
    e.nextElementSibling.textContent = priceSnack - 1;


    snacks.textContent = Math.round((parseFloat(snacks.textContent) - parseFloat(document.getElementById(e.parentElement.getAttribute("id") + "price").textContent)) * 100) / 100;
    priceTotalSnackModal.textContent = snacks.textContent;
    document.getElementById("fieldTotalSnack").value = snacks.textContent;
    document.getElementById(e.parentElement.getAttribute("id") + "field").value = "true," + e.nextElementSibling.textContent+","+snackId;
    if (e.nextElementSibling.textContent === "0") {
        document.getElementById(e.parentElement.getAttribute("id") + "field").value = "false,0"
        e.disabled = true;
    }

    _totalOrder.textContent = Math.round((parseFloat(_fieldTotalRent.value) + parseFloat(_snacksField.value)) * 100) / 100;
    _fieldTotalOrder.value = _totalOrder.textContent;
}
const UpQuantity = (e) => {

    snackId = e.parentElement.getAttribute("data-target");
    
    e.previousElementSibling.textContent = parseInt(e.previousElementSibling.textContent) + 1;

    snacks.textContent = Math.round((parseFloat(snacks.textContent) + parseFloat(document.getElementById(e.parentElement.getAttribute("id") + "price").textContent)) * 100) / 100;
    priceTotalSnackModal.textContent = snacks.textContent;
    document.getElementById("fieldTotalSnack").value = snacks.textContent;
    if (e.previousElementSibling.textContent !== "0") {

        e.previousElementSibling.previousElementSibling.disabled = false;
    }

    document.getElementById(e.parentElement.getAttribute("id") + "field").value = "true," + e.previousElementSibling.textContent+","+snackId;
    _totalOrder.textContent = Math.round((parseFloat(_fieldTotalRent.value) + parseFloat(_snacksField.value)) * 100) / 100;
    _fieldTotalOrder.value = _totalOrder.textContent;


}
