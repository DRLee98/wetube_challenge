"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var addCommentForm = document.getElementById("jsAddComment");
var commentList = document.getElementById("jsCommentList");
var commentNumber = document.getElementById("jsCommentNumber");

var increaseNumber = function increaseNumber() {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

var addComment = function addComment(comment) {
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

var sendComment = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(comment) {
    var videoId, response;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            videoId = window.location.href.split("/videos/")[1];
            _context.next = 3;
            return (0, _axios["default"])({
              url: "/api/".concat(videoId, "/comment"),
              method: "POST",
              data: {
                comment: comment
              }
            });

          case 3:
            response = _context.sent;

            if (response.status === 200) {
              addComment(comment);
            }

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function sendComment(_x) {
    return _ref.apply(this, arguments);
  };
}();

var handleSubmit = function handleSubmit(event) {
  event.preventDefault();
  var commentInput = addCommentForm.querySelector("input");
  var comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}