// Check if Browser supports the Worker api.

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

      var offlineDataRetValue = readAllOffline();
      // webworkerId.innerHTML = "number of offline data : " + offlineDataRetValue;
    }

  }
}
