//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

// const employeeData = [
//                         { id: "542e31e6-f272-4dd8-ad5a-0129dc7763fa", name: "gopal", age: 35, email: "gopal@tutorialspoint.com" },
//                         { id: "19bb475f-a7e7-46c4-96cf-856687d86b6d", name: "prasad", age: 32, email: "prasad@tutorialspoint.com" }
//                       ];

//create / open database if created
//test1 database
var request = indexedDB.open("test1",1);
var db;

request.onupgradeneeded = function() {
  db = request.result;
  var store = db.createObjectStore("requestlist", {keyPath: "id"});
  var ourindex = store.createIndex('requestlist_title', 'title', {unique: true, multiEntry: false});
};

request.onsuccess = function(event) {
  db = event.target.result;
};

request.onerror = function(event) {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};

// request.onupgradeneeded = function(event) {
//   var db = event.target.result;
//   var objectStore = db.createObjectStore("requestlist", {keyPath: "id"});
//
//   for (var i in employeeData) {
//     objectStore.add(employeeData[i]);
//   }
// }

// This event is only implemented in recent browsers
// request.onupgradeneeded = function(event) {
//   var db = event.target.result;
//
//   // Create an objectStore for this database
//   var objectStore = db.createObjectStore("requestlist", { keyPath: "id" });
// };

// db.onerror = function(event) {
//   alert("Database error: " + event.target.errorCode);
// };

//history database
var requestHistory = indexedDB.open("history",1);
var dbHistory;

requestHistory.onupgradeneeded = function() {
  dbHistory = requestHistory.result;
  var storeHistory = dbHistory.createObjectStore("requestlist", {keyPath: "url"});
  var ourindexHistory = storeHistory.createIndex('requestlist_url', 'url', {unique: true, multiEntry: false});
};

requestHistory.onsuccess = function(event) {
  dbHistory = event.target.result;
};

requestHistory.onerror = function(event) {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};

//offlineData database
var requestOffline = indexedDB.open("offlineData",1);
var dbOffline;

requestOffline.onupgradeneeded = function() {
  dbOffline = requestOffline.result;
  var storeOffline = dbOffline.createObjectStore("requestlist", {keyPath: "id"});
  var ourindexOffline = storeOffline.createIndex('requestlist_title', 'title', {unique: true, multiEntry: false});
};

requestOffline.onsuccess = function(event) {
  dbOffline = event.target.result;
};

requestOffline.onerror = function(event) {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};

function add(requestIdActive, httpMethod, requestTitle, urlRequest, requestBody, requestHeadersKey1, requestHeadersValue1, requestDescription) {

  //TESTING to double confirm this func triggered by new request, not existing (update).
  //check either requestIdActive has value or not. has value = update, no value = save
  if (requestIdActive) {
    //means update
    alert("requestIdActive has a value!");
  } else {
    //means save a new data
    alert("requestIdActive has no value!");
  }

  const uuidV4 = require('uuid/v4');
  var idRequest = uuidV4();

  alert(idRequest + " " + httpMethod + " " + requestTitle + " " + urlRequest + " " + requestHeadersKey1 + " " + requestHeadersValue1 + " " + requestBody + " " + requestDescription);
  var request = db.transaction(["requestlist"], "readwrite")

  .objectStore("requestlist")
  .add(
    {
      id: idRequest,
      method: httpMethod,
      title: requestTitle,
      url: urlRequest,
      headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
      body: requestBody,
      description: requestDescription
      // body: "{ \"id\": \"3a08a161-80ef-44bf-a23e-9cf47d821bba\", \"name\": \"James Burke\"}"
    }
  );

  request.onsuccess = function(event) {
      alert("Data has been added to your database.");
  };

  request.onerror = function(event) {
    alert("Unable to add data\r"+ idRequest +"is aready exist in your database! ");
  }

  // savetoMongoDB();
  // notifyClient(id);

  savetoMongoDBSelfHosted(idRequest);
}

function readAll() {
  var objectStore = db.transaction("requestlist").objectStore("requestlist");
  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result; if (cursor) {
      // menu.innerHTML += "<li><a href='#firstcontent'><div id='httpMethodListGet'>" + cursor.value.method + "</div><div id='httpMethodTitle'>" + cursor.value.title + "</div></a></li>";
      alert("id " + cursor.key + " method " + cursor.value.method + "title:" + cursor.value.title + " url: " + cursor.value.url + " headersKey1: " + cursor.value.headers[0].key + " headersValue1: " + cursor.value.headers[0].value);
      cursor.continue();
    } else {
      alert("No more entries!!!!");
    }
  };
}

