const buy = ()=>{
    if(document.getElementById('modal-login') !== null){
        document.getElementById("modal-login").style.display="flex";
        console.log("Necesitar loguearte");
    }
    else{
        console.log("Usuario logueado");
    }
    
}
