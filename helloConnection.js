
var fs = require('fs');

var iot = {};

//importing aws iot library

var awsIot = require('aws-iot-device-sdk');

var myThingName = 'pcduino1';



 
//create thing shadows with keys and certs
var thingShadows = awsIot.thingShadow({
    keyPath: '/home/pi/certs/2fbc59ae26-private.pem.key',
    certPath: '/home/pi/certs/2fbc59ae26-certificate.pem.crt',
    caPath: '/home/pi/certs/ca.pem',
    clientId: myThingName,
    region: 'us-east-1'
});



//thingshadows.update
var clientTokenUpdate;
var myCallbacks = {};



//handle thingShadow events

thingShadows.on('connect', function() {

    console.log("Connected...");

    thingShadows.register( myThingName );




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




 

});






module.exports = iot;