//added 03012017
function readAllOffline() {
  var objectStore = dbOffline.transaction("requestlist").objectStore("requestlist");
  var offlineDataRetValue;

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result; if (cursor) {
      // menu.innerHTML += "<li><a href='#firstcontent'><div id='httpMethodListGet'>" + cursor.value.method + "</div><div id='httpMethodTitle'>" + cursor.value.title + "</div></a></li>";
      alert("id " + cursor.key + " method " + cursor.value.method + "title:" + cursor.value.title + " url: " + cursor.value.url + " headersKey1: " + cursor.value.headers[0].key + " headersValue1: " + cursor.value.headers[0].value);

      var key = cursor.key;
      var method = cursor.value.method;
      var title = cursor.value.title;
      var url = cursor.value.url;
      var requestHeadersKey1 = cursor.value.headers[0].key;
      var requestHeadersValue1 = cursor.value.headers[0].value;
      syncOfflinetoMongoDBSelfHosted(key, method, title, url, requestHeadersKey1, requestHeadersValue1);
      cursor.continue();
    } else {
      alert("No more entries!!!!");
      offlineDataRetValue = "no offline data found";
      alert("var offlineData : " + offlineDataRetValue);
      // return "no offline data found";
    }
  };
  alert("var offlineData global : " + offlineDataRetValue);
  return offlineDataRetValue;
}

function menuLoadNewlyAddedRequest(key) {

  alert("new request added id : " + key)
  var transaction = db.transaction("requestlist")
  var objectStore = transaction.objectStore("requestlist");
  var request = objectStore.get(key);

  request.onerror = function(event) {
     alert("Unable to retrieve data from database! (menuLoadNewlyAddedRequest)");
  };

  request.onsuccess = function(event) {
     if(request.result) {

       menu.innerHTML +=
       "<li id='"+request.result.id+"'>" +
         "<div style='display: inline-block;'>" +
         "<a href='#' onclick='read(\"" + request.result.id + "\");'>" +
           "<div id='httpMethodListGet'>" + request.result.method + "</div>" +
           "<div id='httpMethodTitle'>" + request.result.title + "</div>" +
         "</a>" +
         "</div>" +
         "<div class='dropdown'>" +
           "<button onclick='dropdownRequestList();' class='dropbtn'>...</button>" +
           "<div id='myDropdown' class='dropdown-content'>" +
             "<input type='hidden' name='requestId' id='requestId' value=\""+ request.key + "\">" +
             "<a href='#' onclick='editRequest(\""+ request.key + "\");' id='myBtn'>Edit</a>" +
             "<a href='#' onclick='remove(\""+ request.key + "\");'>Delete</a>" +
           "</div>" +
         "</div>" +
       "</li>";

     } else {
        alert(key + " couldn't be found in your database! (menuLoadNewlyAddedRequest)");
     }

   };

}

function loadRequestList() {
  var objectStore = db.transaction("requestlist").objectStore("requestlist");
  objectStore.openCursor().onsuccess = function(event) {

    var indexArrayKey = 0;
    var key = new Array();

    var cursor = event.target.result; if (cursor) {
        key[indexArrayKey] = cursor.key;
      menu.innerHTML +=
      // "<li><div id='boxTest'>" +
      "<li>" +
        "<div style='display: inline-block;'>" +
        "<a href='#' onclick='read(\"" + cursor.key + "\");'>" +
          "<div id='httpMethodListGet'>" + cursor.value.method + "</div>" +
          "<div id='httpMethodTitle'>" + cursor.value.title + "</div>" +
        "</a>" +
        "</div>" +
        "<div class='dropdown'>" +
          "<button onclick='dropdownRequestList();' class='dropbtn'>...</button>" +
          // "<div id='locateDD'>" +
          "<div id='myDropdown' class='dropdown-content'>" +
            "<input type='hidden' name='requestId' id='requestId' value=\""+ cursor.key + "\">" +
            "<a href='#' onclick='editRequest(\""+ cursor.key + "\");' id='myBtn'>Edit</a>" +
            "<a href='#' onclick='remove(\""+ cursor.key + "\");'>Delete</a>" +
            // "<div id='deleteRequestA'><a href='#' onclick='deleteRequestA(\""+ cursor.key + "\");'>Delete</a></div>" +
          "</div>" +
          // "</div>" +
        "</div>" +
      "</li>";
      // "</div></li>";
      // alert("id " + cursor.key + " method " + cursor.value.method + "title:" + cursor.value.title + " url: " + cursor.value.url);
      // alert(key[indexArrayKey]);
      indexArrayKey++;

      cursor.continue();
    } else {
      // alert("No more entries!!!!");
    }
  };
}

