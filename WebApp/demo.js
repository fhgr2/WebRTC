// 
// Here is how to define your module 
// has dependent on mobile-angular-ui
// 
var app = angular.module('WebAppProj', [
  'ngRoute',
  'mobile-angular-ui',
  
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
  // it is at a very beginning stage, so please be careful if you like to use
  // in production. This is intended to provide a flexible, integrated and and 
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like 
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

// 
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false' 
// in order to avoid unwanted routing.
// 
app.config(function($routeProvider) {
  $routeProvider.when('/',              {templateUrl: 'home.html', reloadOnSearch: false});
  $routeProvider.when('/call',          {templateUrl: 'studrtc/call.html', reloadOnSearch: false});
  $routeProvider.when('/oldcall',       {templateUrl: 'studrtc/index.html', reloadOnSearch: false}); 
  $routeProvider.when('/tabs',          {templateUrl: 'tabs.html', reloadOnSearch: false}); 
  $routeProvider.when('/accordion',     {templateUrl: 'accordion.html', reloadOnSearch: false}); 
  $routeProvider.when('/overlay',       {templateUrl: 'overlay.html', reloadOnSearch: false}); 
  $routeProvider.when('/login',         {templateUrl: 'login.html', reloadOnSearch: false});
  $routeProvider.when('/dropdown',      {templateUrl: 'dropdown.html', reloadOnSearch: false});
  $routeProvider.when('/drag',          {templateUrl: 'drag.html', reloadOnSearch: false});
  $routeProvider.when('/carousel',      {templateUrl: 'carousel.html', reloadOnSearch: false});
});

//
// `$drag` example: drag to dismiss   brauchen wir nicht
//
/* app.directive('dragToDismiss', function($drag, $parse, $timeout){
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem, attrs){
        var dismiss = false;

        $drag.bind(elem, {
          constraint: {
            minX: 0, 
            minY: 0, 
            maxY: 0 
          },
          move: function(c) {
            if( c.left >= c.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function(){
            elem.removeClass('dismiss');
          },
          end: function(c, undo, reset) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() { 
                scope.$apply(function() {
                  dismissFn(scope);  
                });
              }, 400);
            } else {
              reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create 
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function(){
  return {
    restrict: 'C',
    scope: {},
    controller: function($scope) {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function(){
        var newId = this.itemCount++;
        this.activeItem = this.itemCount == 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem == this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function(){
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();
      
      var zIndex = function(){
        var res = 0;
        if (id == carousel.activeItem){
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function(){
        return carousel.activeItem;
      }, function(n, o){
        elem[0].style['z-index']=zIndex();
      });
      

      $drag.bind(elem, {
        constraint: { minY: 0, maxY: 0 },
        adaptTransform: function(t, dx, dy, x, y, x0, y0) {
          var maxAngle = 15;
          var velocity = 0.02;
          var r = t.getRotation();
          var newRot = r + Math.round(dx * velocity);
          newRot = Math.min(newRot, maxAngle);
          newRot = Math.max(newRot, -maxAngle);
          t.rotate(-r);
          t.rotate(newRot);
        },
        move: function(c){
          if(c.left >= c.width / 4 || c.left <= -(c.width / 4)) {
            elem.addClass('dismiss');  
          } else {
            elem.removeClass('dismiss');  
          }          
        },
        cancel: function(){
          elem.removeClass('dismiss');
        },
        end: function(c, undo, reset) {
          elem.removeClass('dismiss');
          if(c.left >= c.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          } else if (c.left <= -(c.width / 4)) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          reset();
        }
      });
    }
  };
}); */


//
// For this trivial demo we have just a unique MainController 
// for everything
//
app.controller('MainController', function($rootScope, $scope){
  // *************************************
  // USE THIS TO DISPLAY CONTACTS-SIDEBAR ON LOGIN!
  // *************************************
  $scope.loggedIn = false;

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';


  // 
  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    alert('Congrats you scrolled to the end of the list!');
  }

  // 
  // Right Sidebar
  // 
  $scope.chatUsers = [
    { name: 'Carlos  Flowers', online: true },
    { name: 'Byron Taylor', online: true },
    { name: 'Jana  Terry', online: true },
    { name: 'Darryl  Stone', online: true },
    { name: 'Fannie  Carlson', online: true },
    { name: 'Holly Nguyen', online: true },
    { name: 'Bill  Chavez', online: true },
    { name: 'Veronica  Maxwell', online: true },
    { name: 'Jessica Webster', online: true },
    { name: 'Jackie  Barton', online: true },
    { name: 'Crystal Drake', online: false },
    { name: 'Milton  Dean', online: false },
    { name: 'Joann Johnston', online: false },
    { name: 'Cora  Vaughn', online: false },
    { name: 'Nina  Briggs', online: false },
    { name: 'Casey Turner', online: false },
    { name: 'Jimmie  Wilson', online: false },
    { name: 'Nathaniel Steele', online: false },
    { name: 'Aubrey  Cole', online: false },
    { name: 'Donnie  Summers', online: false },
    { name: 'Kate  Myers', online: false },
    { name: 'Priscilla Hawkins', online: false },
    { name: 'Joe Barker', online: false },
    { name: 'Lee Norman', online: false },
    { name: 'Ebony Rice', online: false }
  ];

/*   //
  // 'Forms' screen
  //  
  $scope.rememberMe = true;
  $scope.email = 'me@example.com';
  
  $scope.login = function() {
    alert('You submitted the login form');
  };

  // 
  // 'Drag' screen
  // 
  $scope.notices = [];
  
  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1) });
  }

  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  }; */
// gaaaah
$scope.loadrtc = function(){
console.log('1 started');
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Generate Random Number if Needed
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var urlargs         = urlparams();
var my_number       = PUBNUB.$('my-number');
var my_link         = PUBNUB.$('my-number-link');
var number          = urlargs.number || Math.floor(Math.random()*999+1);
console.log('2 started');
my_number.number    = number;
my_number.innerHTML = ''+my_number.number;
my_link.href        = location.href.split('?')[0] + '?call=' + number;
my_link.innerHTML   = my_link.href;
console.log('3 started');
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Update Location if Not Set -> funktioniert nicht mit router vom mobile angular ui zeugs
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
/*if (!('number' in urlargs)) {
    urlargs.number = my_number.number;
    location.href = urlstring(urlargs);
    return;
}*/
console.log('4 started');
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Get URL Params    funktioniert noch nicht
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
console.log('5 started');
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Construct URL Param String
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function urlstring(params) {
    return location.href.split('?')[0] + '?' + PUBNUB.map(
        params, function( key, val) { return key + '=' + val }
    ).join('&');
}
console.log('6 started');
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Calling & Answering Service
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var video_out = PUBNUB.$('video-display');
var img_out   = PUBNUB.$('video-thumbnail');
var img_self  = PUBNUB.$('video-self');

var phone     = window.phone = PHONE({
    number        : my_number.number, // listen on this line
    publish_key   : 'pub-c-7a825a6c-cb59-49d5-99d2-68e274f322dc',
    subscribe_key : 'sub-c-f0922dba-e1e0-11e4-9766-0619f8945a4f',
    ssl           : true
});
console.log('7 started');

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Video Session Connected
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function connected(session) {
    video_out.innerHTML = '';
    video_out.appendChild(session.video);

    PUBNUB.$('number').value = ''+session.number;
    //sounds.play('sound/hi');												auskommentiert weil Fehlermeldungen das sound nicht geladen werden konnte!
    console.log("Hi!");
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Video Session Ended
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function ended(session) {
    set_icon('facetime-video');
    img_out.innerHTML = '';
    //sounds.play('sound/goodbye');
    console.log("Bye!");
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Video Session Ended
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function set_icon(icon) {
    video_out.innerHTML = '<span class="glyphicon glyphicon-' +
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
            secret: 'dec77661-9b0e-4b19-90d7-3bc3877e64ce',
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
    // Dial Number
    var session = phone.dial(number, get_xirsys_servers());

    // No Dupelicate Dialing Allowed
    if (!session) return;

    // Show Connecting Status
    set_icon('send');
} 

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Ready to Send or Receive Calls
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
phone.ready(function(){
    // Ready To Call
    set_icon('facetime-video');

    // Auto Call
    if ('call' in urlargs) {
        var number = urlargs['call'];
        PUBNUB.$('number').value = number;
        dial(number);
    }

    // Make a Phone Call
    PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('dial'), function(){
        var number = PUBNUB.$('number').value;
        if (!number) return;
        dial(number);
    } );

    // Hanup Call
    PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('hangup'), function() {
        phone.hangup();
        set_icon('facetime-video');
    } );

    // Take Picture
    PUBNUB.bind( 'mousedown,touchstart', PUBNUB.$('snap'), function() {
        var photo = phone.snap();
        img_self.innerHTML = ' ';
        img_self.appendChild(photo.image);
        setTimeout( function() { img_self.innerHTML = ' ' }, 750 );
    } );
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
    session.message(message);
    session.thumbnail(thumbnail);
    session.connected(connected);
    session.ended(ended);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Chat
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var chat_in  = PUBNUB.$('pubnub-chat-input');
console.log("chat input");
var chat_out = PUBNUB.$('pubnub-chat-output');
console.log("chat output");

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Send Chat MSG and update UI for Sending Messages
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
PUBNUB.bind( 'keydown', chat_in, function(e) {
    if ((e.keyCode || e.charCode) !== 13)     return true;
	console.log("chat 1");
    if (!chat_in.value.replace( /\s+/g, '' )) return true;
	console.log("chat 2");
	
    phone.send({ text : chat_in.value });
	console.log("chat 3");
    add_chat( my_number.number + " (Me)", chat_in.value );
	console.log("chat 4");
    chat_in.value = '';
	console.log("chat 5");
} ); console.log("chat send");

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
	console.log("chat update");
} 

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// WebRTC Message Callback
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function message( session, message ) {
    add_chat( session.number, message.text );
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
    set_icon('remove');
    alert(':( Something went wrong! Does your system have a webcam and audiodevice connected?');
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Debug Output
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
phone.debug(function(details){
     console.log(details);
});

};



});
