// Check if Browser supports the Worker api.

//global configuration json file
var config = require('./config.json');
var sync = config.sync;
// alert("config : sync is " + sync);

function webWorker(condition) {
  if (window.Worker) {
    // alert("web worker available!");
    // webworkerId.innerHTML = 'checking offline data..';
    // webworkerId.innerHTML = condition;

    if(condition === 'no connection') {
      webworkerId.innerHTML = 'no connection. changes will not be synced to server';
    }

    if(condition === 'connected') {
      webworkerId.innerHTML = 'checking offline data...';

      if(sync === 'on') {
        var offlineDataRetValue = readAllOffline();
        // webworkerId.innerHTML = "number of offline data : " + offlineDataRetValue;
      } else {
          webworkerId.innerHTML = 'sync is not on, this will not be saved to server!';
      }

    }

  }
}
