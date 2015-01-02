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

function testHold() {
  _addStone(1, 0);
  _addStone(9, 0);

  _addStone(2, 0);
  _addStone(10, 0);
  _addStone(18, 0);

  _addStone(3, 1);
  _addStone(11, 1);
  _addStone(19, 1);
  _addStone(27, 1);

  hold(0, 0);
  hold(0, 1);
  clearCheckList();
  clearResult();

  _removeStone(27);
  hold(0, 0);
  hold(0, 1);
}

function hold(id, color) {
  console.log('[ENTRY] hold: id=' + id + ' ' + 'color=' + color);
  var _color = getDiffColor(color);
  var diffColorList = getSameColorList(id, _color);
  var _id = -1;
  diffColorList.forEach(function(_id){
    clearCheckList();
    clearResult();
    pushCheck(id);
    if (alive(_id, _color) === -1) {
      pushResult(-1);
      console.log('hold: _id=' + _id + ' ' + 'result=' + result);
    } else {
      pushResult(0);
      console.log('hold: _id=' + _id + ' ' + 'result=' + result);
    }
    shiftCheck();
  });
}

function shiftCheck() {
  checkList.shift();
}

function testGetDiffColor() {
  assert(1, getDiffColor(0));
  assert(0, getDiffColor(1));
  assert(-1, getDiffColor(2));
}

function getDiffColor(color) {
  if (color === 0) {
    return 1;
  } else if (color === 1) {
    return 0;
  } else {
    return -1;
  }
}

function testAlive() {
  _addStone(9, 0);
  clearCheckList();
  clearResult();
  alive(0, 1);
  _removeStone(9);

  _addStone(1, 0);
  _addStone(9, 0);

  _addStone(2, 0);
  _addStone(10, 0);
  _addStone(18, 0);

  _addStone(3, 1);
  _addStone(11, 1);
  _addStone(19, 1);
  _addStone(27, 1);

  clearCheckList();
  clearResult();
  alive(0, 0);

  _removeStone(27);
  clearCheckList();
  clearResult();
  alive(0, 0);
}

var result = [];

function clearResult() {
  result.length = 0;
}

function pushResult(value) {
  result.push(value);
}

function includeBreathingPoint() {
  return result.indexOf(0);
}

function alive(id, color) {
  if (includeCheck(id) !== -1) {
    return -1;
  }

  pushCheck(id);

  if (findBreathingPoint(id) !== -1) {
    return 0; // Here is a breathing point.
  }

  if (findSameColor(id, color) === -1) {
    return -1; // Here in not a same color.
  }

  var sameColorList = getSameColorList(id, color); // Here is a same color.

  var _id = -1;
  sameColorList.forEach(function(_id){
    if (alive(_id, color) === -1) {
      pushResult(-1);
      console.log('alive: _id=' + _id + ' ' + 'result=' + result);
    } else {
      pushResult(0);
      console.log('alive: _id=' + _id + ' ' + 'result=' + result);
    }
  });

  return includeBreathingPoint();
}

function testGetSameColorList() {
  _addStone(1, 0);
  _addStone(9, 0);

  _addStone(2, 0);
  _addStone(10, 0);
  _addStone(18, 0);

  _addStone(3, 1);
  _addStone(11, 1);
  _addStone(19, 1);
  _addStone(27, 1);

  assert(2, getSameColorList(0, 0).length);
  assert(0, getSameColorList(8, 0).length);
}

function getSameColorList(id, color) {
  var sameColorList = [];

  if (getState('up', id) === color) {
    sameColorList.push(getId('up', id));
  }
  if (getState('right', id) === color) {
    sameColorList.push(getId('right', id));
  }
  if (getState('down', id) === color) {
    sameColorList.push(getId('down', id));
  }
  if (getState('left', id) === color) {
    sameColorList.push(getId('left', id));
  }

  return sameColorList;
}

function testFindSameColor() {
  assert(-1, findSameColor(0, 0));
  _addStone(1, 0);
  assert(1, findSameColor(0, 0));
  _addStone(9, 0);
  assert(1, findSameColor(0, 0));
  _removeStone(1);
  assert(9, findSameColor(0, 0));
  _removeStone(9);

  _addStone(1, 1);
  assert(-1, findSameColor(0, 0));
  _addStone(9, 0);
  assert(9, findSameColor(0, 0));
  _removeStone(9);
  assert(-1, findSameColor(0, 0));
  _removeStone(1);

  _addStone(1, 0);
  pushCheck(1);
  assert(-1, findSameColor(0, 0));
  assert(-1, findSameColor(2, 0));
  assert(-1, findSameColor(11, 0));
  clearCheckList();
  _removeStone(1);
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

function testFindBreathingPoint() {
  assert(0, findBreathingPoint(0));
  _addStone(1, 0);
  assert(0, findBreathingPoint(0));
  _addStone(9, 0);
  assert(-1, findBreathingPoint(0));
  _removeStone(1);
  _removeStone(9);

  assert(0, findBreathingPoint(0));
  pushCheck(1);
  assert(0, findBreathingPoint(0));
  pushCheck(9);
  assert(-1, findBreathingPoint(0));
  clearCheckList();
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

function testGetState() {
  assert(-1, getState('up', 0));
  assert(2, getState('right', 0));
  assert(2, getState('down', 0));
  assert(-1, getState('left', 0));

  assert(-1, getState('up', 8));
  assert(-1, getState('right', 8));
  assert(2, getState('down', 8));
  assert(2, getState('left', 8));

  assert(2, getState('up', 72));
  assert(2, getState('right', 72));
  assert(-1, getState('down', 72));
  assert(-1, getState('left', 72));

  assert(2, getState('up', 80));
  assert(-1, getState('right', 80));
  assert(-1, getState('down', 80));
  assert(2, getState('left', 80));

  assert(2, getState('up', 32));
  assert(2, getState('right', 32));
  assert(2, getState('down', 32));
  assert(2, getState('left', 32));

  pushCheck(1);
  assert(3, getState('right', 0));
  pushCheck(9);
  assert(3, getState('down', 0));
  clearCheckList();

  _addStone(1, 0);
  assert(0, getState('right', 0));
  assert(0, getState('left', 2));
  assert(0, getState('up', 10));
  _removeStone(1);

  _addStone(9, 1);
  assert(1, getState('down', 0));
  assert(1, getState('left', 10));
  assert(1, getState('up', 18));
  _removeStone(9);
}

function getState(direction, id) {
  var _id = getId(direction, id);

  if (_id === -1) {
    return -1;
  }

  if (includeCheck(_id) !== -1) {
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

function _removeStone(id) {
  var image = document.getElementById(id);

  if (image === null) {
    return;
  }

  var src = image.getAttribute('src');
  image.setAttribute('src', src.replace(/^(.*\/)([bw]-)(.*\.svg)$/, removeStone));
}

function removeStone(a, h, p, t) {
  var src = h + t;
  return src;
}

function _addStone(id, color) {
  var image = document.getElementById(id);

  if (image === null) {
    return;
  }

  var src = image.getAttribute('src');

  if (color === 0) {
    callback = addBlack;
  } else {
    callback = addWhite;
  }

  image.setAttribute('src', src.replace(/^(.*\/)(.*\.svg)$/, callback));
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
  var color = Number(msg[1]);
  var image = document.getElementById(id);
  if (image !== null) {
    var src = image.getAttribute('src');
    if (src.indexOf('b-') !== -1 || src.indexOf('w-') !== -1) {
    } else {
      if (color === 0) {
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
