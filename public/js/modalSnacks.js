const DownQuantity =  (e)=>{
    e.disabled = false;
    e.nextElementSibling.textContent = parseInt(e.nextElementSibling.textContent) -1;

    if(e.nextElementSibling.textContent === "0"){
        e.disabled = true;
    }
  
    

}
const UpQuantity =  (e)=>{
    
    e.previousElementSibling.textContent = parseInt(e.previousElementSibling.textContent) +1;
    
        if(e.previousElementSibling.textContent !== "0"){
            e.previousElementSibling.previousElementSibling.disabled =false;
        }

}
