let snacks = document.getElementById("TotalSnacks");
let priceTotalSnackModal = document.getElementById("TotalSnackModal");
let priceSnack;
const DownQuantity =  (e)=>{
    e.disabled = false;
    priceSnack = parseInt(e.nextElementSibling.textContent);
    e.nextElementSibling.textContent = priceSnack -1;

    console.log('Total Snacks: '+parseFloat(snacks.textContent))
    console.log('This Snacks: '+parseFloat(document.getElementById(e.parentElement.getAttribute("id")+"price").textContent) * parseInt(parseInt(e.nextElementSibling.textContent)));
    snacks.textContent = Math.round( (parseFloat(snacks.textContent) - parseFloat(document.getElementById(e.parentElement.getAttribute("id")+"price").textContent))*100)/100;
    priceTotalSnackModal.textContent = snacks.textContent;
    
    if(e.nextElementSibling.textContent === "0"){
        e.disabled = true;
    }
  
    

}
const UpQuantity =  (e)=>{
    
    e.previousElementSibling.textContent = parseInt(e.previousElementSibling.textContent) +1;
    snacks.textContent =Math.round( (parseFloat(snacks.textContent) +  parseFloat(document.getElementById(e.parentElement.getAttribute("id")+"price").textContent))*100)/100;
    priceTotalSnackModal.textContent = snacks.textContent;
        if(e.previousElementSibling.textContent !== "0"){
            e.previousElementSibling.previousElementSibling.disabled =false;
        }

}
