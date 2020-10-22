import axios from "axios";
import axios from "axios";

const removeCommentBtn = document.getElementById("jsRemoveComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const handleRemove = (e) => console.log(e);

function init(){
    removeCommentBtn.addEventListener("click", handleRemove)
}

if(removeCommentBtn){
    init();
}