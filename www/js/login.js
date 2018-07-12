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
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", this.checkConnection, false);
        document.addEventListener("online", this.onDeviceReady, true);
    },
    onDeviceReady: function () {
        localStorage.setItem('page', 'login');
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    },

    // This Function For Resend OTP
    resendOTP: function(){
        let mobile = localStorage.getItem('platuser');
        $('#btnResend').prop('disabled', true).text('Resending...');
        $.ajax({
            type: "POST",
            url: "http://platterexoticfood.com/pladmin/manage_api/resendOTP/",
            data: { mobile: mobile},
            dataType: "JSON"
        }).done(function (rply){
            $('#btnResend').prop('disabled', false).text('Resend');
            if (rply.success)
            {
                window.plugins.toast.showLongBottom('OTP send successfully');
            }
            else{
                window.plugins.toast.showLongBottom('Error!');
            }
        });
    },

    // This function For facebook login
    faceBookLogin : function(firstName){

    }

};

function register() {
    if ($('#phone2').val().length === 10) {
        mobile = $('#phone2').val();
        name = $('#name').val();
        email = $('#email').val();

        $('#btnRegister').prop('disabled', true).text('Sending OTP...');
        $.ajax({
            url: "http://platterexoticfood.com/pladmin/manage_api/save_user",
            type: "post",
            dataType: "JSON",
            data: { mobile: mobile, name: name, email: email }
        }).done(function (reply) {
            if (reply.success == 1) {
                OTP = reply.otp;
                localStorage.setItem('platuser', mobile);
                $('#signtitle').text('Verify OTP');
                $('#signgen').css('display', 'none');
                $('#signbtn').css('display', 'none');
                $('#signotp').css('display', 'block');

                $('#ms_timer').countdowntimer({
                    minutes: 0,
                    seconds: 10,
                    size: "lg"
                });
                // setTimeout(function () {
                //     $('#txtOTP').val(OTP);
                // }, 10000);
                // setTimeout(function () {
                //     verifyOTP();
                // }, 12000);
            } else {
                $('#btnRegister').prop('disabled', false).text('Register');
                window.plugins.toast.showLongBottom('Sorry ! Mobile Number Or Email already registered with us');
                // $('#btnRegister').prop('disabled', false).text('Register');
            }
        }).fail(function (err) {
            window.plugins.toast.showLongBottom('Please enter a valid mobile number!');
            $('#btnRegister').prop('disabled', false).text('Register');
        })
    } else {
        window.plugins.toast.showLongBottom('Please enter a valid mobile number!');
        $('#btnRegister').prop('disabled', false).text('Register');
    }
}

function verifyOTP() {

    $('#btnLogin').prop('disabled', true).text('Verifying OTP...');
    if ($('#txtOTP').val() == OTP) {
        mobile = localStorage.getItem('platuser');
        $('#btnLogin').prop('disabled', true).text('Logging in...');
        $.ajax({
            url: "http://platterexoticfood.com/pladmin/manage_api/do_login",
            type: "post",
            dataType: "JSON",
            data: { mobile: mobile }
        }).done(function (reply) {
            console.log(reply);
            localStorage.setItem('loginstat', 'yes');
            FCMPlugin.getToken(function (token) {
                if (token) {
                    console.log(token);
                    $.ajax({
                        url: "http://platterexoticfood.com/pladmin/manage_api/update_token",
                        method: "POST",
                        dataType: "JSON",
                        data: { mobile: mobile, token: token }
                    }).done(function (res) {
                        window.location.href = "getlocation.html";
                    })
                } else {
                    window.location.href = "getlocation.html";
                }
            });
        }).fail(function (err) {
            console.log(err);
        });
    } else {
        window.plugins.toast.showLongBottom('OTP Mismatch. Please Verify Again ..');
        $('#txtOTP').attr('placeholder', 'Enter 4-digit code').val('');
        $('#btnLogin').prop('disabled', false).text('Re-Enter & Verify OTP').attr('onclick', "verifyOTP()");
    }
}

