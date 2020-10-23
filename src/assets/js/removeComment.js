import axios from "axios";

const removeCommentBtns = document.querySelectorAll("#jsRemoveComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const handleRemove = async (e) => {
    const {target: {parentElement: {parentElement: comment}}} = e;
    console.dir(comment)
    const response = await axios({
        url: `/videos/${comment.id}/delete`,
        method: "POST"
    });
    if(response.status === 200){
        commentList.removeChild(comment)
        commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
    }
}

function init(){
    removeCommentBtns.forEach(b => b.addEventListener("click", handleRemove))
}

if(removeCommentBtns){
    init();
}