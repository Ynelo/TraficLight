 // Настраиваем интерфейс UART
PrimarySerial.setup(115200);

var myRelay_gr = require('@amperka/relay').connect(P3);
var myRelay_re2 = require('@amperka/relay').connect(P9);
//var buzzer = require('@amperka/buzzer').connect(A1);

//buzzer.frequency(600);

myRelay_re2.turnOff();
myRelay_gr.turnOff();
//buzzer.turnOff();
//var erorr;
var sdCard = require('@amperka/card-reader').connect(P8);
var ff = sdCard.readDir();
console.log(ff);
var path = sdCard.readFile('pyte2.txt');
console.log(path);

function erortxt() {  
var erorr = sdCard.readFile('error.txt');
  
  if(erorr === "ok")
  { 
    print('no_write');
  }
  else
  {
    sdCard.writeFile('error.txt', 'ok');
  }
}

 
// логин и пароль WiFi-сети
var SSID = "NADYA";//sdCard.readFile('SSID.txt');
var PSWD = "OnitListRu1";//sdCard.readFile('PSWD.txt'); 

function resetAll(err){ 
  if (err === 1)
  {
    //нет wifi при инициализации
      sdCard.writeFile('error.txt', "нет wifi при инициализации:"+err);
         
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
        // нет wifi при чтении
        sdCard.writeFile('error.txt', "нет wifi при чтении:"+err);
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
        // нет wifi при чтении
        sdCard.writeFile('error.txt', "не получен ответ:"+err);
   
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
    // подключаемся к Wi-Fi сети
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
    // Выполняем запрос
 
   http.get(path, function(res)
  {
      var response = '';
      res.on('data', function(d) { response += d; });    
      res.on('close', function() {        
        sdCard.writeFile('status.txt', response);
        print(response);
       
        //здесь код светофора
        myRelay_re2.turnOff();
myRelay_gr.turnOff();
//buzzer.turnOff();
 print(response);
        if (response==="1")
        {
           print(response);
         erortxt();
                  myRelay_gr.turnOff();
              myRelay_re2.turnOff();

                  myRelay_re2.turnOn();
  
       }else if (response==="0"){
          erortxt();
       //    print(response);
         myRelay_gr.turnOff();
              myRelay_re2.turnOff(); 
        // buzzer.turnOff();
               myRelay_gr.turnOn();
          
       }else if (response==="2") {
         // print(response);
         erortxt();
            myRelay_gr.turnOff();
              myRelay_re2.turnOff(); 
         myRelay_gr.blink(1, 5);
                 
         }else if (response==="off"){
           myRelay_re2.turnOff();

           
       }  else {
        // print("error:"+response);
        erortxt();

         resetAll(3);

          
        
          //от искры пишем что что-то не то пришло и пишем в файл error.txt что пришло в response
       }
      });
      
    });
  //});
   print("mm");
  },30000);
              //});

//const fs =  require('@amperka/fs').connect();

//fs.writeFileSync("f.txt","1");
//var sss = fs.readFileSync('f.txt');
//console.log(sss);
//}, 1000);