function updateRequest(key, httpMethod, editRequestTitle, urlRequest, requestBody, requestHeadersKey1, requestHeadersValue1, editRequestDescription) {
  alert("updateRequest : " + key + " " + httpMethod + " " + editRequestTitle + " " + urlRequest + " " + requestHeadersKey1 + " " + requestHeadersValue1 + " " + requestBody + " " + editRequestDescription);

  //TODO : check connection : no - use offline IndexedDB & no need to call savetoMongoDBSelfHosted()
  // var connStatusCode = checkConnectionDuringSaveUpdate()
  // alert("connStatus vegadb.js : " + connStatusCode)

  var transaction = db.transaction("requestlist", "readwrite")
  var objectStore = transaction.objectStore("requestlist");
  var request = objectStore.get(key);

  request.onerror = function(event) {
     alert("Unable to retrieve data from database!");
  };

  request.onsuccess = function(event) {
    if(request.result) {
        // alert("found id " + request.result.id);

        // var update = db.transaction(["requestlist"], "readwrite")
        var update = transaction
        .objectStore("requestlist")
        .put(
          {
            id: key,
            method: httpMethod,
            title: editRequestTitle,
            url: urlRequest,
            headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
            description: editRequestDescription,
            body: requestBody
          }
        );
        // notifyClient(key);
        // savetoMongoDB();

    } else {
       alert(key + " couldn't be found in your database!");
    }
  };

  //Temporary - use navigator.onLine
  var condition = navigator.onLine ? "connected" : "no connection";
  if(condition==="connected") {
    alert("connected. will be synced to server");
    savetoMongoDBSelfHosted(key);
  } else {
      alert("connection doesn't exist! will use offline IndexedDB");

      var transactionOffline = dbOffline.transaction("requestlist", "readwrite")
      var objectStoreOffline = transactionOffline.objectStore("requestlist");
      var requestOffline = objectStoreOffline.get(key);

      requestOffline.onerror = function(event) {
         alert("Unable to retrieve data from database!");
      };

      requestOffline.onsuccess = function(event) {
        if(requestOffline.result) {
            var update = transactionOffline
            .objectStore("requestlist")
            .put(
              {
                id: key,
                method: httpMethod,
                title: editRequestTitle,
                url: urlRequest,
                headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
                description: editRequestDescription,
                body: requestBody
              }
            );
        } else {
           alert(key + " couldn't be found in your database (offline)!");

           var request = transactionOffline
           .objectStore("requestlist")
           .add(
             {
               id: key,
               method: httpMethod,
               title: editRequestTitle,
               url: urlRequest,
               headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
               description: editRequestDescription,
               body: requestBody
             }
           );

           alert("after save in offlineData db")
        }
      };
  }

  // savetoMongoDB();
  // savetoMongoDBSelfHosted(key);
  // notifyClient(key);

}

function check(key) {
  alert("requestIdActive : " + key);
}

function read(key) {
  // alert("search for " + key);
  //  var transaction = db.transaction(["requestlist"], "readwrite")
   var transaction = db.transaction("requestlist")

   var objectStore = transaction.objectStore("requestlist");
  //  var objectStore = db.transaction("requestlist").objectStore("requestlist");

  //  var request = objectStore.get("'" + key + "'");
   var request = objectStore.get(key);

   request.onerror = function(event) {
      alert("Unable to retrieve data from database!");
   };

   request.onsuccess = function(event) {
      if(request.result) {
        document.getElementById('requestIdActive').value = request.result.id;
        document.getElementById('requestTitleActive').value = request.result.title;
        document.getElementById('editRequestTitle').value = request.result.title;
        document.getElementById('urlRequest').value = request.result.url;
        document.getElementById('httpMethod').value = request.result.method;
        document.getElementById('requestBody').value = request.result.body;
        document.getElementById('requestDescription').value = request.result.description;

        for (var i = 0; i < request.result.headers.length; i++) {
            var headers = request.result.headers[i];
            document.getElementById('requestHeadersKey1').value = headers.key;
            document.getElementById('requestHeadersValue1').value = headers.value;
            console.log(counter.counter_name);
        }

        //  alert("id " + request.key + " method " + request.result.method + "title:" + request.result.title + " url: " + request.result.url);
      }

      else {
         alert(key + " couldn't be found in your database!");
      }
   };
}

