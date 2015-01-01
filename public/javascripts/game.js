var socket, host;
host = "ws://localhost:3001";

function addMessage(msg) {
}

function connect() {
  try {
    socket = new WebSocket(host);
    addMessage("Socket State: " + socket.readyState);
    socket.onopen = function() {
      addMessage("Socket Status: " + socket.readyState + " (open)");
    }
    socket.onclose = function() {
      addMessage("Socket Status: " + socket.readyState + " (closed)");
    }
    socket.onmessage = function(msg) {
      addMessage("Received: " + msg.data);
      data2click(msg.data);
    }
  } catch(exception) {
    addMessage("Error: " + exception);
  }
}

var boardSize = 9;
var arrayUp = new Array(boardSize);
var arrayRight = new Array(boardSize);
var arrayDown = new Array(boardSize);
var arrayLeft = new Array(boardSize);

var i = 0;
for (i = 0; i < boardSize; ++i) {
  arrayUp.push(i);
}
for (i = boardSize - 1; i < boardSize * boardSize; i += boardSize) {
  arrayRight.push(i);
}
for (i = boardSize * (boardSize - 1); i < boardSize * boardSize; ++i) {
  arrayDown.push(i);
}
for (i = 0; i < boardSize * (boardSize - 1) + 1; i += boardSize) {
  arrayLeft.push(i);
}

function getId(mode, id) {
  if (mode === 'up') {
    if (arrayUp.indexOf(id) !== -1) {
      return -1;
    } else {
      return id - boardSize;
    }
  }

  if (mode === 'right') {
    if (arrayRight.indexOf(id) !== -1) {
      return -1;
    } else {
      return id + 1;
    }
  }

  if (mode === 'down') {
    if (arrayDown.indexOf(id) !== -1) {
      return -1;
    } else {
      return id + boardSize;
    }
  }

  if (mode === 'left') {
    if (arrayLeft.indexOf(id) !== -1) {
      return -1;
    } else {
      return id - 1
    }
  }
}

function removeStone(a, h, p, t) {
  var src = h + t;
  return src;
}

function _removeStone(id) {
  var image = document.getElementById(id);
  var src = image.getAttribute('src');
  image.setAttribute('src', src.replace(/^(.*\/)([bw]-)(.*\.svg)$/, removeStone));
}

function addWhite(a, h, t) {
  var src = h + "w-" + t;
  return src;
}

function addBlack(a, h, t) {
  var src = h + "b-" + t;
  return src;
}

function data2click(msg) {
  msg = msg.split(',');
  var id = msg[0];
  var color = msg[1];
  var image = document.getElementById(id);
  if (image !== null) {
    var src = image.getAttribute('src');
    if (src.indexOf('b-') !== -1 || src.indexOf('w-') !== -1) {
    } else {
      if (color === '0') {
        image.setAttribute('src', src.replace(/^(.*\/)(.*\.svg)$/, addBlack));
      } else {
        image.setAttribute('src', src.replace(/^(.*\/)(.*\.svg)$/, addWhite));
      }
    }
  }
}

for (var i = 0; i < document.images.length; ++i) {
  document.images[i].id = i;
  document.images[i].onclick = function () {
    socket.send(this.id);
  }
}

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    connect();
  }
}
