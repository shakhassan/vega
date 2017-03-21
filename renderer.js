// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const TabGroup = require('electron-tabs');
let tabGroup = new TabGroup();
let tab = tabGroup.addTab({
    title: "New Tab",
    src: "http://electron.atom.io",
    // src: "/Users/rjirwanshah/WinApp/electron/vega/index.html"
    visible: true
});

// let webview = tab.webview;
// webview.loadURL("http://google.com");
