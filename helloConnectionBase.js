
var fs = require('fs');

var iot = {};

//importing aws iot library

var awsIot = require('aws-iot-device-sdk');

var myThingName = 'Raspi3_2';

var duino = require( 'iotduino'),
    pinMode = duino.PinMode, pinState = duino.PinState,
    pins = duino.Pins, 
    bluePin = pins.GPIO12,
    greenPin = pins.GPIO11,
    redPin = pins.GPIO10,
    ldrPin = pins.A4;

// pin GPIO SET

duino.pinMode( ldrPin, pinMode.INPUT);

duino.pinMode( bluePin, pinMode.OUTPUT);
duino.pinMode( greenPin, pinMode.OUTPUT);
duino.pinMode( redPin, pinMode.OUTPUT);

 
//create thing shadows with keys and certs
var thingShadows = awsIot.thingShadow({
    keyPath: '/home/ubuntu/certs/61ab4d0910-private.pem.key',
    certPath: '/home/ubuntu/certs/61ab4d0910-certificate.pem.crt',
    caPath: '/home/ubuntu/certs/VeriSign.pem',
    clientId: myThingName,
    region: 'us-west-2'
});


function setGPIO_blue(pin, ledMode){
	console.log("set GPIO" + ledMode);

    duino.digitalWrite( pin, ledMode);

    setTimeout( function() {
                    clientTokenIP = thingShadows.update(myThingName,{"state":{"reported":{"blueLed_mode":ledMode}}});
                    console.log("Update:" + clientTokenIP);
                }, 1000 );
}

function setGPIO_green(pin, ledMode){
    console.log("set GPIO" + ledMode);

    duino.digitalWrite( pin, ledMode);

    setTimeout( function() {
                    clientTokenIP = thingShadows.update(myThingName,{"state":{"reported":{"greenLed_mode":ledMode}}});
                    console.log("Update:" + clientTokenIP);
                }, 1000 );
}

function setGPIO_red(pin, ledMode){
    console.log("set GPIO" + ledMode);

    duino.digitalWrite( pin, ledMode);

    setTimeout( function() {
                    clientTokenIP = thingShadows.update(myThingName,{"state":{"reported":{"redLed_mode":ledMode}}});
                    console.log("Update:" + clientTokenIP);
                }, 1000 );
}

function getGPIO(){
	return process.argv[2];
}

//thingshadows.update
var clientTokenUpdate;
var myCallbacks = {};

//state of GPIO
var initialPumpState = getGPIO();
console.log("Pumpa is "+initialPumpState);

//build current reported state
var pumpState = {"state":{"reported":{"blueLed_mode":0}}};
console.log(JSON.stringify(pumpState))


var sensorRead = {"state":{"reported":{"analogRead":"343"}}};

//handle thingShadow events

thingShadows.on('connect', function() {

    console.log("Connected...");

    thingShadows.register( myThingName );

// An update right away causes a timeout error, so we wait about 2 seconds

    setTimeout( function() {

        console.log("Updating my IP address...");

//        clientTokenIP = thingShadows.update(myThingName, ledOff);
	    clientTokenIP = thingShadows.update(myThingName, pumpState);


        console.log("Update:" + clientTokenIP);


        loopa();


    }, 2500 );



thingShadows.on('status',

        function(thingName, stat, clientToken, stateObject) {

            console.log('status received '+stat+' on '+thingName+': '+

                JSON.stringify(stateObject));

        });


//shadow accepted/rejected msg received
    thingShadows.on('update',

        function(thingName, stateObject) {

            console.log('received update '+' on '+thingName+': '+

                JSON.stringify(stateObject));

        });

    thingShadows.on('delta',

        function(thingName, stateObject) {

            //BLUE
            if (stateObject.state.blueLed_mode === 1) {

                console.log("blue ledStatus change ON");

                setGPIO_blue(bluePin, 1);
            }else if (stateObject.state.blueLed_mode === 0) {
                
                console.log("blue ledStatus change OFF");

                setGPIO_blue(bluePin ,0);
            }

            //GREEN
            
            if (stateObject.state.greenLed_mode === 1) {

                console.log("blue ledStatus change ON");

                setGPIO_green(greenPin, 1);
            }else if (stateObject.state.greenLed_mode === 0) {
                
                console.log("blue ledStatus change OFF");

                setGPIO_green(greenPin ,0);
            }

            //RED

            if (stateObject.state.redLed_mode === 1) {

                console.log("red ledStatus change ON");

                setGPIO_red(redPin, 1);
            }else if (stateObject.state.redLed_mode === 0) {
                
                console.log("red ledStatus change OFF");

                setGPIO_red(redPin ,0);
            }

        });

    thingShadows.on('timeout',

        function(thingName, clientToken) {

            console.log('received timeout for '+ clientToken)

        });

    thingShadows

        .on('close', function() {

            console.log('close');

        });

    thingShadows

        .on('reconnect', function() {

            console.log('reconnect');

        });

    thingShadows

        .on('offline', function() {

            console.log('offline');

        });

    thingShadows

        .on('error', function(error) {

            console.log('error', error);

        });

//trigger, 
   var util = require('util');

    process.stdin.on('data', function (text) {
    console.log('received data:', util.inspect(text));

    clientTokenIP = thingShadows.update(myThingName, sensorRead);

    console.log("Update:" + clientTokenIP);

    duino.digitalWrite( bluePin, !duino.digitalRead( bluePin));

    if (text === 'quit\n') {
      done();
    }
   });

});




function loopa()
{

        // repeat every 500 milliseconds, 2 times per second
    setInterval( function () { 

      console.log("yatusa");

      valuu = duino.analogRead(ldrPin);

      console.log(valuu);


      //send val to platform

        composedStrVal = {"state":{"reported":{"ldr":valuu}}}


        clientTokenIP = thingShadows.update(myThingName, composedStrVal);





    }, 4000);

}


module.exports = iot;