function remove(key) {
  alert("remove request id : " + key);
   var request = db.transaction(["requestlist"], "readwrite")
   .objectStore("requestlist")
   .delete(key);

   request.onsuccess = function(event) {
      alert(key + " entry has been removed from your database!!!!");

      //delete in MongodDB
      deleteRequestInMongoDBSelfHosted(key);
   };
}

function hello() {
  // console.log("Hello World");
  alert("Hello World");
}

/*************** HISTORY ***************/

function addHistory(httpMethod, urlRequest, requestBody, requestHeadersKey1, requestHeadersValue1) {

  const uuidV4 = require('uuid/v4');
  var idRequest = uuidV4();
  var now = Date();

  // alert(idRequest + " " + httpMethod + " " + urlRequest + " " + requestHeadersKey1 + " " + requestHeadersValue1 + " " + requestBody);
  var requestHistory = dbHistory.transaction(["requestlist"], "readwrite")

  .objectStore("requestlist")
  .add(
    {
      id: idRequest,
      dateCreated: now,
      method: httpMethod,
      url: urlRequest,
      headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
      body: requestBody
      // body: "{ \"id\": \"3a08a161-80ef-44bf-a23e-9cf47d821bba\", \"name\": \"James Burke\"}"
    }
  );

  requestHistory.onsuccess = function(event) {
      alert("Data has been added to your database.");
  };

  requestHistory.onerror = function(event) {
    alert("Unable to add data\r"+ idRequest +"is aready exist in your database! ");
  }
}

function loadHistory() {
  var objectStore = dbHistory.transaction("requestlist").objectStore("requestlist");
  objectStore.openCursor().onsuccess = function(event) {

    var indexArrayKey = 0;
    var key = new Array();
    // var dateCreated = new Date();
    var dateCreatedM;
    var dateNumber;

    var cursorHistory = event.target.result; if (cursorHistory) {
        key[indexArrayKey] = cursorHistory.key;

        // var dateCreated = new Date(cursorHistory.value.dateCreated);
        // var locale = "en-us";
        // var month = dateCreated.toLocaleString(locale, { month: "short" });

        // dateCreatedM = dateCreated.getMonth();

        // dateCreatedM = month;
        // dateNumber = dateCreated.getDate();

      menuHistory.innerHTML +=
      // "<li><div id='boxTest'>" +
      "<li>" +
        "<div style='display: inline-block;'>" +
        // "<p>" + dateCreatedM + " " + dateNumber +"</p>" +
        "<a href='#' onclick='readHistory(\"" + cursorHistory.key + "\");'>" +
          "<div id='httpMethodListGet'>" + cursorHistory.value.method + "</div>" +
          "<div id='urlMenuLeft'>" + cursorHistory.value.url + "</div>" +
        "</a>" +
        "</div>" +
        // "<div class='dropdown'>" +
        //   "<button onclick='dropdownRequestList();' class='dropbtn'>...</button>" +
          // "<div id='myDropdown' class='dropdown-content'>" +
          //   "<input type='hidden' name='requestId' id='requestId' value=\""+ cursorHistory.key + "\">" +
          //   "<a href='#' onclick='editRequestModalWindow(\""+ cursorHistory.key + "\");' id='myBtn'>Edit</a>" +
          //   "<a href='#' onclick='remove(\""+ cursorHistory.key + "\");'>Delete</a>" +
          // "</div>" +
        // "</div>" +
      "</li>";
      // "</div></li>";
      // alert("id " + cursorHistory.key + " method " + cursorHistory.value.method + " url: " + cursorHistory.value.url);
      // alert(key[indexArrayKey]);
      indexArrayKey++;

      cursorHistory.continue();
    } else {
      // alert("No more entries!!!!");
    }
  };
}

