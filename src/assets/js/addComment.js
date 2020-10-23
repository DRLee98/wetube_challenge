import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

let writerAvatar;

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = comment => {
  const li = document.createElement("li");
  const img = document.createElement("img");
  const commentBox = document.createElement("div");
  const name = document.createElement("span");
  const contents = document.createElement("span");
  img.className = "writer-avatar";
  commentBox.className = "comment";
  name.className = "writer-name";
  if(writerAvatar.src){
    img.src = writerAvatar.src;
  }
  name.innerHTML = "me";
  contents.innerHTML = comment;
  commentBox.append(name, contents);
  li.append(img, commentBox);
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
    addComment(comment);
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

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}