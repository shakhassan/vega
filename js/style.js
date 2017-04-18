function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function responseTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontentResponse");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function savedHistoryTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontentSH");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function newRequest() {

  // alert("modal window!");

  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  // btn.onclick = function() {
      // modal.style.display = "block";
  // }

  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

function checkSaveOrUpdate(el) {

  //if save new = modalwindow
  //if update = editRequestModalWindow
  var requestIdActive = document.getElementById("requestIdActive").value;

  if (requestIdActive) {
    //means update
    // alert("requestIdActive has a value! = update modal");
    editRequest(requestIdActive);
  } else {
    //means save a new data
    // alert("requestIdActive has no value! = save new data modal");
    newRequest();
  }

}

function editRequest(key) {

  // alert(key);

  // Get the modal
  var modal = document.getElementById('editRequest');

  // Get the button that opens the modal
  // var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  // btn.onclick = function() {
  //     modal.style.display = "block";
  // }

  var transaction = db.transaction("requestlist")
  var objectStore = transaction.objectStore("requestlist");
  var request = objectStore.get(key);
  request.onerror = function(event) {
     alert("Unable to retrieve data from database!");
  };

  request.onsuccess = function(event) {
     if(request.result) {
      //  alert(request.result.title);
       document.getElementById('editRequestTitle').value = request.result.title;
       document.getElementById('editRequestDescription').value = request.result.description;
       //  alert("id " + request.key + " method " + request.result.method + "title:" + request.result.title + " url: " + request.result.url);
     }

     else {
        alert(key + " couldn't be found in your database!");
     }
  };

  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

function dropdownRequestList(key) {
  alert("requestCounter : " + key)
  document.getElementById("myDropdown").classList.toggle("show");

  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

      var dropdowns = document.getElementsByClassName("dropdown-content");
      // locateDD.innerHTML += document.getElementsByClassName("dropdown-content");
      // alert(dropdowns.length);
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
}

//test callback - tested OK
function heelo11(callback) {
  var test = 'qwe';
  callback(test);
}

function hello12(param1, param2, callback) {
  alert("hello12");
  var output = param1*param2;
  alert("hello12 output : " + output);
  callback(output);
}

function hello13(outputFromHello12) {
  alert("hello13 : " + outputFromHello12);
}

function testCheckConnCaller(callback) {
  var hoho = "haha caller";
  callback(hoho);
  alert(hoho);

}

function testCheckConn() {
  var connStatus;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://google.com', true);
  xhr.send();

  // xhr.onreadystatechange = processRequest;
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4) {
      var responseStatus = xhr.status;
      if (responseStatus >= 200 && xhr.status < 304) {
        alert("connection exists! " + responseStatus + " will use main IndexedDB & sync to server");
      connStatus = "connected";
      } else {
        alert("connection doesn't exist! " + responseStatus + " will use offline IndexedDB");
        connStatus = "no connection";
      }
      alert(connStatus);
    }
  }
  // return "glory"
  // return connStatus;
  alert(connStatus);

  // var connStatus2 = processRequest;
  // alert(connStatus2 + " : connStatus2");
}
