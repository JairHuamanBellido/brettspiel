let imgListNewList = document.getElementsByClassName("icon-listgame");
let urlIconNewListField = document.getElementById("url-iconNewList");



const selectIcon = (element) => {
    for (let i = 0; i < imgListNewList.length; i++) {

        if (element == imgListNewList.item(i)) {
            imgListNewList.item(i).classList.add("clicked")
            urlIconNewListField.value=imgListNewList.item(i).getAttribute("src");
        }
        else {
            imgListNewList.item(i).classList.remove("clicked");
        }

    }
}