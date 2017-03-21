//check during save / update
function checkConnectionDuringSaveUpdate() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://google.com', true);
  xhr.send();
  xhr.onreadystatechange = processRequest;

  function processRequest(e) {
    if (xhr.readyState == 4) {
      var responseStatus = xhr.status;
      if (responseStatus >= 200 && xhr.status < 304) {
        alert("connection exists! " + responseStatus + " will use main IndexedDB & sync to server");
      var connStatus = "connected";
      } else {
        alert("connection doesn't exist! " + responseStatus + " will use offline IndexedDB");
        var connStatus = "no connection";
      }
      alert(connStatus);
    }
  }
}


//using XMLHttpRequest
function viaXMLHttpRequest() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://google.com', true);
  xhr.send();

  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4) {
      var responseStatus = xhr.status;
      if (responseStatus >= 200 && xhr.status < 304) {
      // alert("connection exists! " + responseStatus);
      var connStatus = "connected";
      } else {
        // alert("connection doesn't exist! " + responseStatus);
        var connStatus = "no connection";
      }
      connectionStatus.innerHTML = connStatus;
    }
  }
}

function viaNavigatorInitial() {
  if (navigator.onLine) {
  connectionStatus.innerHTML = "connected";
  } else {
      connectionStatus.innerHTML = "no connection";
    }
}

//using navigator
function viaNavigator() {
  // var oldState = navigator.onLine ? "connected" : "no connection";
  // connectionStatus.innerHTML = oldState;
  // window.ononline = function() {
  //   // alert('You are now online');
  //   connectionStatus.innerHTML = "connected";
  // }

  window.addEventListener('load', function() {

    function updateOnlineStatus(event) {
      var condition = navigator.onLine ? "connected" : "no connection";

      connectionStatus.innerHTML = condition;

      webWorker(condition);

      // status.className = condition;
      // status.innerHTML = condition.toUpperCase();
      // log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
    }

    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  });
}
