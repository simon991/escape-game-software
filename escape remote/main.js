const { app, BrowserWindow } = require('electron');
var os = require('os');
//import { SocketServer } from "./socket-server";
const Server = require('socket.io');
const io = new Server(8080);
let win;

io.on('connect', onConnect);
var socketConnections = 0;
function onConnect(socket){
  socketConnections++;
  if (socketConnections == 1) {console.log("Control connected");createWindow(); ipWindow.close()} else {console.log("Remote connected");}
  socket.on('settime', onSetTime);
  socket.on('resetCountdown', onResetCountdown);
  socket.on('pauseCountdown', onPauseCountdown);
  socket.on('startCountdown', onStartCountdown);
  socket.on('textMessage', onTextMessage);

}

function onResetCountdown(data){
  io.emit('resetCountdown', data);
}function onPauseCountdown(data){
  io.emit('pauseCountdown', data);
}function onStartCountdown(data){
  io.emit('startCountdown', data);
}function onSetTime(timerTime){
  io.emit('settime', timerTime);
}function onTextMessage(textMessage){
  io.emit('textMessage', textMessage);
}


var ipWindow;
function getIp() {
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  console.log(addresses);

  /* render a window to show the ip address*/
  ipWindow = new BrowserWindow({
    /*  webPreferences: {
     webSecurity: false
     },*/
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`
  });
  ipWindow.setFullScreen(true);
  ipWindow.setMenu(null);

  // create BrowserWindow with dynamic HTML content
  var html = [
    "<body>",
    '<h1>' + addresses + '</h1>',
    "</body>",
  ].join("");
  ipWindow.loadURL("data:text/html;charset=utf-8," + encodeURI(html));


  //// uncomment below to open the DevTools.
  // ipWindow.webContents.openDevTools();

  // Event when the window is closed.
  ipWindow.on('closed', function () {
    ipWindow = null;
  });

}


function createWindow () {

  // Create the browser window.
  win = new BrowserWindow({
  /*  webPreferences: {
      webSecurity: false
    },*/
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`
  });
  win.setFullScreen(true);


  win.loadURL(`file://${__dirname}/dist/index.html`)
  win.setMenu(null);

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null;
  })
}

// Create window on electron intialization
app.on('ready', getIp)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})
