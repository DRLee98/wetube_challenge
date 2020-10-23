import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const removeCommentBtns = document.querySelectorAll("#jsRemoveComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

let writerAvatar;

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment, data) => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  const commentBox = document.createElement("div");
  const name = document.createElement("span");
  const contents = document.createElement("span");
  const removeBtn = document.createElement("button");
  const removeIcon = document.createElement("i");
  li.id = data._id;
  commentBox.className = "comment";
  removeIcon.className = "fas fa-times";
  if(writerAvatar.src){
    img.src = writerAvatar.src;
  }
  name.innerHTML = data.creator.name;
  contents.innerHTML = comment;
  removeIcon.addEventListener("click", handleRemove);
  removeBtn.appendChild(removeIcon)
  commentBox.append(name, contents);
  li.append(img, commentBox, removeBtn);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async comment => {
  let videoId = window.location.href.split("/videos/")[1];
  if(videoId.endsWith("?")){
    const targetNum = videoId.indexOf("?")
    videoId = videoId.substring(0, targetNum)
  }
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  });
  if (response.status === 200) {
    const commentData = response.data;
    addComment(comment, commentData);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  writerAvatar = addCommentForm.querySelector("img");
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

const handleRemove = async (e) => {
    const {target: {parentElement: {parentElement: comment}}} = e;
    console.dir(comment)
    const response = await axios({
        url: `/api/${comment.id}/comment-remove`,
        method: "POST"
    });
    if(response.status === 200){
        commentList.removeChild(comment)
        commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
    }
}

function init() {
  if (addCommentForm) {
    addCommentForm.addEventListener("submit", handleSubmit);
  }
  if(removeCommentBtns){
    removeCommentBtns.forEach(b => b.addEventListener("click", handleRemove));
  }
}

init();