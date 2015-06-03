//TODO chaos besiitige mit ng-hide.. momentan isch d sidebar immer visible wär connected=true als default..
// wiso wird d funktion nöd ufgruefe bimne connect/disconnect wommer ni selber macht?
// ez mummer immr vo hand zwüschet de asichte wächsle..

var app = angular.module('StudRTC', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);

app.config(function($routeProvider){
    $routeProvider.when('/',	    {templateUrl: 'home.html'});
    $routeProvider.when('/connect',	    {templateUrl: 'connect.html'});
	
});


app.controller('RTCController', function($rootScope, $scope){


    console.log('rtc controller');
    $scope.hide = {connect : false, call : true, transfer : true};
    $scope.connectedId = false;//haaaa a gagaggagagag
    $scope.showConnect = function() {
        console.log('showConnect');
        $scope.hide.connect = false;
        $scope.hide.call = true;
        $scope.hide.transfer = true;
        $scope.$apply()
    };
    $scope.showCall = function() {
        console.log('showCall');
        $scope.hide.connect = true;
        $scope.hide.call = false;
        $scope.hide.transfer = true;
        $scope.$apply()
    };
    $scope.showTransfer =function() {
        console.log('showTransfer');
        $scope.hide.connect = true;
        $scope.hide.call = true;
        $scope.hide.transfer = false;
        $scope.$apply()
    };


    $scope.start = function(){
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Generate Random Number if Needed
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        var urlargs         = urlparams();
        var my_number       = PUBNUB.$('my-number');
        var my_link         = PUBNUB.$('my-number-link');
        var number          = urlargs.number || Math.floor(Math.random()*999+1);

        my_number.number    = number;
        my_number.innerHTML = ''+my_number.number;
        my_link.href        = location.href.split('?')[0] + '?call=' + number;
        my_link.innerHTML   = my_link.href;

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Update Location if Not Set
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        if (!('number' in urlargs)) {
            urlargs.number = my_number.number;
            location.href = urlstring(urlargs);
            return
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Get URL Params
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function urlparams() {
            var params = {};
            if (location.href.indexOf('?') < 0) return params;

            PUBNUB.each(
                location.href.split('?')[1].split('&'),
                function(data) { var d = data.split('='); params[d[0]] = d[1]; }
            );

            return params;
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Construct URL Param String
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function urlstring(params) {
            return location.href.split('?')[0] + '?' + PUBNUB.map(
                    params, function( key, val) { return key + '=' + val }
                ).join('&');
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Calling & Answering Service
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        var video_out = PUBNUB.$('video-display');
        var img_out   = PUBNUB.$('video-thumbnail');
        var video_self  = PUBNUB.$('video-self');

        var phone = window.phone = PHONE({
            number        : my_number.number,
            publish_key   : 'pub-c-7a825a6c-cb59-49d5-99d2-68e274f322dc',
            subscribe_key : 'sub-c-f0922dba-e1e0-11e4-9766-0619f8945a4f',
            media         : { audio : true, video : true },
            ssl           : true
        });

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Video Session Connected
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function connected(session) {
            $scope.connectedId = true;
            $scope.$apply();
            $scope.showCall();

            //$scope.showCall();
            video_out.innerHTML = '';
            video_out.appendChild(session.video);

            PUBNUB.$('number').value = ''+session.number;
            console.log("Hi!");
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Video Session Ended
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function ended(session) {
            $scope.connectedId = false;
            $scope.$apply();
            $scope.showConnect();
            set_icon('bolt');
            img_out.innerHTML = '';
            console.log("Bye!");
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Video Session Ended
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function set_icon(icon) {
            video_out.innerHTML = '<span class="fa fa-' +
            icon + '"></span>';
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Request fresh TURN servers from XirSys
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function get_xirsys_servers() {
            var servers;
            $.ajax({
                type: 'POST',
                url: 'https://api.xirsys.com/getIceServers',
                data: {
                    room: 'default',
                    application: 'default',
                    domain: 'www.pubnub-example.com',
                    ident: 'pubnub',
                    secret: 'dec77661-9b0e-4b19-90d7-3bc3877e64ce'
                },
                success: function(res) {
                    res = JSON.parse(res);
                    if (!res.e) servers = res.d.iceServers;
                },
                async: false
            });
            return servers;
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Start Phone Call
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function dial(number) {
            $scope.showCall();
            $scope.connectedId = true;
            // Dial Number
            var session = phone.dial(number, get_xirsys_servers());

            // No Dupelicate Dialing Allowed
            if (!session) return;

            // Show Connecting Status
            set_icon('spinner fa-5x fa-spin');


        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Ready to Send or Receive Calls
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        phone.ready(function(){
            // Ready To Call
            set_icon('video-camera');
            //display video self
            video_self.innerHTML = '';
            video_self.appendChild(phone.video);

            // Auto Call
            if ('call' in urlargs) {
                var number = urlargs['call'];
                PUBNUB.$('number').value = number;
                dial(number);
                $scope.connectedId = true;
            }

            // Make a Phone Call
            $scope.dial = function() {
                $scope.connectedId = true;
                console.log('dial');
                var number = PUBNUB.$('number').value;
                if (!number) return;
                dial(number);
            };

            $scope.hangup = function() {
                $scope.connectedId = false;
                console.log('hangup');
                phone.hangup();
                set_icon('video-camera');
            };
			var globalType;
			var globalData;
            //file sending stuff
            var handleFileSelect = function (evt) {
                var files = evt.target.files;
                var file = files[0];
                var type = file.type;
                console.log(file.type);
                if (files && file) {
                    var reader = new FileReader();

                    reader.onload = function (readerEvt) {

                        var binaryString = readerEvt.target.result;

						globalType = type;
						globalData = btoa(binaryString);
						console.log("set global type to: "+globalType);
						console.log("set global data to: "+globalData);
                        //console.log("file: "+readerEvt.target.result);
                        //console.log('sent: '+btoa(binaryString));
                        //phone.send({type : type, file : btoa(binaryString) });
                    };

                    reader.readAsBinaryString(file);
                }
            };
			var handleSendFile = function(){
				console.log("sending: "+globalType+" with "+globalData);
                console.log(globalData.length);
                var progressBar = document.getElementById("sendProgress");
                //var chunkSize = 5000;
                var chunkSize = 10000;
                var progress = 0;
                var origSize = globalData.length;
                var chunkCount = Math.round(origSize / chunkSize);
                console.log("chunks to send: "+chunkCount);
                console.log(progressBar.style.width);
                progressBar.style.width = "0%";
                if (globalData.length > chunkSize) {
                    console.log("sending something big");
                    while (globalData.length > chunkSize) {
                        progress = Math.round(100/chunkCount);
                        progressBar.style.width = progress+"%";
                        //slice globalData
                        console.log('send...');
                        var sendData = globalData.substr(0, chunkSize);
                        globalData = globalData.slice(chunkSize);
                        console.log("still to send: "+globalData.length);
                        phone.send({type: globalType, file: sendData});//send callback
                    }
                    phone.send({type: globalType, file: globalData});
                    phone.send({type: "end"});
                    globalData = "";
                    console.log(globalData.length);
                    console.log("sent end");
                    progressBar.style.width = "100%";
                } else {
                    console.log("sending something small");
                    phone.send({type: globalType, file: globalData});
                    phone.send({type: "end"});
                    globalData = "";
                    console.log(globalData.length);
                    console.log("sent end");
                    progressBar.style.width = "100%";
                }


			};

            if (window.File && window.FileReader && window.FileList && window.Blob) {
				document.getElementById('sendBtn').addEventListener('click', handleSendFile, false);
                document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

        });

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Received Call Thumbnail
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function thumbnail(session) {
            img_out.innerHTML = '';
            img_out.appendChild(session.image);
            img_out.appendChild(phone.snap().image);
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Receiver for Calls
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        phone.receive(function(session){
            set_icon('spinner fa-5x fa-spin');
            $scope.connectedId = true;
            $scope.$apply();
            $scope.showCall();
            session.message(message);
            session.thumbnail(thumbnail);
            session.connected(connected);
            session.ended(ended);
        });

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Chat
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        var chat_in  = PUBNUB.$('pubnub-chat-input');
        var chat_out = PUBNUB.$('pubnub-chat-output');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Send Chat MSG and update UI for Sending Messages
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        PUBNUB.bind( 'keydown', chat_in, function(e) {
            if ((e.keyCode || e.charCode) !== 13)     return true;
            if (!chat_in.value.replace( /\s+/g, '' )) return true;

            phone.send({ text : chat_in.value });
            add_chat( my_number.number + " (Me)", chat_in.value );
            chat_in.value = '';
        } );

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Update Local GUI
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function add_chat( number, text ) {
            if (!text.replace( /\s+/g, '' )) return true;

            var newchat       = document.createElement('div');
            newchat.innerHTML = PUBNUB.supplant(
                '<strong>{number}: </strong> {message}', {
                    message : safetxt(text),
                    number  : safetxt(number)
                } );
            chat_out.insertBefore( newchat, chat_out.firstChild );
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// WebRTC Message Callback
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        var fileString ="";
        function message( session, message ) {
            if(message.text){
                add_chat( session.number, message.text );
            } else if (message.file || (message.type = "end")){
                console.log("got a message");
                console.log("file: "+message.file);
                console.log("type: "+message.type);
                if(message.type != "end"){
                    fileString += message.file+"";
                    console.log("added: "+message.file);
                } else {
                    //var blob = b64toBlob(message.file, contentType);
                    var blob = b64toBlob(fileString,  message.type);
                    var blobUrl = URL.createObjectURL(blob);
                    fileString = "";
                    //window.location = blobUrl;
                    window.open(blobUrl);
                }

            }
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// XSS Prevent
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function safetxt(text) {
            return (''+text).replace( /[<>]/g, '' );
        }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Problem Occured During Init
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        phone.unable(function(details){
            console.log("Alert! - Reload Page.");
            console.log(details);
            set_icon('times');
        });

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Debug Output
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        phone.debug(function(details){
            //console.log(details);
        });

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Base64 decoder
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {type: contentType});
            //var blob = new Blob(byteArrays);
            return blob;
        }


    };
});
