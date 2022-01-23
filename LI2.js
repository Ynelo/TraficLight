PrimarySerial.setup(115200);

SPI2.setup({mosi:B15, miso:B14, sck:B13});

var myRelay_gr = require('@amperka/relay').connect(P3);
var myRelay_re2 = require('@amperka/relay').connect(P9);

var fs = require("fs");
E.connectSDCard(SPI2, P8 /*CS*/);

myRelay_re2.turnOff();
myRelay_gr.turnOff();

var path = fs.readFileSync("pyte2.txt");
console.log(path);

function erortxt() {
var erorr = fs.writeFileSync('error.txt');

  if(erorr === "ok")
  {
    print('no_write');
  }
  else
  {
    fs.writeFileSync('error.txt', 'ok');
  }
}

 
var SSID = fs.readFileSync("SSID.txt");
var PSWD = fs.readFileSync('PSWD.txt');

function resetAll(err){ 
  if (err === 1)
  {
    fs.writeFileSync('error.txt', "=5B wifi ?@8 8=8F80;870F88:"+err);
    myRelay_re2.turnOff();
    myRelay_gr.turnOff();
    myRelay_re2.blink(3);
    setTimeout(function() {
    myRelay_re2.blink(1);
  }, 4000);

    setTimeout(function() {
    myRelay_re2.blink(1);
  }, 5900);

  }
  else if (err == 2)
  {
    fs.writeFileSync('error.txt', "=5B wifi ?@8 GB5=88:"+err);
    myRelay_re2.turnOff();
    myRelay_gr.turnOff();
    myRelay_re2.blink(3);
    setTimeout(function() {
    myRelay_re2.blink(3);
  }, 4000);

    setTimeout(function() {
    myRelay_re2.blink(1);
  }, 8900);
  }
    else if (err == 3)
  {
    fs.writeFileSync('error.txt', "=5 ?>;CG5= >B25B:"+err);
    myRelay_re2.turnOff();
    myRelay_gr.turnOff();
    myRelay_re2.blink(1);
    setTimeout(function() {
       myRelay_re2.blink(1);
     }, 1500);
    setTimeout(function() {
    myRelay_re2.blink(1);
    }, 2700);
  }
}

var wifi = require('@amperka/wifi').setup(PrimarySerial, function(err) {

  if (err) {
      console.log("WiFi init error: "+err);
     resetAll(1);
   }
});

var http =  require('http');
myRelay_re2.turnOff();
myRelay_gr.turnOff();

setInterval(function () 
{
  var connected = true;
   wifi.connect(SSID, PSWD, function(err1) {
    if (err1) {
      connected = false;
      console.log("WiFi connect error: "+err1);
       resetAll(2);
     }
     else
     {
        print('Connected');
     }
   });

  if (!connected) {
    return;
  }

   http.get(path, function(res)
  {
    var response = '';
    res.on('data', function(d) { response += d; });
    res.on('close', function() {
    fs.writeFileSync('status.txt', response);
    print(response);
    myRelay_re2.turnOff();
    myRelay_gr.turnOff();
    print(response);
      if (response==="1"){
        print(response);
        erortxt();
        myRelay_gr.turnOff();
        myRelay_re2.turnOff();
        myRelay_re2.turnOn();
       }else if (response==="0"){
        erortxt();
        myRelay_gr.turnOff();
        myRelay_re2.turnOff();
        myRelay_gr.turnOn();
       }else if (response==="2") {
        erortxt();
        myRelay_gr.turnOff();
        myRelay_re2.turnOff();
        myRelay_gr.blink(1, 5);
        }else if (response==="off"){
        myRelay_re2.turnOff();
       }  else {
        erortxt();
        resetAll(3);
       }
      });
    });
  },30000);