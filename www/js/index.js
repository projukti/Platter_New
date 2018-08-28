/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
function handleOpenURL(url) {
    alert("received url: " + url);
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", this.checkConnection, false);
        document.addEventListener("online", this.onDeviceReady, true);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        document.querySelector('.wait').classList.remove('wait');
       document.querySelector('.wait').classList.remove('wait');
        FCMPlugin.onNotification(function(data) {
            if (data.wasTapped) {
                //localStorage.setItem('order_id', data.noti_id);
                app.openPageOrderListing;
            } else {
                //Notification was received in foreground. Maybe the user needs to be notified.
                app.openPageOrderListing;
            }
        });
        var user = localStorage.getItem('platuser');
        if (user != '') {
            $.ajax({
                url: "http://platterexoticfood.com/pladmin/manage_api/can_login_direct",
                method: "POST",
                dataType: "JSON",
                data: { mobile: user }
            }).done(function(rply) {
                if (rply.success) {
                    FCMPlugin.getToken(function(token) {
                        if (token) {
                            $.ajax({
                                url: "http://platterexoticfood.com/pladmin/manage_api/update_token",
                                method: "POST",
                                dataType: "JSON",
                                data: { mobile: user, token: token }
                            }).done(function(res) {
                                localStorage.setItem('newtoken', token);
                                app.fadeTo('getlocation.html', 3000);
                            })
                        } else {
                            app.fadeTo('getlocation.html', 3000);
                        }
                    });

                } else {
                    app.fadeTo('login.html', 3000);
                }
            }).fail(function(err) {
                if (navigator.app) {
                    window.plugins.toast.showLongBottom('No internet connection detected');
                    $('.splashscreen').hide();
                    $('.noInternet').show();
                } else if (navigator.device) {
                    window.plugins.toast.showLongBottom('No internet connection detected');
                    $('.splashscreen').hide();
                    $('.noInternet').show();
                }
            });
        } else {
            app.slideTo('login.html', 'up', 3000);
        }

    },
    slideTo: function(page, direction, delayInMS) {
        var options = {
            "direction": direction, // 'left|right|up|down', default 'left' (which is like 'next')
            "duration": 500, // in milliseconds (ms), default 400
            "slowdownfactor": 3, // overlap views (higher number is more) or no overlap (1). -1 doesn't slide at all. Default 4
            "slidePixels": 20, // optional, works nice with slowdownfactor -1 to create a 'material design'-like effect. Default not set so it slides the entire page.
            "iosdelay": 100, // ms to wait for the iOS webview to update before animation kicks in, default 60
            "androiddelay": 150, // same as above but for Android, default 70
            "winphonedelay": 250, // same as above but for Windows Phone, default 200,
            "fixedPixelsTop": 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
            "fixedPixelsBottom": 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
            "href": page
        };
        setTimeout(function() {
            window.plugins.nativepagetransitions.slide(
                options,
                function(msg) {
                    console.log("success: " + msg)
                }, // called when the animation has finished
                function(msg) {
                    console.log("error: " + msg)
                } // called in case you pass in weird values
            );
        }, delayInMS);
    },
    fadeTo: function(page, delayInMS) {
        var options = {
            "duration": 500, // in milliseconds (ms), default 400
            "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
            "androiddelay": 100,
            "href": page
        };
        setTimeout(function() {
            window.plugins.nativepagetransitions.fade(
                options,
                function(msg) {
                    console.log("success: " + msg)
                }, // called when the animation has finished
                function(msg) {
                    console.log("error: " + msg)
                } // called in case you pass in weird values
            );
        }, delayInMS);
    },
    flipTo: function(page, direction, delayInMS) {
        var options = {
            "direction": direction, // 'left|right|up|down', default 'right' (Android currently only supports left and right)
            "duration": 500, // in milliseconds (ms), default 400
            "iosdelay": 50, // ms to wait for the iOS webview to update before animation kicks in, default 60
            "androiddelay": 100, // same as above but for Android, default 70
            "winphonedelay": 150, // same as above but for Windows Phone, default 200
            "href": page
        };
        setTimeout(function() {
            window.plugins.nativepagetransitions.flip(
                options,
                function(msg) {
                    console.log("success: " + msg)
                }, // called when the animation has finished
                function(msg) {
                    console.log("error: " + msg)
                } // called in case you pass in weird values
            );
        }, delayInMS);
    }
};

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    alert(1);
    window.plugins.toast.showLongBottom('No internet connection detected');
    $('.splashscreen').hide();
    $('.noInternet').show();

}
function handleOpenURL(url) {
    console.log("received url: " + url);
}