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

function removeStone(a, h, p, t) {
  var src = h + t;
  return src;
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
      image.setAttribute('src', src.replace(/^(.*\/)([bw]-)(.*\.svg)$/, removeStone));
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
