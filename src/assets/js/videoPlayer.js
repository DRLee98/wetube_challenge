import getBlobDuration from "get-blob-duration";

const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volume = document.getElementById("jsVolumeBox");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScrnBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const timeRange = document.getElementById("jsPlayTime");

let interval; let timeOut;

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST"
  });
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    interval = setInterval(getCurrentTime, 1000);
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    clearInterval(interval);
    }
};

const handleKeyPlay = (e) => {
  if (e.code === "Space") {
    handlePlayClick();
  }
};

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeRange.value = videoPlayer.volume;
  } else {
    videoPlayer.muted = true;
    volumeRange.value = 0;
  }
  volumeSize();
}

function exitFullScreen() {
  fullScrnBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScrnBtn.addEventListener("click", goFullScreen);
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}
  
function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
  fullScrnBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScrnBtn.removeEventListener("click", goFullScreen);
  fullScrnBtn.addEventListener("click", exitFullScreen);
}

const formatDate = seconds => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (seconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  console.log(totalSeconds);
  return `${hours}:${minutes}:${totalSeconds}`;
};

function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
  timeRange.value = videoPlayer.currentTime;
}

async function setTotalTime() {
  let {duration} = videoPlayer;
  if(isNaN(duration)){
    const blob = await fetch(videoPlayer.src).then(response => response.blob());
    duration = await getBlobDuration(blob);
  }
  console.log(duration);
  const totalTimeString = formatDate(duration);
  timeRange.max = Math.floor(duration);
  totalTime.innerHTML = totalTimeString;
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
  const {
    target: { value }
  } = event;
  videoPlayer.volume = value;
  volumeSize();
}

function volumeSize(){
  if(videoPlayer.muted){
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else if (videoPlayer.volume >= 0.7) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (videoPlayer.volume >= 0.3) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else  {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  }
}

const handleTime = () => { videoPlayer.currentTime = timeRange.value };

const hiddenClass = () => videoContainer.classList.add("hidden");

const showPlayerBar = () => {
  clearTimeout(timeOut);
  videoContainer.classList.remove("hidden");
  timeOut = setTimeout(hiddenClass, 2000);
};

function init() {
  volumeRange.value = videoPlayer.volume;
  timeRange.value = videoPlayer.currentTime;
  playBtn.addEventListener("click", handlePlayClick);
  window.addEventListener("keydown", handleKeyPlay);
  volumeBtn.addEventListener("click", handleVolumeClick);
  volume.addEventListener("mouseover", () => volume.classList.add("show"));
  volume.addEventListener("mouseout", () => volume.classList.remove("show"));
  fullScrnBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("durationchange", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("input", handleDrag);
  timeRange.addEventListener("input", handleTime);
  videoContainer.addEventListener("mousemove", showPlayerBar);
}

if (videoContainer) {
  init();
}