let item_links = document.getElementsByClassName("item-link-options");
let togle = false;
let setAnimationLinkItems = (a, isClose) => {


    let count = setInterval(() => {
        if (a >= item_links.length) {
            clearInterval(count);
        }
        if (isClose) {
            console.log("Insertando el " + (a));
            document.getElementById("link-item" + (a)).setAttribute("class", "vanish item-link-options");
            a++;
        }
        else{
            console.log("Sacando el " + (a));
            document.getElementById("link-item" + (a)).setAttribute("class", "item-link-options");
            a++;
        }
    }, 25);


}


const show = () => {
    togle = !togle;
    document.getElementById("user-options").classList.toggle("show");
    setAnimationLinkItems(1,togle);
}

