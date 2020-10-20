"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var recorderContainer = document.getElementById("jsRecordContainer");
var recordBtn = document.getElementById("jsRecordBtn");
var videoPreview = document.getElementById("jsVideoPreview");
var streamObject;
var videoRecorder;

var handleVideoData = function handleVideoData(event) {
  var videoFile = event.data;
  var link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
};

var stopRecording = function stopRecording() {
  videoRecorder.stop();
  recordBtn.removeEventListener("click", stopRecording);
  recordBtn.addEventListener("click", getVideo);
  recordBtn.innerHTML = "Start recording";
};

var startRecording = function startRecording() {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.start();
  videoRecorder.addEventListener("dataavailable", handleVideoData);
  recordBtn.addEventListener("click", stopRecording);
};

var getVideo = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var stream;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return navigator.mediaDevices.getUserMedia({
              audio: true,
              video: {
                width: 1280,
                height: 720
              }
            });

          case 3:
            stream = _context.sent;
            videoPreview.srcObject = stream;
            videoPreview.muted = true;
            videoPreview.play();
            recordBtn.innerHTML = "Stop recording";
            streamObject = stream;
            startRecording();
            _context.next = 15;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            recordBtn.innerHTML = "☹️ Can'  t record";

          case 15:
            _context.prev = 15;
            recordBtn.removeEventListener("click", getVideo);
            return _context.finish(15);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 12, 15, 18]]);
  }));

  return function getVideo() {
    return _ref.apply(this, arguments);
  };
}();

function init() {
  recordBtn.addEventListener("click", getVideo);
}

if (recorderContainer) {
  init();
}