function readHistory(key) {
  // alert("search for " + key);
  //  var transaction = db.transaction(["requestlist"], "readwrite")
   var transactionHistory = dbHistory.transaction("requestlist")

   var objectStoreHistory = transactionHistory.objectStore("requestlist");
  //  var objectStore = db.transaction("requestlist").objectStore("requestlist");

  //  var request = objectStore.get("'" + key + "'");
   var requestHistory = objectStoreHistory.get(key);

   requestHistory.onerror = function(event) {
      alert("Unable to retrieve data from database!");
   };

   requestHistory.onsuccess = function(event) {
      if(requestHistory.result) {
        document.getElementById('urlRequest').value = requestHistory.result.url;
        document.getElementById('httpMethod').value = requestHistory.result.method;
        document.getElementById('requestBody').value = requestHistory.result.body;

        for (var i = 0; i < requestHistory.result.headers.length; i++) {
            var headers = requestHistory.result.headers[i];
            document.getElementById('requestHeadersKey1').value = headers.key;
            document.getElementById('requestHeadersValue1').value = headers.value;
            // console.log(counter.counter_name);
        }

        //  alert("id " + request.key + " method " + request.result.method + "title:" + request.result.title + " url: " + request.result.url);
      }

      else {
         alert(key + " couldn't be found in your database!");
      }
   };
}

//TODO : delete in MongoDB
function deleteRequestInMongoDBSelfHosted(key) {
  alert("sync : delete request for id " + key);

  var xhr = new XMLHttpRequest();

  xhr.open('DELETE', 'http://localhost:3000/request/' + key, true);

  xhr.send();
}

function syncOfflinetoMongoDBSelfHosted(key, method, title, url, requestHeadersKey1, requestHeadersValue1) {

  alert("sync : id " + key + " method " + method + "title:" + title + " url: " + url + " headersKey1: " + requestHeadersKey1 + " headersValue1: " + requestHeadersValue1);
  var currentDateTime = new Date().getTime();

  var xhr = new XMLHttpRequest();

  xhr.open('POST', 'http://localhost:3000/request', true);

  xhr.setRequestHeader('Content-Type', 'application/json');

  var toServer = JSON.stringify(
    {
      id: key,
      method: method,
      title: title,
      url: url,
      authorization: {type: 'authorizationoption', key: 'httpBasicAuthUserName', value: 'httpBasicAuthPassword'},
      headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
      body: 'requestBody',
      description: 'requestDescription',
      dateCreated: 1488846301000,
      dateUpdated: currentDateTime
    }
  );

  xhr.send(toServer);

  // loadRequestList()
  reloadMenu()
  notifyClient(toServer)

}

function savetoMongoDBSelfHosted(key) {

  var currentDateTime = new Date().getTime();
  var requestIdActiveCheck = document.getElementById("requestIdActive").value;
  var requestIdActive;
  var isThisNewRequest = 0;
  if (requestIdActiveCheck) {
    requestIdActive = requestIdActiveCheck;
    var requestTitle = document.getElementById('editRequestTitle').value
  } else {
    // const uuidV4 = require('uuid/v4');
    // requestIdActive = uuidV4();
    requestIdActive = key;
    isThisNewRequest++;
    var requestTitle = document.getElementById('requestTitle').value;
    alert("savetoMongoDBSelfHosted function - requestTitle : " + requestTitle);
  }

  var urlRequest = document.getElementById("urlRequest").value;
  var httpMethod = document.getElementById("httpMethod").value;

  //auth info
  var authorizationoption = document.getElementById("authorizationoption").value;
  var httpBasicAuthUserName = document.getElementById("httpBasicAuthUserName").value;
  var httpBasicAuthPassword = document.getElementById("httpBasicAuthPassword").value;
  var httpAuth = window.btoa(httpBasicAuthUserName + ":" + httpBasicAuthPassword);

  //headers info
  var requestHeadersKey1 = document.getElementById("requestHeadersKey1").value;
  var requestHeadersValue1 = document.getElementById("requestHeadersValue1").value;

  var requestHeadersKey2 = document.getElementById("requestHeadersKey2").value;
  var requestHeadersValue2 = document.getElementById("requestHeadersValue2").value;

  var requestBody = document.getElementById("requestBody").value;
  var requestDescription = document.getElementById("editRequestDescription").value;

  if (requestDescription) {
    requestDescription = requestDescription;
  } else {
    requestDescription = document.getElementById("requestDescription").value;
  }

  // alert("savetoMongoDB function " + requestIdActive + httpMethod + requestTitle + urlRequest + httpBasicAuthUserName + httpBasicAuthPassword + requestHeadersKey1 + requestHeadersValue1 + requestBody + requestDescription);

  var xhr = new XMLHttpRequest();
  // var urlParam = "&q={'id': '" + requestIdActive + "'}&u=true";
  xhr.open('POST', 'http://localhost:3000/request', true);

  xhr.setRequestHeader('Content-Type', 'application/json');

  var toServer = JSON.stringify(
    {
      id: requestIdActive,
      method: httpMethod,
      title: requestTitle,
      url: urlRequest,
      authorization: {type: authorizationoption, key: httpBasicAuthUserName, value: httpBasicAuthPassword},
      headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
      body: requestBody,
      description: requestDescription,
      dateCreated: currentDateTime,
      dateUpdated: currentDateTime
    }
  );

  xhr.send(toServer);

  alert("isThisNewRequest : " + isThisNewRequest)
  // loadRequestList()
  // reloadMenu()
  //TODO : if update, no need to load new row in menu but replace/refresh the existing(effected) row
  if(isThisNewRequest>0) {
      menuLoadNewlyAddedRequest(requestIdActive)
  } else {
    alert("should refresh existing request in menu panel")
  }


  notifyClient(toServer)

}

