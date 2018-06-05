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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // app.receivedEvent('deviceready');
        // app.openGellery();
        // app.openCamera();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    },
    openCamera : function(){
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 20,
            destinationType: Camera.DestinationType.FILE_URL
        });
        function onSuccess(imageData){
            imageData = "data:image/png;base64," + imageData;
            user = localStorage.getItem('platuser');
            $("#profile_image").attr("src", imageData);

            $.ajax({
                url: 'http://platterexoticfood.com/pladmin/manage_api/cust_profile_image',
                method: 'post',
                dataType: 'JSON',
                data: { user: user, image: imageData }
            }).done(function (res) {
                if (!res.success) {
                    window.plugins.toast.show('Failed because: ' + res.message, 'long', 'bottom', function (a) { }, function (b) { });
                }
            }).fail();
        }

        function onFail(message){
            window.plugins.toast.showLongBottom('Failed because: ' + message);
        }
    },
    openGellery : function() {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            destinationType: Camera.DestinationType.FILE_URI
        });
        function onSuccess(imageData) {
            imageData = "data:image/png;base64," + imageData;
            user = localStorage.getItem('platuser');
            $("#profile_image").attr("src", imageData);

            $.ajax({
                url: 'http://platterexoticfood.com/pladmin/manage_api/cust_profile_image',
                method: 'post',
                dataType: 'JSON',
                data: { user: user, image: imageData }
            }).done(function (res) {
                if (!res.success) {
                    window.plugins.toast.show('Failed because: ' + res.message, 'long', 'bottom', function (a) { }, function (b) { });
                }
            }).fail();
        }

        function onFail(message) {
            window.plugins.toast.showLongBottom('Failed because: ' + message);
        }
    }
    
};
function swipperminus(value) {
    let curretn_value = $('#' + value).html();
    if (curretn_value!=0)
    {
        curretn_value = parseInt(curretn_value)-1;
    }
    else{
        curretn_value =0;
    }
    $('#' + value).html(curretn_value);
    // console.log(curretn_value);

}

function swipperadd(value) {
    let curretn_value = $('#' + value).html();
    curretn_value = parseInt(curretn_value)+1;
    // if (curretn_value != 0) {
    //     curretn_value = curretn_value - 1;
    // }
    // else {
    //     curretn_value = 0;
    // }
    $('#' + value).html(curretn_value);
    // console.log(curretn_value);
}