function requestOTP() {
    if ($('#phone').val().length === 10) {
        mobile = $('#phone').val();
        localStorage.setItem('platuser', mobile);
        $('#btnLoginotp').prop('disabled', true).text('Sending OTP...');
        $.ajax({
            url: "http://platterexoticfood.com/pladmin/manage_api/request_otp",
            type: "post",
            dataType: "JSON",
            data: { mobile: mobile }
        }).done(function (rply) {
            if (rply.status){
                // OTP = reply.otp;
                $('#login_title').text('Verify OTP');
                $('#loginscrn').css('display', 'none');
                $('#loginscrn2').css('display', 'none');
                $('#logingotp').css('display', 'block');

                $('#ms_timer_login').countdowntimer({
                    minutes: 0,
                    seconds: 10,
                    size: "lg"
                });
                // setTimeout(function () {
                //     $('#txtloginOTP').val(OTP);
                // }, 10000);
                // setTimeout(function () {
                //     verifyloginOTP();
                // }, 12000);
            }
            else{
                $('#btnLoginotp').prop('disabled', false).text('Send OTP');
                window.plugins.toast.showLongBottom('Mobile Number Not Register With Us');
            }
            
        }).fail(function (err) {
            window.plugins.toast.showLongBottom('Please enter a valid mobile number!');
            $('#btnLoginotp').prop('disabled', false);
        })
    } else {
        window.plugins.toast.showLongBottom('Please enter a valid mobile number!');
        $('#btnLoginotp').prop('disabled', false);
    }
}

function verifyloginOTP() {

    $('#btnLoginverify').prop('disabled', true).text('Verifying OTP...');
    if ($('#txtloginOTP').val() != "") {
        mobile = localStorage.getItem('platuser');
        $('#btnLoginverify').prop('disabled', true).text('Logging in...');
        $.ajax({
            url: "http://platterexoticfood.com/pladmin/manage_api/do_login",
            type: "post",
            dataType: "JSON",
            data: { mobile: mobile, otp: $('#txtloginOTP').val() }
        }).done(function (reply) {
            console.log(reply);
            if (reply.success)
            {
                localStorage.setItem('loginstat', 'yes');
                FCMPlugin.getToken(function (token) {
                    if (token) {
                        console.log(token);
                        $.ajax({
                            url: "http://platterexoticfood.com/pladmin/manage_api/update_token",
                            method: "POST",
                            dataType: "JSON",
                            data: { mobile: mobile, token: token }
                        }).done(function (res) {
                            window.location.href = "getlocation.html";
                        })
                    } else {
                        window.location.href = "getlocation.html";
                    }
                });
                window.location.href ="getlocation.html";   
            }
            else{
                window.plugins.toast.showLongBottom('OTP Mismatch. Please Verify Again ..');
                $('#txtloginOTP').attr('placeholder', 'Enter 4-digit code').val('');
                $('#btnLoginverify').prop('disabled', false).text('Re-Enter & Verify OTP').attr('onclick', "verifyloginOTP()");
            }
            
            
        }).fail(function (err) {
            console.log(err);
        });
    } else {
        $('#txtloginOTP').attr('placeholder', 'Enter 4-digit code').val('');
        $('#btnLoginverify').prop('disabled', false).text('Re-Enter & Verify OTP').attr('onclick', "verifyloginOTP()");
        window.plugins.toast.showLongBottom('Enter OTP and try again');
        
    }
}

function checkConnection() {
    if (navigator.network.connection.type == Connection.ETHERNET) {
        window.plugins.toast.showLongBottom('Device Connected To Ethernet');
        //$('.noInternet').show();
        window.location.href = "no-internet.html";
    }
    if (navigator.network.connection.type == Connection.WIFI) {
        window.plugins.toast.showLongBottom('WIFI Connection Detected');

    }
    if (navigator.network.connection.type == Connection.CELL_2G) {
        window.plugins.toast.showLongBottom('Slow network detected. Some functions may not work.');
        //$('.noInternet').show();
        window.location.href = "no-internet.html";
    }
    if (navigator.network.connection.type == Connection.CELL_3G) {
        window.plugins.toast.showLongBottom('3G Connection Detected');

    }
    if (navigator.network.connection.type == Connection.CELL_4G) {
        window.plugins.toast.showLongBottom('4G Connection Detected');

    }
    if (navigator.network.connection.type == Connection.NONE) {
        window.plugins.toast.showLongBottom('No internet connection detected');
        //$('.noInternet').show();
        window.location.href = "no-internet.html";
    }

}
