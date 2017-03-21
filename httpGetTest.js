function GetSelectedItem(el) {
  var start = new Date().getTime();
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

  // alert(httpBasicAuthUserName + " " + httpBasicAuthPassword + " " + authorizationoption  + " " + httpAuth);
  // alert(requestHeadersKey1 + " " + requestHeadersValue1 + " " + requestHeadersKey2 + " " + requestHeadersValue2 + " " + requestBody);

  var xhr = new XMLHttpRequest();

  // var httpAuth = httpBasicAuthUserName + ":" + httpBasicAuthPassword;
  // var buffer = new Buffer(httpAuth);

  xhr.open(httpMethod, urlRequest, true);
  // xhr.setRequestHeader('X-Auth-Token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwZjI4N2VkOC1iM2E2LTQwZmQtYjU5Yy1kZjE2M2Q1MDNlZTYiLCJuYW1lIjoiSm9obiBEb2UiLCJhZG1pbiI6dHJ1ZSwianRpIjoiNDJiMTJkMzUtOTRmZC00Mjk3LWJiMTgtZTYwNDBkN2I3OTMyIiwiaWF0IjoxNDc3NDQ4Nzc0LCJleHAiOjE1NzY2ODgxMDUsImF0cCI6ImF1dGhlbnRpY2F0aW9uIn0.KH17PxFQ73VMJNyrTJGBIko7JKaOAzr3Qtdi0jG1Fl0');
  xhr.setRequestHeader("Authorization", authorizationoption + " " + httpAuth);
  // xhr.setRequestHeader("Authentication", "Basic", window.btoa("8w="));
  // xhr.setRequestHeader("Authentication", "Basic", buffer);
  xhr.setRequestHeader(requestHeadersKey1, requestHeadersValue1);
  xhr.setRequestHeader(requestHeadersKey2, requestHeadersValue2);
  xhr.send();

  xhr.onreadystatechange = processRequest;

  function processRequest(e) {
    // var response = xhr.responseText;
    var responseParse = JSON.parse(xhr.responseText);
    // var responseBeautify = JSON.stringify(response, null, "\t");
    // var response = JSON.stringify(xhr.responseText, null, "\t");

    /* JSON beautify - WIP */
    if (!library)
			var library = {};

    library.json = {
						replacer: function(match, pIndent, pKey, pVal, pEnd) {
						var key = '<span class=json-key>';
						var val = '<span class=json-value>';
						var str = '<span class=json-string>';
            var num = '<span class=json-number>';
						var r = pIndent || '';

						if (pKey)
							 r = r + key + '"' + pKey.replace(/[": ]/g, '') + '"' + '</span>: ';
						if (pVal)
							 r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
          //  if (pVal)
 				// 			 r = r + (pVal[0] == /[0-9]/g ? num : val) + pVal + '</span>';
						return r + (pEnd || '');
						},
						prettyPrint: function(obj) {
						var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?([0-9])?$/mg;
						return JSON.stringify(obj, null, 3)
							 .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
							 .replace(/</g, '&lt;').replace(/>/g, '&gt;')
              //  .replace(/\,/g, ', <br>')
              //  .replace(/([\{\}])/g, '$1')
              // .replace(/(\{)/g, '{ \n')
							 .replace(jsonLine, library.json.replacer);
						}
					};

          // var account = { active: true, codes: [48348, 28923, 39080], city: "London" };
					// var responseBody = library.json.prettyPrint(account);

    var responseBody = library.json.prettyPrint(responseParse);


    // if (xhr.readyState == 4 && xhr.status == 200) {
      // alert("inside processRequest() if");

        // var response = JSON.parse(xhr.responseText);
        // var responseBody = xhr.responseText;
        var responseStatus = xhr.status + " " + xhr.statusText;
        // var response = JSON.stringify(xhr.responseText, null, 4);
        // var responseCacheControl = xhr.getResponseHeader("Cache-Control");

        responseCacheControl.innerHTML = xhr.getResponseHeader("Cache-Control");
        responseConnection.innerHTML = xhr.getResponseHeader("Connection");
        responseContentType.innerHTML = xhr.getResponseHeader("Content-Type");
        responseDateTime.innerHTML = xhr.getResponseHeader("Date");
        responseServer.innerHTML = xhr.getResponseHeader("Server");
        responseLocation.innerHTML = xhr.getResponseHeader("Location");

        httpResponseStatus.innerHTML = responseStatus;
        httpResponseTime.innerHTML = (Date.now() - start) + " ms";
        httpResponseBody.innerHTML = responseBody;
        // httpResponseBody.innerHTML = library.json.prettyPrint(responseBody);
        // httpResponseBody.html = jsonPrettyPrint.toHtml(responseBody);
        // httpResponseBody.innerHTML = jsonPrettyPrint(responseBody);

        // var vega = require('vega.js');
        // vega.hello();

    // }
  }
  //save into history table
  addHistory(httpMethod, urlRequest, requestBody, requestHeadersKey1, requestHeadersValue1);

}

function httpGetJS(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://google.com", false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function hello() {
  console.log("Hello World");
  alert("I am an alert box!");
}

function getWhatIWant() {
  var request = require("request");

  request("http://www.sitepoint.com", function(error, response, body) {
    console.log(body);
  });
}

/* save into MongoDB */
//this function need to be called after save into indexedDB when user clicked on the save button
function savetoMongoDB(el) {

  var start = new Date().getTime();
  var requestIdActive = document.getElementById("requestIdActive").value;
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

  var xhr = new XMLHttpRequest();
  xhr.open('PUT', 'https://api.mlab.com/api/1/databases/devdb/collections/requestlist?apiKey=PdXVo4d9e96rapRhfW9Cype-jWQoOGMi&q={\'id\': \'776582a7-a9fc-4a06-8713-79fb0813b144\}&u=true', true);

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(
    JSON.stringify(
      {
        id: requestIdActive,
        method: httpMethod,
        title: requestTitle,
        url: urlRequest,
        authorizationoption: {key: httpBasicAuthUserName, value: httpBasicAuthPassword},
        headers: [{key : requestHeadersKey1, value: requestHeadersValue1}],
        body: requestBody
    }
    )
  );

}