/* save into MongoDB */
//this function need to be called after save into indexedDB when user clicked on the save button
function savetoMongoDB() {

  var start = new Date().getTime();
  var requestIdActive = document.getElementById("requestIdActive").value;
  if (requestIdActive) {
    requestIdActive = requestIdActive;
  } else {
    const uuidV4 = require('uuid/v4');
    var requestIdActive = uuidV4();
  }

  var urlRequest = document.getElementById("urlRequest").value;
  var httpMethod = document.getElementById("httpMethod").value;
  // var requestTitle = document.getElementById('requestTitleActive').value
  var requestTitle = document.getElementById('editRequestTitle').value

  //auth info
  var authorizationoption = document.getElementById("authorizationoption").value;
  var httpBasicAuthUserName = document.getElementById("httpBasicAuthUserName").value;
  var httpBasicAuthPassword = document.getElementById("httpBasicAuthPassword").value;
  var httpAuth = window.btoa(httpBasicAuthUserName + ":" + httpBasicAuthPassword);

  //headers info
  var requestHeadersKey1 = document.getElementById("requestHeadersKey1").value;
  var requestHeadersValue1 = document.getElementById("requestHeadersValue1").value;

  var requestHeadersKey2 = document.getElementById("requestHeadersKey2").value;
  var requestHeadersValue2 = document.getElementById("requestHeadersValue2").value;

  var requestBody = document.getElementById("requestBody").value;
  var requestDescription = document.getElementById("editRequestDescription").value;

  if (requestDescription) {
    requestDescription = requestDescription;
  } else {
    requestDescription = document.getElementById("requestDescription").value;
  }

  alert("savetoMongoDB function " + requestIdActive + httpMethod + requestTitle + urlRequest + httpBasicAuthUserName + httpBasicAuthPassword + requestHeadersKey1 + requestHeadersValue1 + requestBody + requestDescription);

  var xhr = new XMLHttpRequest();
  var urlParam = "&q={'id': '" + requestIdActive + "'}&u=true";
  xhr.open('PUT', 'https://api.mlab.com/api/1/databases/devdb/collections/requestlist?apiKey=PdXVo4d9e96rapRhfW9Cype-jWQoOGMi' + urlParam, true);

  xhr.setRequestHeader('Content-Type', 'application/json');

  var toServer = JSON.stringify(
    {
      id: requestIdActive,
      method: httpMethod,
      title: requestTitle,
      url: urlRequest,
      authorization: {type: authorizationoption, key: httpBasicAuthUserName, value: httpBasicAuthPassword},
      headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
      body: requestBody,
      description: requestDescription
    }
  );

  xhr.send(toServer);

  notifyClient(toServer);
}


/**** TEST *****/

//use el as param
function savetoMongoDBTestJSFuncParam(el) {

  var requestIdActive = document.getElementById("requestIdActive").value;
  var urlRequest = document.getElementById("urlRequest").value;
  alert("requestIdActive " + requestIdActive + " urlRequest " + urlRequest);

}

//not using anything
function savetoMongoDBTestJSFuncParam() {

  var requestIdActive = document.getElementById("requestIdActive").value;
  var urlRequest = document.getElementById("urlRequest").value;
  alert("requestIdActive " + requestIdActive + " urlRequest " + urlRequest);

}

//use requestIdActive as param
function savetoMongoDBTestJSFuncParam2(requestIdActive, urlRequest) {

  alert("requestIdActive " + requestIdActive + " urlRequest " + urlRequest);

}

function addTest(el) {

  var requestIdActive = document.getElementById("requestIdActive").value;
  alert("addTest function " + requestIdActive);

  if (requestIdActive) {
    alert("My input has a value!");
  }

}
