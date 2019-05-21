const firstViewOfCardProdct = document.getElementById('first-display-card');
const waitingViewOfCardProduct =  document.getElementById('waitingLoadCard');
const lastViewOfCardProduct = document.getElementById('second-display-card');
const loader = document.getElementById('loader');
const buy = ()=>{
    if(document.getElementById('modal-login') !== null){
        document.getElementById("modal-login").style.display="flex";
        console.log("Necesitar loguearte");
    }
    else{
        console.log("Usuario logueado");
    }
    
}


const ContinueWithPayment = ()=>{
    firstViewOfCardProdct.style.display="none";
    waitingViewOfCardProduct.style.display ="block";
    loader.setAttribute("class", "loader-effect");
    console.log("Esperando");
    setTimeout(() => {
        loader.setAttribute("class", "");
        waitingViewOfCardProduct.style.display ="none";
        lastViewOfCardProduct.style.display ="block";
        
    }, 3000);


}