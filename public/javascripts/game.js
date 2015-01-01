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

function findSameColor(id, color) {
  if (getState('up', id) === color) {
    return getId('up', id);
  }
  if (getState('right', id) === color) {
    return getId('right', id);
  }
  if (getState('down', id) === color) {
    return getId('down', id);
  }
  if (getState('left', id) === color) {
    return getId('left', id);
  }
  return -1;
}

function findBreathingPoint(id) {
  if (getState('up', id) === 2) {
    return id;
  }
  if (getState('right', id) === 2) {
    return id;
  }
  if (getState('down', id) === 2) {
    return id;
  }
  if (getState('left', id) === 2) {
    return id;
  }
  return -1;
}

function getState(direction, id) {
  var _id = getId(direction, id);

  if (_id === -1) {
    return -1;
  }

  if (includeCheck(id) !== -1) {
    return 3;
  }

  var image = document.getElementById(_id);

  if (image === null) {
    return -1;
  }

  var src = image.getAttribute('src');

  if (src.indexOf('b-') !== -1) {
    return 0;
  }

  if (src.indexOf('w-') !== -1) {
    return 1;
  }

  return 2;
}

var checkList = [];

function clearCheckList() {
  checkList.length = 0;
}

function pushCheck(id) {
  checkList.push(id);
}

function includeCheck(id) {
  return checkList.indexOf(id);
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

function testGetId() {
  assert(-1, getId('up', 0));
  assert(1, getId('right', 0));
  assert(9, getId('down', 0));
  assert(-1, getId('left', 0));

  assert(-1, getId('up', 8));
  assert(-1, getId('right', 8));
  assert(17, getId('down', 8));
  assert(7, getId('left', 8));

  assert(63, getId('up', 72));
  assert(73, getId('right', 72));
  assert(-1, getId('down', 72));
  assert(-1, getId('left', 72));

  assert(71, getId('up', 80));
  assert(-1, getId('right', 80));
  assert(-1, getId('down', 80));
  assert(79, getId('left', 80));

  assert(22, getId('up', 31));
  assert(32, getId('right', 31));
  assert(40, getId('down', 31));
  assert(30, getId('left', 31));
}

function assert(expectation, real) {
  if (expectation === real) {
    console.log('OK');
  } else {
    console.log('NG');
  }
}

function getId(direction, id) {
  if (direction === 'up') {
    if (arrayUp.indexOf(id) !== -1) {
      return -1;
    } else {
      return id - boardSize;
    }
  }

  if (direction === 'right') {
    if (arrayRight.indexOf(id) !== -1) {
      return -1;
    } else {
      return id + 1;
    }
  }

  if (direction === 'down') {
    if (arrayDown.indexOf(id) !== -1) {
      return -1;
    } else {
      return id + boardSize;
    }
  }

  if (direction === 'left') {
    if (arrayLeft.indexOf(id) !== -1) {
      return -1;
    } else {
      return id - 1
    }
  }

  return id;
}

function removeStone(a, h, p, t) {
  var src = h + t;
  return src;
}

function _removeStone(id) {
  var image = document.getElementById(id);

  if (image === null) {
    return;
  }

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
