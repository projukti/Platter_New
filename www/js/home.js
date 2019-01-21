var serverUrl = 'http://platterexoticfood.com/pladmin/manage_api/'
var chatTimeOut
var counter = 0
var user = localStorage.getItem('platuser')

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
        //document.addEventListener('eventName', didLaunchAppFromLink, false);
    },

    onDeviceReady: function () {
        // Set Default Text And Value
        $('#lblLocality').html(localStorage.getItem('area')); //Display Area Here
        app.topFiveRestaurants();
        app.topTwelveRestaurants();
        app.generalRestaurants();
        app.getCuisine();
        //universalLinks.subscribe('forReferaalDiscount', app.didLaunchAppFromLink);
    },


    // didLaunchAppFromLink: function (eventData) {
    //     console.log('Did launch application from the link: ' + eventData.url);
    // },
    // Back Button Off 
    onBackKeyDown: function (viewName) {
        // if (mainView.router.url == '/') {
        //     newApp.dialog.confirm('Are you sure you want to exit?', function () {
        //         console.log('Exiting');
        //         navigator.app.exitApp();
        //     });
        // }
        // else {
            let pageHistoryLength = mainView.history.length

            // Get Previous URL 
            let previousURL = mainView.history[pageHistoryLength - 2]

            // Get Current URL 
            let currentURL = mainView.history[pageHistoryLength - 1]

            if (pageHistoryLength == 1) {

                newApp.dialog.confirm('Are you sure you want to exit?', function () {
                    console.log('Exiting');
                    navigator.app.exitApp();
                });
            }
            else {
                if (pageHistoryLength > 3) {
                    mainView.history.length = 0
                    window.location.href = "home.html"
                }
                else {
                    if (previousURL == '/') {
                        window.location.href = "home.html"
                    }
                    else {
                        app.router.navigate(previousURL)
                    }
                }

            }

        //}
    },

    // Open Camera Using this section
    openCamera: function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 70,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: 0,
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 640,
            targetHeight: 640,
            cameraDirection: 1
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
                else {
                    window.plugins.toast.showLongBottom('Profile image update successfully');
                }
            }).fail();
        }

        function onFail(message) {
            window.plugins.toast.showLongBottom('Failed because: ' + message);
        }
    },

    // Open Gallery Uisng this section
    openGellery: function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 70,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true,
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 640,
            targetHeight: 640,
            cameraDirection: 1
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
                else {
                    window.plugins.toast.showLongBottom('Profile image update successfully');
                }
            }).fail();
        }

        function onFail(message) {
            window.plugins.toast.showLongBottom('Failed because: ' + message);
        }
    },

    // This Section For Get Top 5 Restaurents
    topFiveRestaurants: function () {
        let topFiveRestaurantData = ''
        $.ajax({
            type: "POST",
            url: "http://platterexoticfood.com/pladmin/manage_api/restaurant_top_five_list/",
            dataType: "JSON"
        }).done(function (rply) {
            for (list in rply.restaurant) {
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open") {
                    topFiveRestaurantData += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '/' + rply.restaurant[list].restaurant_name + '/">'
                    topFiveRestaurantData += '<div class="card" class="card" style="margin-bottom: 10px;">'
                    topFiveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" style="width:100%;">'
                } else {
                    let cloaseMessage = "Restaurest will open at : " + rply.restaurant[list].opening_time
                    topFiveRestaurantData += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage + '\')">'
                    topFiveRestaurantData += '<div class="card" class="card" style="margin-bottom: 10px;">'
                    topFiveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" style="width:100%;-webkit-filter: grayscale(100%); filter: grayscale(100%);">'
                }

                topFiveRestaurantData += '</div>'
                topFiveRestaurantData += '</a>'
                $('#lblTopFiveRestaurents').html(topFiveRestaurantData)
            }

        }).fail();
    },

    // This Function For Top 12 Restaurents
    topTwelveRestaurants: function () {
        let topTwelveRestaurantData = ''
        $.ajax({
            type: "POST",
            url: "http://platterexoticfood.com/pladmin/manage_api/restaurant_top_twelve_list/",
            dataType: "JSON"
        }).done(function (rply) {
            for (list in rply.restaurant) {
                topTwelveRestaurantData += '<li>'
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open") {
                    topTwelveRestaurantData += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '/' + rply.restaurant[list].restaurant_name + '/" class="item-content" style="color:#676767;">'
                    topTwelveRestaurantData += '<div class="item-media">'
                    topTwelveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
                }
                else {
                    let cloaseMessage = "Restaurest will open at : " + rply.restaurant[list].opening_time
                    topTwelveRestaurantData += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage + '\')" class="item-content" style="color:#676767;">'
                    topTwelveRestaurantData += '<div class="item-media">'
                    topTwelveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;-webkit-filter: grayscale(100%); filter: grayscale(100%);"/>'
                }
                topTwelveRestaurantData += '</div>'
                topTwelveRestaurantData += '<div class="item-inner">'
                topTwelveRestaurantData += '<div class="item-title-row">'
                topTwelveRestaurantData += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.restaurant[list].restaurant_name + '</div>'
                topTwelveRestaurantData += '</div>'
                topTwelveRestaurantData += '<div class="item-subtitle" style="font-size: 12px;">' + rply.restaurant[list].cuisine_tags + '</div>'
                topTwelveRestaurantData += '<hr style="height: 0px; color: #fff;">'
                topTwelveRestaurantData += '<div class="item-subtitle">'
                topTwelveRestaurantData += '<div class="row">'
                topTwelveRestaurantData += '<div class="col-40" style="font-size: 12px;">'
                topTwelveRestaurantData += '<i class="icon material-icons md-only" style="font-size: 18px;margin-right: -5px;">star</i>' + rply.restaurant[list].avg_rating
                topTwelveRestaurantData += '</div>'
                topTwelveRestaurantData += '<div class="col-60" style="font-size: 12px;text-align: right;">'
                topTwelveRestaurantData += '<img src="img/iconset/rupee.png" style="height: 14px;margin-bottom: -3px;">'
                topTwelveRestaurantData += '<span>' + rply.restaurant[list].two_person_cost + ' FOR TWO</span>'
                topTwelveRestaurantData += '</div>'
                topTwelveRestaurantData += '</div>'
                topTwelveRestaurantData += '</div>'
                topTwelveRestaurantData += '</div>'
                topTwelveRestaurantData += '</a>'
                topTwelveRestaurantData += '</li>'
                $('#lblTopTwelveRestaurents').html(topTwelveRestaurantData)
            }

        }).fail();
    },

    // Rest Of The Rasturants List
    generalRestaurants: function () {
        let generalRestaurents = ''
        $.ajax({
            type: "POST",
            url: "http://platterexoticfood.com/pladmin/manage_api/restaurant_general_list/",
            dataType: "JSON"
        }).done(function (rply) {
            for (list in rply.restaurant) {
                generalRestaurents += '<li>'
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open") {
                    generalRestaurents += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '/' + rply.restaurant[list].restaurant_name + '/" class="item-content" style="color:#676767;">'
                    generalRestaurents += '<div class="item-media">'
                    generalRestaurents += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
                }
                else {
                    let cloaseMessage = "Restaurest will open at : " + rply.restaurant[list].opening_time
                    generalRestaurents += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage + '\')" class="item-content" style="color:#676767;">'
                    generalRestaurents += '<div class="item-media">'
                    generalRestaurents += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;-webkit-filter: grayscale(100%); filter: grayscale(100%);"/>'
                }
                generalRestaurents += '</div>'
                generalRestaurents += '<div class="item-inner">'
                generalRestaurents += '<div class="item-title-row">'
                generalRestaurents += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.restaurant[list].restaurant_name + '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '<div class="item-subtitle" style="font-size: 12px;">' + rply.restaurant[list].cuisine_tags + '</div>'
                generalRestaurents += '<hr style="height: 0px; color: #fff;">'
                generalRestaurents += '<div class="item-subtitle">'
                generalRestaurents += '<div class="row">'
                generalRestaurents += '<div class="col-40" style="font-size: 12px;">'
                generalRestaurents += '<i class="icon material-icons md-only" style="font-size: 18px;margin-right: -5px;">star</i>' + rply.restaurant[list].avg_rating
                generalRestaurents += '</div>'
                generalRestaurents += '<div class="col-60" style="font-size: 12px;text-align: right;">'
                generalRestaurents += '<img src="img/iconset/rupee.png" style="height: 14px;margin-bottom: -3px;">'
                generalRestaurents += '<span>' + rply.restaurant[list].two_person_cost + ' FOR TWO</span>'
                generalRestaurents += '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '</a>'
                generalRestaurents += '</li>'
                $('#lblGeneralRestaurents').html(generalRestaurents)
            }

        }).fail();
    },

    // This Function Check Restaurent is opent or closed
    isRestaurantOpen: function (opening, closing) {
        opening = opening.split(':');
        closing = closing.split(':');
        openingH = parseInt(opening[0]);
        openingM = parseInt(opening[1]);
        closingH = parseInt(closing[0]);
        closingM = parseInt(closing[1]);
        var d = new Date(); // current time
        var H = d.getHours();
        var M = d.getMinutes();
        is_open = false;
        if (openingH < closingH) {
            if (H > openingH && H < closingH) {
                is_open = true
            } else if (H === openingH && M >= openingM) {
                is_open = true
            } else if (H === closingH && M <= closingM) {
                is_open = true
            }
        } else if (openingH > closingH) {
            if (H > openingH || H < closingH) {
                is_open = true
            } else if (H === openingH && M >= openingH) {
                is_open = true
            } else if (H === closingH && M <= closingH) {
                is_open = true
            }
        } else {
            is_open = true
        }
        return is_open ? 'open' : 'closed';
    },

    // This Function For Custome Toast Message
    custToastMessage: function (message) {
        window.plugins.toast.showLongBottom(message);
    },

    // This Function For Get Rastuent Menu List
    restaurentMenus: function (resid, resName) {
        let popularDish = ''
        let vegDish = ''
        let nonVegDish = ''
        $.ajax({
            type: "post",
            url: serverUrl + 'menu_list/',
            data: { id: resid, user: localStorage.getItem('platuser') },
            dataType: "JSON"
        }).done(function (rply) {
            // This is for popular dishes
            for (list in rply.popular) {
                popularDish += '<li>'
                popularDish += '<div class="item-content" style="color:#676767;">'
                popularDish += '<div class="item-media">'
                popularDish += '<img src="http://platterexoticfood.com/pladmin/uploads/menu/' + rply.popular[list].menuimg + '" style="height: 50px; width: 50px;">'
                popularDish += '</div>'
                popularDish += '<div class="item-inner">'
                popularDish += '<div class="item-title-row">'
                popularDish += '<a href="/menu-details/' + rply.popular[list].menu_id + '/' + rply.popular[list].menuname + '/' + resName + '/' + resid + '/" >'
                popularDish += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.popular[list].menuname + '</div>'
                popularDish += '</a>'
                popularDish += '</div>'
                popularDish += '<div class="item-subtitle" style="font-size: 12px;">'
                popularDish += '<div class="row">'
                popularDish += '<div class="col-20" style="font-size: 20px;">'
                popularDish += '<img src="img/iconset/rupee.png" style="height: 20px;margin-bottom: -3px;">'
                popularDish += '<span>' + rply.popular[list].menuprice + '</span>'
                popularDish += '</div>'
                popularDish += '<div class="col-80" style="font-size: 12px;text-align: right;">'
                popularDish += '<div class="stepper stepper-small stepper-round stepper-fill stepper-init color-red" data-min="0" data-max="500" style="width:100px;" data-step="25" data-value="75" >'
                popularDish += '<div class="stepper-button-minus" onclick="swipperminus(\'' + rply.popular[list].menu_id + '\', ' + resid + ')"></div>'
                popularDish += '<div class="stepper-value" id="' + rply.popular[list].menu_id + '">0</div>'
                popularDish += '<div class="stepper-button-plus" onclick="swipperadd(\'' + rply.popular[list].menu_id + '\',' + resid + ')"></div>'
                popularDish += '</div>'
                popularDish += '</div>'
                popularDish += '</div>'
                popularDish += '</div>'
                popularDish += '</div>'
                popularDish += '</div>'
                popularDish += '</li>'
            }
            $('#lblPopularDish').html(popularDish);

            // This Section For Veg Items
            for (list in rply.veg) {
                console.log(rply.veg.length)
                vegDish += '<li>'
                vegDish += '<div class="item-content" style="color:#676767;">'
                vegDish += '<div class="item-media">'
                vegDish += '<img src="http://platterexoticfood.com/pladmin/uploads/menu/' + rply.veg[list].menuimg + '" style="height: 50px; width: 50px;">'
                vegDish += '</div>'
                vegDish += '<div class="item-inner">'
                vegDish += '<div class="item-title-row">'
                vegDish += '<a href="/menu-details/' + rply.veg[list].menu_id + '/' + rply.veg[list].menuname + '/' + resName + '/' + resid + '/">'
                vegDish += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.veg[list].menuname + '</div>'
                vegDish += '</a>'
                vegDish += '</div>'
                vegDish += '<div class="item-subtitle" style="font-size: 12px;">'
                vegDish += '<div class="row">'
                vegDish += '<div class="col-20" style="font-size: 20px;">'
                vegDish += '<img src="img/iconset/rupee.png" style="height: 20px;margin-bottom: -3px;">'
                vegDish += '<span>' + rply.veg[list].menuprice + '</span>'
                vegDish += '</div>'
                vegDish += '<div class="col-80" style="font-size: 12px;text-align: right;">'
                vegDish += '<div class="stepper stepper-small stepper-round stepper-fill stepper-init color-red" data-min="0" data-max="500" style="width:100px;" data-step="25" data-value="75">'
                vegDish += '<div class="stepper-button-minus" onclick="swipperminus(\'' + rply.veg[list].menu_id + '\',' + resid + ')"></div>'
                vegDish += '<div class="stepper-value" id="' + rply.veg[list].menu_id + '">0</div>'
                vegDish += '<div class="stepper-button-plus" onclick="swipperadd(\'' + rply.veg[list].menu_id + '\',' + resid + ')"></div>'
                vegDish += '</div>'
                vegDish += '</div>'
                vegDish += '</div>'
                vegDish += '</div>'
                vegDish += '</div>'
                vegDish += '</div>'
                vegDish += '</li>'
            }
            if (vegDish == ""){
                vegDish +="<li> NO Item Found</li>"
            }
            $('#lblVegDish').html(vegDish);

            // This Section For Non Veg Items
            for (list in rply.nonveg) {
                nonVegDish += '<li>'
                nonVegDish += '<div class="item-content" style="color:#676767;">'
                nonVegDish += '<div class="item-media">'
                nonVegDish += '<img src="http://platterexoticfood.com/pladmin/uploads/menu/' + rply.nonveg[list].menuimg + '" style="height: 50px; width: 50px;">'
                nonVegDish += '</div>'
                nonVegDish += '<div class="item-inner">'
                nonVegDish += '<div class="item-title-row">'
                nonVegDish += '<a href="/menu-details/' + rply.nonveg[list].menu_id + '/' + rply.nonveg[list].menuname + '/' + resName + '/' + resid + '/">'
                nonVegDish += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.nonveg[list].menuname + '</div>'
                nonVegDish += '</a>'
                nonVegDish += '</div>'
                nonVegDish += '<div class="item-subtitle" style="font-size: 12px;">'
                nonVegDish += '<div class="row">'
                nonVegDish += '<div class="col-20" style="font-size: 20px;">'
                nonVegDish += '<img src="img/iconset/rupee.png" style="height: 20px;margin-bottom: -3px;">'
                nonVegDish += '<span>' + rply.nonveg[list].menuprice + '</span>'
                nonVegDish += '</div>'
                nonVegDish += '<div class="col-80" style="font-size: 12px;text-align: right;">'
                nonVegDish += '<div class="stepper stepper-small stepper-round stepper-fill stepper-init color-red" data-min="0" data-max="500" style="width:100px;" data-step="25" data-value="75">'
                nonVegDish += '<div class="stepper-button-minus" onclick="swipperminus(\'' + rply.nonveg[list].menu_id + '\',' + resid + ')"></div>'
                nonVegDish += '<div class="stepper-value" id="' + rply.nonveg[list].menu_id + '">0</div>'
                nonVegDish += '<div class="stepper-button-plus" onclick="swipperadd(\'' + rply.nonveg[list].menu_id + '\',' + resid + ')"></div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</li>'
            }
            if (nonVegDish == "") {
                nonVegDish += "<li> NO Item Found</li>"
            }
            $('#lblNonVeg').html(nonVegDish);
        }).fail(function (rply) {
        });
    },

    // This Section For Menu Details 
    menuDetails: function (menuId, resId) {
        // Set Menu Image
        let nutritionValue = ''
        $.ajax({
            type: "post",
            url: serverUrl + 'menu_details',
            data: { id: resId, menu: menuId, user: localStorage.getItem('platuser') },
            dataType: "JSON"
        }).done(function (rply) {
            // Set Background Menu Image
            $('#fileMenuImage').attr('src', 'http://platterexoticfood.com/pladmin/uploads/menu/' + rply.menu.menuimg);
            $('#lblMenuRateing').html('<i class="icon material-icons md-only" style="font-size: 14px;margin-right: -5px;">star</i> &nbsp; ' + rply.menu.avg_rating);
            $('#lblMenuPrice').html(rply.menu.menuprice);

            nutritionValue += '<table>'
            nutritionValue += '<tbody>'
            nutritionValue += '<tr style="margin-right: 12%;margin-left: -50%;">'
            for (list in rply.nutrition_value) {
                nutritionValue += '<td>' + rply.nutrition_value[list].nutrition_name + ' : ' + rply.nutrition_value[list].nutrival + '</td>'
            }
            nutritionValue += '</tr>'
            nutritionValue += '</tbody>'
            nutritionValue += '</table>'
            $('#tblNurition').html(nutritionValue);

            $('#lblMenuDetails').html(rply.menu.menudetails);

            // This Section For User Liked Or Not
            if (rply.user_like_menu == null || rply.user_like_menu.is_like == 0) {
                $('#lblLikeStatus').attr('src', 'img/like.png');
                $('#lblLikeStatusTarget').html('');
            }

            else {
                $('#lblLikeStatus').attr('src', 'img/like_fill.png');
                $('#lblLikeStatusTarget').html('1');
            }
        });
    },

    // this section for menu like or dislike
    menuLikeDislike: function () {
        // Get Current Like Status
        let currentStatus = $('#lblLikeStatusTarget').html();
        let changeStstus = 0
        let menuId = $('#lblMenuId').html();
        if (currentStatus == '1') {
            changeStstus = 0
        }
        else {
            changeStstus = 1
        }

        $.ajax({
            type: "POST",
            url: serverUrl + "/user_like_menu",
            data: { id: menuId, user: localStorage.getItem('platuser'), like: changeStstus },
            dataType: "JSON"
        }).done(function (rply) {
            if (changeStstus == 0) {
                $('#lblLikeStatus').attr('src', 'img/like.png');
                $('#lblLikeStatusTarget').html('');
            }
            else {
                $('#lblLikeStatus').attr('src', 'img/like_fill.png');
                $('#lblLikeStatusTarget').html('1');
            }
        });
    },

    // This Section For Get All Cart Items
    currentCartItems: function () {
        let cartItem = ''
        let couponItem = ''
        $.ajax({
            type: "POST",
            url: serverUrl + 'get_cart/',
            data: { user: localStorage.getItem('platuser') },
            dataType: "JSON"
        }).done(function (rply) {
            // console.log(rply)
            if (rply.success) {
                for (list in rply.data) {
                    for (listMenu in rply.data[list].menu) {
                        cartItem += '<li>'
                        cartItem += '<div class="item-content" style="color:#676767;">'
                        cartItem += '<div class="item-media">'
                        cartItem += '<img src="http://platterexoticfood.com/pladmin/uploads/menu/' + rply.data[list].menu[listMenu].menuimg + '" style="height: 50px; width: 50px;">'
                        cartItem += '</div>'
                        cartItem += '<div class="item-inner">'
                        cartItem += '<div class="item-title-row">'
                        cartItem += '<a href="/menu-details/">'
                        cartItem += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.data[list].menu[listMenu].menuname + '</div>'
                        cartItem += '</a>'
                        cartItem += '</div>'
                        cartItem += '<div class="item-subtitle" style="font-size: 12px;">'
                        cartItem += '<div class="row">'
                        cartItem += '<div class="col-20" style="font-size: 20px;">'
                        cartItem += '<img src="img/iconset/rupee.png" style="height: 20px;margin-bottom: -3px;">'
                        cartItem += '<span>' + rply.data[list].menu[listMenu].menuprice + '</span>'
                        cartItem += '</div>'
                        cartItem += '<div class="col-80" style="font-size: 12px;text-align: right;">'
                        cartItem += '<div class="stepper stepper-small stepper-round stepper-fill stepper-init color-red" data-min="0" data-max="500" style="width:100px;" data-step="25" data-value="75">'
                        cartItem += '<div class="stepper-button-minus" onclick="swipperminus(\'' + rply.data[list].menu[listMenu].menu_id + '\',' + rply.data[list].restaurant_id + ')"></div>'
                        cartItem += '<div class="stepper-value" id=\'' + rply.data[list].menu[listMenu].menu_id + '\'">' + rply.data[list].menu[listMenu].qty + '</div>'
                        cartItem += '<div class="stepper-button-plus" onclick="swipperadd(\'' + rply.data[list].menu[listMenu].menu_id + '\',' + rply.data[list].restaurant_id + ')"></div>'
                        cartItem += '</div>'
                        cartItem += '</div>'
                        cartItem += '</div>'
                        cartItem += '</div>'
                        cartItem += '</div>'
                        cartItem += '</div>'
                        cartItem += '</li>'
                    }
                }
                $('#lblCartList').html(cartItem);
                for (list in rply.data2) {
                    couponItem += '<li>'
                    couponItem += '<div class="item-content">'
                    couponItem += '<div class="item-media">'
                    couponItem += '<img src="img/coupon.png" width="50">'
                    couponItem += '</div>'
                    couponItem += '<div class="item-inner">'
                    couponItem += '<div class="item-title-row">'
                    couponItem += '<div class="item-title">' + rply.data2[list].coupon_name + '</div>'
                    couponItem += '</div>'
                    couponItem += '<div class="item-subtitle" style="white-space: unset;">' + rply.data2[list].description + '<a class="button button-raised button-fill color-orange" onclick="app.validateCouponCode(\'' + rply.data2[list].coupon_name + '\')">Apply</a></div>'
                    couponItem += '</div>'
                    couponItem += '</div>'
                    couponItem += '</li>'
                }
                $('#lblCouponData').html(couponItem);
                $('#lblCartList').html(cartItem);
                $('#lblDeliverySection').show();
                $('#lblAddressSection').show();
                $('#lblCartItemSection').show();
                $('#lblCouponSection').show();
                $('#lblEmptyCartSection').hide();
                $('#lblDeliveryAddress').html(localStorage.getItem('currentAddress'));

                if (localStorage.getItem('lblDeliveryTime') != null)
                {
                    console.log('here');
                    $('#lblDeliveryTime').html(localStorage.getItem('lblDeliveryTime'));
                }
                else if (localStorage.getItem('lblDeliveryTime') == null){
                    
                    let CustomizeSection = 'Expected Delivery Time : <span style="color:#ef3837;">40 Min</span>&nbsp;'
                    CustomizeSection += '<a href="/customize-order/" class="color-blue">Customize Now</a>'
                    $('#lblDeliveryTime').html(CustomizeSection);
                }
            }
            else {
                cartItem += '<div id="lblEmptyCartSection">'
                cartItem += '<div class="block" style="margin-left: 30%;margin-top: 30%;">'
                cartItem += '<img src="img/fish.png">'
                cartItem += '</div>'
                cartItem += '<div class="block" align="center">'
                cartItem += 'Your cart is empty. Add someting from menu'
                cartItem += '</div>'
                cartItem += '</div>'
                $('#cartPage').html(cartItem);
                $('#lblDeliverySection').hide();
                $('#lblAddressSection').hide();
                $('#lblCartItemSection').hide();
                $('#lblCouponSection').hide();
            }

            // This Section For Cart Amount 
            $('#lblTotalWithoutGST').html(rply.subtotal);
            $('#lblGSTAmount').html(rply.gst);
            $('#lblDeliveryCharge').html(rply.delivery_charge);
            $('#lblPackingCharge').html(rply.packing_charge);
            $('#lblCouponDiscount').html(rply.discount);
            $('#lblSubTotal').html(rply.total_amount);
            localStorage.setItem('couponCode', '');
            localStorage.setItem('couponGST', '');
            localStorage.setItem('couponFinalAmount', '');
            localStorage.setItem('couponDiscountAmount', '');
        });
        cartView.app.accordion.toggle();
    },

    // This Function For Validate Coupon Code
    validateCouponCode: function (coupon) {
        $.ajax({
            type: "post",
            url: serverUrl + "validate_coupon/",
            data: { coupon: coupon, total: $('#lblTotalWithoutGST').html(), user: localStorage.getItem('platuser') },
            dataType: "json"
        }).done(function (rply) {
            
            let packingCharge = $('#lblPackingCharge').html()
            let deliveryCharge = $('#lblDeliveryCharge').html()
            let finalAmount = parseInt(rply.amount_after_discount) + parseInt(packingCharge) + parseInt(deliveryCharge)
            $('#lblCouponDiscount').html(rply.discount_amount + '.00')
            $('#lblGSTAmount').html(rply.gst_amount + '.00')
            $('#lblSubTotal').html(finalAmount + '.00')
            localStorage.setItem('couponCode', coupon);
            localStorage.setItem('couponGST', rply.gst_amount + '.00');
            localStorage.setItem('couponFinalAmount', finalAmount + '.00');
            localStorage.setItem('couponDiscountAmount', rply.discount_amount + '.00');
            if (rply.discount_amount){
                window.plugins.toast.showLongBottom('Coupon Code Applied Successfully');
            }
            else{
                window.plugins.toast.showLongBottom('Coupon Code Not Applied Successfully');
            }
            
            //  

        });
    },

    // Reset Customized Meal
     resetCustomize : function(){
         localStorage.setItem('mealName', null);
         localStorage.setItem('mealDate', null);
         localStorage.setItem('mealTime', null);
         localStorage.setItem('lblDeliveryTime', null);
         let CustomizeSection = 'Expected Delivery Time : <span style="color:#ef3837;">40 Min</span>&nbsp;'
         CustomizeSection += '<a href="/customize-order/" class="color-blue">Customize Now</a>'
         $('#lblDeliveryTime').html(CustomizeSection);
    },

    // This Section For Pay Now
    payNow: function (delivery_address, delivery_pincode, delivery_flat, delivery_landmark, payment_method, couponCode, refcode) {
        //user = localStorage.getItem('platuser');
        // let order_amount = 1;
        // var order_amount = $('#cartSummery span').text();
        let order_no;
        // $('#delivAddress').prop('readonly', true);
        $('#btnPayOnDelivery').prop('disabled', true).text('Please wait. . .');
        if (delivery_address.length < 10) {
            $('#btnPayOnDelivery').prop('disabled', false).text('Pay Now');
            window.plugins.toast.show('Please enter a valid delivery address', 'long', 'bottom', function (a) { }, function (b) { });
        } else {
            switch (payment_method) {
                case 'cod':
                    $.ajax({
                        url: serverUrl + 'checkout',
                        method: 'post',
                        dataType: 'JSON',
                        data: {
                            user: localStorage.getItem('platuser'),
                            delivery_address: delivery_address,
                            delivery_pincode: delivery_pincode,
                            delivery_flat: delivery_flat,
                            delivery_landmark: delivery_landmark,
                            payment_method: payment_method,
                            payment_success: 0,
                            couponCode: couponCode,
                            refcode: refcode,
                            mealName: localStorage.getItem('mealName'),
                            mealDate: localStorage.getItem('mealDate'),
                            mealTime: localStorage.getItem('mealTime')
                        }
                    }).done(function (res) {
                        if(res.success < 1){
                            window.plugins.toast.show('Failed because: ' + res.message, 'long', 'middle', function (a) { }, function (b) { });
                            $('#btnPayOnDelivery').prop('disabled', false).text('Pay Now');
                            cartView.router.navigate('/payment-error/');
                        }
                        else{
                            localStorage.setItem('couponFinalAmount', '');
                            localStorage.setItem('couponDiscountAmount', '');
                            localStorage.setItem('couponCode', '');
                            localStorage.setItem('couponGST', '');
                            localStorage.setItem('couponapplied', 'no');

                            let orderID =  res.data
                            let tkn = localStorage.getItem('newtoken');
                            let title = 'Order Placed Successfully';
                            let msg = 'Your order ' + orderID + ' is placed successfully. Now relax and we will handle rest of the things.';
                            $.ajax({
                                url: serverUrl+"sendGCM/",
                                method: "POST",
                                dataType: "JSON",
                                data: { title: title, message: msg, user: user }
                            }).done(function () {
                               
                            });
                            
                            cartView.router.navigate('/payment-success/' + orderID + '/');
                        }
                    }).fail();
                    break;
                case 'online':
                    $.ajax({
                        type: "post",
                        url: serverUrl + 'UpdateAddress',
                        data: {
                            user: localStorage.getItem('platuser'),
                            delivery_address: delivery_address,
                            delivery_pincode: delivery_pincode,
                            delivery_flat: delivery_flat,
                            delivery_landmark: delivery_landmark,
                            payment_method: payment_method,
                            payment_success: 0,
                            couponCode: couponCode,
                            refcode: refcode,
                            mealName: localStorage.getItem('mealName'),
                            mealDate: localStorage.getItem('mealDate'),
                            mealTime: localStorage.getItem('mealTime')
                        },
                        dataType: "JSON"
                    }).done(function (rply) {
                        //let onlinePaymentUrl = 'http://platterexoticfood.com/' + localStorage.getItem('platuser') + '/' + encodeURI(finalAmount) + '/'
                        var ref = cordova.InAppBrowser.open(rply.url, '_blank', 'location=no');
                        // var myCallback = function (event) { console.log(event.url); }
                        ref.addEventListener('loadstart', function (event) {
                            let urlSuccessPage = "https://www.platterexoticfood.com/success.php";
                            let urlErrorPage = "https://www.platterexoticfood.com/fail.php";
                            if (event.url == urlSuccessPage) {

                                $.ajax({
                                    type: "post",
                                    url: serverUrl +"OnlineSuccessPay/",
                                    data: { ordrId: rply.oid, user: user},
                                    dataType: "JSON"
                                });

                                let tkn = localStorage.getItem('newtoken');
                                let title = 'Order Placed Successfully';
                                let msg = 'Your order ' + rply.oid + ' is placed successfully. Now relax and we will handle rest of the things.';
                                $.ajax({
                                    url: serverUrl + "sendGCM/",
                                    method: "POST",
                                    dataType: "JSON",
                                    data: { title: title, message: msg, user: user }
                                }).done(function () {

                                });
                                cartView.router.navigate('/payment-success/' + rply.oid + '/');
                                ref.close();
                            }
                            else if (event.url == urlErrorPage) {
                                cartView.router.navigate('/payment-error/');
                                ref.close();
                            }
                        });
                    });
                   
                    break;
                default:
                    // $('#delivAddress').prop('readonly', false);
                    $('#btnPayOnDelivery').prop('disabled', false).text('Pay Now');
                    window.plugins.toast.show('Please choose a payment mode', 'long', 'bottom', function (a) { }, function (b) { });
            }
        }
        app.resetCustomize();
    },

    // This Section For Order
    orderHistory: function(){
        let openOrder =''
        let closeOrder=''
        $.ajax({
            type: "post",
            url: "http://platterexoticfood.com/pladmin/manage_api/delivery_order_list/",
            data: { mobile: localStorage.getItem('platuser') },
            dataType: "json"
        }).done(function (rply) {
            console.log(rply)
            for (list in rply.open_order){
                openOrder += '<li>'
                openOrder += '<a href="/order_details/' + rply.open_order[list].order_id + '/" class="item-link item-content">'
                openOrder += '<div class="item-inner item-cell">'
                openOrder += '<div class="item-row">'
                openOrder += '<div class="item-cell"><strong>Order No ' + rply.open_order[list].order_no + '</strong></div>'
                openOrder += '</div>'
                openOrder += '<div class="item-row">'
                openOrder += '<div class="item-cell">' + rply.open_order[list].order_time + ', ' + rply.open_order[list].order_date + '</div>'
                openOrder += '</div>'
                openOrder += '<div class="item-row">'
                openOrder += '<div class="item-cell" style="width: unset;"><img src="img/open_order.png" width="44"></div>'
                openOrder += '<div class="item-cell"  style="width: unset;">'
                openOrder += '<div class="item-row">'
                openOrder += rply.open_order[list].restaurant.restaurant_name + ', ' + rply.open_order[list].restaurant.locality
                openOrder += '</div>'
                openOrder += '<div class="item-row">' + rply.open_order[list].subtotal + '</div>'
                openOrder += '</div>'
                openOrder += '</div>'
                openOrder += '</div>'
                openOrder += '</a>'
                openOrder += '</li>'
            }
            $('#lblOpenOrder').html(openOrder);

            for (list in rply.close_order){
                closeOrder += '<li>'
                closeOrder += '<a href="/order_details/' + rply.close_order[list].order_id + '/" class="item-link item-content">'
                closeOrder += '<div class="item-inner item-cell">'
                closeOrder += '<div class="item-row">'
                closeOrder += '<div class="item-cell"><strong>Order No ' + rply.close_order[list].order_no + '</strong></div>'
                closeOrder += '</div>'
                closeOrder += '<div class="item-row">'
                closeOrder += '<div class="item-cell">' + rply.close_order[list].delivery_time + ', ' + rply.close_order[list].delivery_date + '</div>'
                closeOrder += '</div>'
                closeOrder += '<div class="item-row">'
                closeOrder += '<div class="item-cell" style="width: unset;"><img src="img/order_complete.png" width="44"></div>'
                closeOrder += '<div class="item-cell"  style="width: unset;">'
                closeOrder += '<div class="item-row">'
                closeOrder += rply.close_order[list].restaurant.restaurant_name + ', ' + rply.close_order[list].restaurant.locality
                closeOrder += '</div>'
                closeOrder += '<div class="item-row">' + rply.close_order[list].subtotal + '</div>'
                closeOrder += '</div>'
                closeOrder += '</div>'
                closeOrder += '</div>'
                closeOrder += '</a>'
                closeOrder += '</li>'
            }
            // console.log(closeOrder);
            $('#lblCloseOrder').html(closeOrder);
        });
    },

    // This Section For Order Details 
    orderDetails: function(orderId){
        let menuDetails = ''

        $.ajax({
            type: "post",
            url: serverUrl + 'order_details_by_id',
            data: { orderId: orderId},
            dataType: "JSON"
        }).done(function(rply){
            console.log(rply)
            let navOrderStatus=''
            $('#lblOrderNo').html(rply.data.order_no);
            // $('#lblOrderStatus').html(htmlString);
            switch (rply.data.orderDetail.delivery_status) {
                case '0':
                    navOrderStatus += 'Order Placed'
                    break;

                case '1':
                    navOrderStatus += 'Order Received'
                    break;
                
                case '2':
                    navOrderStatus += 'Restaurant Reached'
                    break;

                case '3':
                    navOrderStatus += 'Food Picked '
                    break;

                case '4':
                    navOrderStatus += 'Arrived'
                    break;

                case '5':
                    navOrderStatus += 'Delivered'
                    break;
            
                default:
                    break;
            }

            navOrderStatus +=' | Item : '
            navOrderStatus += rply.data.totalQuantity
            navOrderStatus += ', Rs. '
            navOrderStatus += rply.data.total_payable
            $('#lblOrderStatus').html(navOrderStatus);
            $('#lblRestaurentNameDelivery').html(rply.data.restaurant.restaurant_name);
            $('#lblRestaurentAddress').html(rply.data.restaurant.locality);
            $('#lblCustomerAddress').html(rply.data.orderDetail.shipping_address);

            $('#showHistoryTotal').html(rply.data.before_gst_total);
            $('#showHistoryDelivery').html(rply.data.deliv_charge);
            $('#showHistoryGST').html(rply.data.tot_gst_amt);
            $('#showHistoryCouponDiscount').html(rply.data.coupon_discount);
            $('#showHistoryTotalAmt').html(rply.data.total_payable);

           let menuIds = ''
            for (list in rply.data.menu){
                menuDetails += '<div class="row">'
                menuDetails += '<div class="col" style="text-align: left;">' + rply.data.menu[list].menuname + ' x ' + rply.data.menu[list].qty +'</div>'
                menuDetails += '<div class="col" style="text-align: right;">' + rply.data.menu[list].menusubtotal+'</div>'
                menuDetails += '</div>'
                menuIds += rply.data.menu[list].menu_id+','
            }
            menuIds = menuIds.slice(0,-1);
            $('#menuIds').html(menuIds);
            $('#restaurentId').html(rply.data.restaurant.restaurant_id);

            $('#lblOrderSummery').html(menuDetails);

            // This section for generate rateing
            let starGenerate = ''
            for (list in rply.data.menu){
                
                starGenerate += '<div class="row" id="ret' + rply.data.menu[list].menu + '">'
                starGenerate += '<div class="col-50">' + rply.data.menu[list].menuname +'</div>'
                starGenerate += '<div class="col-50">'
                if (rply.data.menu[list].rating == null) {
                    starGenerate += '<div class="stars">'
                    starGenerate += '<input type="radio" name="star' + rply.data.menu[list].menu + '"  class="star-1" id="star-1" />'
                    starGenerate += '<label class="star-1" onclick="app.rating(' + rply.data.restaurant.restaurant_id + ', ' + rply.data.menu[list].menu + ', 1,' + rply.data.orderID + ')" for="star-1">1</label>'
                    starGenerate += '<input type="radio" name="star' + rply.data.menu[list].menu + '" class="star-2" id="star-2" />'
                    starGenerate += '<label class="star-2"  onclick="app.rating(' + rply.data.restaurant.restaurant_id + ', ' + rply.data.menu[list].menu + ', 2,' + rply.data.orderID + ')" for="star-2">2</label>'
                    starGenerate += '<input type="radio" name="star' + rply.data.menu[list].menu + '" class="star-3" id="star-3" />'
                    starGenerate += '<label class="star-3" onclick="app.rating(' + rply.data.restaurant.restaurant_id + ', ' + rply.data.menu[list].menu + ', 3,' + rply.data.orderID + ')" for="star-3">3</label>'
                    starGenerate += '<input type="radio" name="star' + rply.data.menu[list].menu + '" class="star-4" id="star-4" />'
                    starGenerate += '<label class="star-4" onclick="app.rating(' + rply.data.restaurant.restaurant_id + ', ' + rply.data.menu[list].menu + ', 4,' + rply.data.orderID + ')" for="star-4">4</label>'
                    starGenerate += '<input type="radio"  name="star' + rply.data.menu[list].menu + '" class="star-5" id="star-5" />'
                    starGenerate += '<label class="star-5" onclick="app.rating(' + rply.data.restaurant.restaurant_id + ', ' + rply.data.menu[list].menu + ', 5,' + rply.data.orderID + ')" for="star-5">5</label>'
                    starGenerate += '<span></span>'
                    starGenerate += '</div>'
                }
                else{
                    starGenerate += '<span class="badge color-blue">' + rply.data.menu[list].rating +'</span>'
                }
                
                starGenerate += '</div>'
                starGenerate += '</div>'
            }
            $('#ratingsForm').html(starGenerate)

            if (rply.data.orderDetail.delivery_date !=""){
                $('#trackingMap').hide();
                $('#dvMenuRate').show();
            }
            else{
                let customerLocation = {
                    lat: parseFloat(localStorage.getItem('lat')),
                    lng: parseFloat(localStorage.getItem('lang'))
                };
                // let customerLocation = {
                //     lat: parseFloat(localStorage.getItem('lat')),
                //     lng: parseFloat(localStorage.getItem('lang'))
                // };
                var map = new google.maps.Map(document.getElementById('trackingMap'), {
                    center: customerLocation,
                    zoom: 12,
                    mapTypeControl: false,
                    disableDefaultUI: false,
                    styles: [{
                        elementType: 'geometry',
                        stylers: [{ color: '#f5f5f5' }]
                    },
                    {
                        elementType: 'labels.icon',
                        stylers: [{ visibility: 'on' }]
                    },
                    {
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#616161' }]
                    },
                    {
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#9a9a9a' }]
                    },
                    {
                        featureType: 'administrative.land_parcel',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#bdbdbd' }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'geometry',
                        stylers: [{ color: '#9a9a9a' }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#757575' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#e5e5e5' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9e9e9e' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#ffffff' }]
                    },
                    {
                        featureType: 'road.arterial',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#757575' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#dadada' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#616161' }]
                    },
                    {
                        featureType: 'road.local',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9e9e9e' }]
                    },
                    {
                        featureType: 'transit.line',
                        elementType: 'geometry',
                        stylers: [{ color: '#e5e5e5' }]
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'geometry',
                        stylers: [{ color: '#eeeeee' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#c9c9c9' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9e9e9e' }]
                    }
                    ]
                });
                var directionsDisplay = new google.maps.DirectionsRenderer({
                    map: map,
                    suppressMarkers: false
                });
                var directionsService = new google.maps.DirectionsService();
                
                app.trackOrder(map);
            }
        });
        // console.log(customerLocation)
        // latlng = new google.maps.LatLng(39.305, -76.617);
        // console.log(latlng)
        
    },

    resturentListByType: function () {
        let generalRestaurents = ''
        $.ajax({
            type: "post",
            url: serverUrl + 'restaurant_general_list_without_limit',
            dataType: "JSON"
        }).done(function (rply) {
            for (list in rply.restaurant) {

                generalRestaurents += '<li>'
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open") {
                    generalRestaurents += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '/' + rply.restaurant[list].restaurant_name + '/" class="item-content" style="color:#676767;">'
                    generalRestaurents += '<div class="item-media">'
                    generalRestaurents += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
                }
                else {
                    let cloaseMessage = "Restaurest will open at : " + rply.restaurant[list].opening_time
                    generalRestaurents += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage + '\')" class="item-content" style="color:#676767;">'
                    generalRestaurents += '<div class="item-media">'
                    generalRestaurents += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;-webkit-filter: grayscale(100%); filter: grayscale(100%);"/>'
                }
                generalRestaurents += '</div>'
                generalRestaurents += '<div class="item-inner">'
                generalRestaurents += '<div class="item-title-row">'
                generalRestaurents += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.restaurant[list].restaurant_name + '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '<div class="item-subtitle" style="font-size: 12px;">' + rply.restaurant[list].cuisine_tags + '</div>'
                generalRestaurents += '<hr style="height: 0px; color: #fff;">'
                generalRestaurents += '<div class="item-subtitle">'
                generalRestaurents += '<div class="row">'
                generalRestaurents += '<div class="col-40" style="font-size: 12px;">'
                generalRestaurents += '<i class="icon material-icons md-only" style="font-size: 18px;margin-right: -5px;">star</i>' + rply.restaurant[list].avg_rating
                generalRestaurents += '</div>'
                generalRestaurents += '<div class="col-60" style="font-size: 12px;text-align: right;">'
                generalRestaurents += '<img src="img/iconset/rupee.png" style="height: 14px;margin-bottom: -3px;">'
                generalRestaurents += '<span>' + rply.restaurant[list].two_person_cost + ' FOR TWO</span>'
                generalRestaurents += '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '</div>'
                generalRestaurents += '</a>'
                generalRestaurents += '</li>'
                $('#lblRestaurent').html(generalRestaurents)
            }
        });
    },

    // This Function For Wishist
    userWishlist : function(){
        let favouritesMenu=''
        let resName =''
        $.ajax({
            type: "post",
            url: serverUrl + 'menu_liks_user',
            data: {user : user},
            dataType: "JSON"
        }).done(function(rply){
            console.log(rply);
            for (list in rply.like_menus){
                favouritesMenu += '<li>'
                favouritesMenu += '<div class="item-content" style="color:#676767;">'
                favouritesMenu += '<div class="item-media">'
                favouritesMenu += '<img src="http://platterexoticfood.com/pladmin/uploads/menu/' + rply.like_menus[list].menuimg + '" style="height: 50px; width: 50px;">'
                favouritesMenu += '</div>'
                favouritesMenu += '<div class="item-inner">'
                favouritesMenu += '<div class="item-title-row">'
                favouritesMenu += '<a href="/menu-details/' + rply.like_menus[list].menu_id + '/' + rply.like_menus[list].menuname + '/' + rply.like_menus[list].restaurant_name + '/' +  rply.like_menus[list].restaurant_id + '/">'
                favouritesMenu += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.like_menus[list].menuname+'</div>'
                favouritesMenu += '</a>'
                favouritesMenu += '</div>'
                favouritesMenu += '<div class="item-subtitle" style="font-size: 12px;">'
                favouritesMenu += '<div class="row">'
                favouritesMenu += '<span>' + rply.like_menus[list].restaurant_name +'</span>'
                favouritesMenu += '</div>'
                favouritesMenu += '</div>'
                favouritesMenu += '</div>'
                favouritesMenu += '</div>'
                favouritesMenu += '</li>'
            }
            if (favouritesMenu=="")
            {
                favouritesMenu += '<li>No Menu Found</li>'
            }
            $('#lblFavourites').html(favouritesMenu);
        });
    },

    // 

    // This section For Search Result
    searchResult:function(searchQuery){
        let searchValue =''
        //lang : 88.3785082
        //lat : 22.4724863
       $.ajax({
           type: "post",
           url: serverUrl + "search_dish/",
           //data: { dishname: searchQuery,resttype:'all', cuisine: 'all', lat: localStorage.getItem('lat'), lang: localStorage.getItem('lang'),user:user, pincode:  localStorage.getItem('curr_pin')},
           data: { dishname: searchQuery, resttype: 'all', cuisine: 'all', lat: '22.4724863', lang: '88.3785082', user: user, pincode: '700047'},
           dataType: "JSON"
       }).done(function(rply){
           console.log(rply)
           for (list in rply.menu_data) {
               searchValue += '<li>'
               if (app.isRestaurantOpen(rply.menu_data[list].opening_time, rply.menu_data[list].closing_time) == "open") {
                   searchValue += '<a href="/restaurent-details/' + rply.menu_data[list].restaurant_id + '/' + rply.menu_data[list].restaurant_name + '/" class="item-content" style="color:#676767;">'
                   searchValue += '<div class="item-media">'
                   searchValue += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.menu_data[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
               }
               else {
                   let cloaseMessage = "Restaurest will open at : " + rply.menu_data[list].opening_time
                   searchValue += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage + '\')" class="item-content" style="color:#676767;">'
                   searchValue += '<div class="item-media">'
                   searchValue += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.menu_data[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;-webkit-filter: grayscale(100%); filter: grayscale(100%);"/>'
               }
               searchValue += '</div>'
               searchValue += '<div class="item-inner">'
               searchValue += '<div class="item-title-row">'
               searchValue += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.menu_data[list].restaurant_name + '</div>'
               searchValue += '</div>'
               searchValue += '<div class="item-subtitle" style="font-size: 12px;">' + rply.menu_data[list].cuisine_tags + '</div>'
               searchValue += '<hr style="height: 0px; color: #fff;">'
               searchValue += '<div class="item-subtitle">'
               searchValue += '<div class="row">'
               searchValue += '<div class="col-40" style="font-size: 12px;">'
               searchValue += '<i class="icon material-icons md-only" style="font-size: 18px;margin-right: -5px;">star</i>' + rply.menu_data[list].avg_rating
               searchValue += '</div>'
               searchValue += '<div class="col-60" style="font-size: 12px;text-align: right;">'
               searchValue += '<img src="img/iconset/rupee.png" style="height: 14px;margin-bottom: -3px;">'
               searchValue += '<span>' + rply.menu_data[list].two_person_cost + ' FOR TWO</span>'
               searchValue += '</div>'
               searchValue += '</div>'
               searchValue += '</div>'
               searchValue += '</div>'
               searchValue += '</a>'
               searchValue += '</li>'

               if (searchQuery.length===0)
               {
                   $('#lblRestaurentSearchList').html('')
               }
               else{
                   $('#lblRestaurentSearchList').html(searchValue)
               }
               
           }
       });
    },

    // This function for Get all Cuisine 
    getCuisine : function(){
        let cusineType = ''
          $.ajax({
              type: "POST",
              url: serverUrl + "get_cuisine",
              dataType: "JSON"
          }).done(function(rply){
              for (list in rply.cuisines){
                  cusineType += '<li>'
                  cusineType += '<label class="item-checkbox item-content">'
                  cusineType += '<input type="checkbox" value=' + rply.cuisines[list].tag_name + ' name="chkCuisine" class="ckh" />'
                  cusineType += '<i class="icon icon-checkbox"></i>'
                  cusineType += '<div class="item-inner">'
                  cusineType += '<div class="item-title">' + rply.cuisines[list].tag_name +'</div>'
                  cusineType += '</div>'
                  cusineType += '</label>'
                  cusineType += '</li>'
              }
              $('#lblCuisinesForFilter').html(cusineType)
          });  


        
    },

    // This Function For Filter Result
    filter : function(){
        // console.log($('input[name=rdoRestype]:checked').val())
        // console.log($('#lblVegOnly').checked)
        let filterType = ''
        if ($('#lblVegOnly').is(':checked'))
        {
            // console.log('Checked');
            filterType = 'Non-vegeterian'
        }
        else{
            // console.log('All');
            filterType = 'Vegeterian'
        }
        let str 
        let filterRestaurents = ''
        let checkboxes = document.getElementsByName('chkCuisine');
        let selected = [];
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    selected.push(checkboxes[i].value);
                }
            }
            if (selected == '') {
                str = 'all'
            } else {
                str = (selected);
            }
       // console.log(arr);
        $.ajax({
            type: "post",
            url: serverUrl + "restaurant_listsearch",
            data: { resttype: filterType, cuisine: str.toString(), lat: parseFloat(localStorage.getItem('lat')), lang: parseFloat(localStorage.getItem('lang'))},
            dataType: "JSON"
        }).done(function(rply){
            $('#normalListing').hide();
            for (list in rply.restaurant) {
                filterRestaurents += '<li>'
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open") {
                    filterRestaurents += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '/' + rply.restaurant[list].restaurant_name + '/" class="item-content" style="color:#676767;">'
                    filterRestaurents += '<div class="item-media">'
                    filterRestaurents += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
                }
                else {
                    let cloaseMessage = "Restaurest will open at : " + rply.restaurant[list].opening_time
                    filterRestaurents += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage + '\')" class="item-content" style="color:#676767;">'
                    filterRestaurents += '<div class="item-media">'
                    filterRestaurents += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;-webkit-filter: grayscale(100%); filter: grayscale(100%);"/>'
                }
                filterRestaurents += '</div>'
                filterRestaurents += '<div class="item-inner">'
                filterRestaurents += '<div class="item-title-row">'
                filterRestaurents += '<div class="item-title" style="font-size: 14px; font-weight: bold;">' + rply.restaurant[list].restaurant_name + '</div>'
                filterRestaurents += '</div>'
                filterRestaurents += '<div class="item-subtitle" style="font-size: 12px;">' + rply.restaurant[list].cuisine_tags + '</div>'
                filterRestaurents += '<hr style="height: 0px; color: #fff;">'
                filterRestaurents += '<div class="item-subtitle">'
                filterRestaurents += '<div class="row">'
                filterRestaurents += '<div class="col-40" style="font-size: 12px;">'
                filterRestaurents += '<i class="icon material-icons md-only" style="font-size: 18px;margin-right: -5px;">star</i>' + rply.restaurant[list].avg_rating
                filterRestaurents += '</div>'
                filterRestaurents += '<div class="col-60" style="font-size: 12px;text-align: right;">'
                filterRestaurents += '<img src="img/iconset/rupee.png" style="height: 14px;margin-bottom: -3px;">'
                filterRestaurents += '<span>' + rply.restaurant[list].two_person_cost + ' FOR TWO</span>'
                filterRestaurents += '</div>'
                filterRestaurents += '</div>'
                filterRestaurents += '</div>'
                filterRestaurents += '</div>'
                filterRestaurents += '</a>'
                filterRestaurents += '</li>'
                
            }
            $('#lblFilterRestaurents').html(filterRestaurents)
            $('#lblFilterRestaurentCount').html(rply.totrescount +" Restaurants Found");
            $('#filterResult').show();
        });
    },

    // This function for reset filter
    filterReset: function(){
        $("input[name='chkCuisine']:checkbox").prop('checked', false);
        $('input[name=rdoRestype]:checked').prop('checked', false);
        $('#normalListing').show();
        $('#filterResult').hide();
    },

    // This function for get lattitude and logitude
    getCurrentLocation : function(){
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, { 
            maximumAge: 3000, 
            timeout: 5000, 
            enableHighAccuracy: true 
        });
        function geolocationSuccess(position){
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
            localStorage.setItem('lat', position.coords.latitude);
            localStorage.setItem('lang', position.coords.longitude);
            let geocoder = new google.maps.Geocoder;
            geocoder.geocode({
                'location': {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            }, function (results, status) {
                if (status === 'OK') {
                    if (results) {
                        console.log(results);
                        console.log(results[0].formatted_address);
                        localStorage.setItem('currentAddress', results[0].formatted_address);
                        localStorage.setItem('curr_pin', parseInt(results[0].address_components[results[0].address_components.length - 1].long_name));

                        $.ajax({
                            type: "post",
                            url: serverUrl + "pin_verify",
                            data: { pin: parseInt(results[0].address_components[results[0].address_components.length - 1].long_name) },
                            dataType: "JSON"
                        }).done(function(rply){
                            if (rply.status) {
                                localStorage.setItem('area', rply.locality);
                                if (localStorage.getItem('story_done') == 1) {
                                    window.location.href = "home.html";
                                }
                                else {
                                    window.location.href = "story.html";
                                }
                            }
                            else{
                                window.plugins.toast.showLongBottom('Currently no availavble in your area');
                            }
                        });
                    } else {
                        window.plugins.toast.showLongBottom('Unable to detect location automatically. Please enter your Address manually By Clicking Set Your Location.');

                    }
                } else {
                    window.plugins.toast.showLongBottom('Unable to detect location automatically. Please enter your Address manually By Clicking Set Your Location.');
                }
            });
        }

        function geolocationError(error){
            window.plugins.toast.showLongBottom('Platter can\'t detect your location, Trun on location or select address manualy ');
        }
    },

    // This function for get current location manualy
    manualLocation : function(){
        let address = $('#txtManualAddress').val();
        let houseNo = $('#txtManualHouseNo').val();
        let landMark = $('#txtManualLandMark').val();
        let pinCode= $('#txtManualPin').val();
        let currentAddress = address + ', ' + houseNo + ', ' + landMark + ', ' + ', '+ pinCode
        
        localStorage.setItem('currentAddress', currentAddress);
        localStorage.setItem('curr_pin', parseInt(pinCode));

        $.ajax({
            type: "post",
            url: serverUrl + "pin_verify",
            data: { pin: parseInt(pinCode) },
            dataType: "JSON"
        }).done(function (rply) {
            if (rply.status) {
                localStorage.setItem('area', rply.locality);
                if (localStorage.getItem('story_done') == 1) {
                    window.location.href = "home.html";
                }
                else {
                    window.location.href = "story.html";
                }
            }
            else {
                window.plugins.toast.showLongBottom('Currently no availavble in your area');
            }
        });
    },

    // this function for Track Order
    trackOrder : function(map){
        let customerLocation = {
            lat: parseFloat(localStorage.getItem('lat')),
            lng: parseFloat(localStorage.getItem('lang'))
        };
        $.ajax({
            type: "post",
            url: serverUrl + "get_delivery_status",
            data: { orderID: parseFloat($('#lblOrderId').html()) },
            dataType: "json"
        }).done(function (rply) {
            console.log(rply)
            var directionsService = new google.maps.DirectionsService();
            if (rply.isRestaurantAccepted) {
                // let restaurentIcon = 'img/restaurent.png'
                let customerIcon = 'img/customer.png'
                let restaurentLocation = {
                    lat: parseFloat(rply.restaurantLocation.lat),
                    lng: parseFloat(rply.restaurantLocation.lng)
                }
                marker = new google.maps.Marker({ position: restaurentLocation, icon: restaurentIcon, map: map });
                marker = new google.maps.Marker({ position: customerLocation, icon: customerIcon, map: map });
                
                var directionsDisplay2 = new google.maps.DirectionsRenderer({
                    map: map,
                    suppressMarkers: true
                });
                var directionsService2 = new google.maps.DirectionsService();
            }
            if (rply.isPickedUp) {

                // let deliveryBoyImg= rply.deliveryBoy.image
                let callDriver = ''
                callDriver += '<a href="tel:' + rply.deliveryBoy.mobile + '" class="link external">'
                callDriver += '<img src="img/call.png" width="20">'
                callDriver += '</a>'

                $('#imgDeliveryBoyImage').attr('src', rply.deliveryBoy.image)
                $('#lblDeliveryBoyInfo').html('<strong>' + rply.deliveryBoy.name + '</strong> Has been assign to drop your order')
                $('#lblDeliveryBoyCall').html(callDriver)
                try {
                    line.setMap(null);
                }
                catch (e) {
                    console.log(e);
                }

               var line = new google.maps.Polyline({
                    path: [{
                        lat: parseFloat(rply.restaurantLocation.lat),
                        lng: parseFloat(rply.restaurantLocation.lng)
                    }, customerLocation],
                    strokeOpacity: 0,
                    icons: [{
                        icon: {
                            path: 'M 0,-1 0,1',
                            strokeOpacity: 1,
                            scale: 2
                        },
                        offset: '0',
                        repeat: '15px'
                    }],
                    map: map
                });
                lastRestaurant = {
                    lat: parseFloat(rply.restaurantLocation.lat),
                    lng: parseFloat(rply.restaurantLocation.lng)
                };
                var latlngbounds = new google.maps.LatLngBounds();
                latlngbounds.extend(lastRestaurant);
                latlngbounds.extend(customerLocation);
                //map.fitBounds(latlngbounds);
                let restaurentIcon = 'img/restaurent.png'
                let customerIcon = 'img/customer.png'
                marker = new google.maps.Marker({ position: lastRestaurant, icon: restaurentIcon, map: map });
                marker = new google.maps.Marker({ position: customerLocation, icon: customerIcon, map: map });
            }
            else {
                //line.setMap(null);
               // line = null;
            }

            if (rply.deliveryBoy.name && rply.isPickedUp && !rply.isDelivered) {
                deliboylocation = { lat: parseFloat(rply.deliveryBoy.lat), lng: parseFloat(rply.deliveryBoy.lng) };
                let request = {
                    destination: customerLocation,
                    origin: deliboylocation,
                    travelMode: 'DRIVING'
                };
                directionsService.route(request, function (response, status) {
                    if (status == 'OK') {
                        // Display the route on the map.
                        directionsDisplay2 = new google.maps.DirectionsRenderer({
                            map: map,
                            suppressMarkers: true
                        });
                        directionsDisplay2.setDirections(response);
                        console.log(response)
                        var leg = response.routes[0].legs[0];
                        let lastPosi
                        let startMarkerHeading
                        let endMarker
                        if (!lastPosi) {
                            lastPosi = leg.start_location
                        }
                        var heading = google.maps.geometry.spherical.computeHeading(lastPosi, leg.start_location);
                        if (startMarkerHeading == null) {
                            startMarkerHeading = heading
                        }
                        if (heading !== 0) {
                            startMarkerHeading = heading
                        }
                        if (startMarkerHeading < 0) {
                            startMarkerHeading = 360 + startMarkerHeading
                        }
                        lastPosi = leg.start_location;
                        var imageno = 0;
                        if (startMarkerHeading >= 22.5 && startMarkerHeading < 67.5) {
                            imageno = 1
                        }
                        if (startMarkerHeading >= 67.5 && startMarkerHeading < 112.5) {
                            imageno = 2
                        }
                        if (startMarkerHeading >= 112.5 && startMarkerHeading < 157.5) {
                            imageno = 3
                        }
                        if (startMarkerHeading >= 157.5 && startMarkerHeading < 202.5) {
                            imageno = 4
                        }
                        if (startMarkerHeading >= 202.5 && startMarkerHeading < 247.5) {
                            imageno = 5
                        }
                        if (startMarkerHeading >= 247.5 && startMarkerHeading < 292.5) {
                            imageno = 6
                        }
                        if (startMarkerHeading >= 292.5 && startMarkerHeading < 337.5) {
                            imageno = 7
                        }
                        if (startMarkerHeading >= 337.5) {
                            imageno = 0
                        }
                        console.log('Current heading = ' + startMarkerHeading + '   ||   Current image no = ' + imageno);
                        let startMarker
                        if (!startMarker) {
                            //new marker
                            startMarker = new google.maps.Marker({
                                position: leg.start_location,
                                map: map,
                                icon: {
                                    url: 'img/scooter' + imageno + '.png',
                                    scaledSize: new google.maps.Size(40, 40),
                                    origin: new google.maps.Point(0, 0),
                                    anchor: new google.maps.Point(20, 20)
                                },
                                title: 'Delivery Agent'
                            });
                        } else {
                            //move marker
                            startMarker.setIcon({
                                url: 'img/scooter' + imageno + '.png',
                                scaledSize: new google.maps.Size(40, 40),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(20, 20)
                            });
                            startMarker.setPosition(leg.start_location);
                        }
                        // if (!endMarker) {
                        //   //new marker
                        //   endMarker = new google.maps.Marker({
                        //     position: leg.end_location,
                        //     map: map,
                        //     icon: {
                        //       url: 'img/destination.png',
                        //       scaledSize: new google.maps.Size(32, 32),
                        //       origin: new google.maps.Point(0, 0),
                        //       anchor: new google.maps.Point(16, 32)
                        //     },
                        //     title: 'Destination'
                        //   });
                        // } else {
                        //   //move marker
                        //   endMarker.setPosition(leg.end_location);
                        // }
                    }
                });
            }
            else {
                try {
                    startMarker.setMap(null);
                    startMarker = null;
                    endMarker.setMap(null);
                    endMarker = null;
                } catch (e) {
                }
            }

            if (rply.isDelivered) {
                $('#trackingMap').hide();
                $('#imgDeliveryBoyImage').attr('src', rply.deliveryBoy.image)
                $('#lblDeliveryBoyInfo').html('Order Delivered By - ' + rply.deliveryBoy.name)
                $('#lblDeliveryBoyCall').html('');
                $('#dvMenuRate').show();
            }
        });
        setTimeout(function () {
            app.trackOrder()
        }, 5000);
    },

    // This Function For Rateing And Review
    rating: function (restaurentId, menuId, rval, orderId){
        
        let rateId = '#ret' + menuId
        console.log(rateId)
        $.ajax({
            type: "post",
            url: serverUrl + 'menu_rating',
            data: { user: user, restId: restaurentId, menuId: menuId, rval: rval, orderId: orderId },
            dataType: "json"
        }).done(function(rply){
            console.log(rply)
            if (rply.success){
                $(rateId).hide();
                window.plugins.toast.showLongBottom('Rate Successfully');
            }
        });

    },

    // This Section For Log out
    logout: function(){
        if (localStorage.getItem('facebookID')!=""){
            CordovaFacebook.logout();     
        }
        localStorage.clear()
        window.location.href="index.html"
    },

    // This Finction for get common chat
    getChat: function(chatType) {
        
        // console.log(chatType)
        setTimeout(function() {
            let chatMessages = ''
            let url
            if (chatType == "0") {
                url = serverUrl + 'get_chat_common/'
            }
            else {
                url = serverUrl + 'get_cart/'
            }
            $.ajax({
                type: "post",
                url: url,
                data: { user: user },
                dataType: "json",
                timeout: 3000
            }).done(function (rply) {                
                for (list in rply.chat_contents) {
                    if (rply.chat_contents[list].customer_mobile != user) {
                        chatMessages += '<div class="message message-received">'
                        chatMessages += '<div class="message-content">'
                        chatMessages += '<div class="message-name">' + rply.chat_contents[list].customer_name + '</div>'
                        chatMessages += '<div class="message-bubble">'
                        chatMessages += '<div class="message-text-header">' + rply.chat_contents[list].chat_date_time + '</div>'
                        chatMessages += '<div class="message-text">' + rply.chat_contents[list].message + '</div>'
                        chatMessages += '<div class="message-text-footer"></div>'
                        chatMessages += '</div>'
                        chatMessages += '</div>'
                        chatMessages += '</div>'
                    }
                    else {
                        chatMessages += '<div class="message message-sent" style="margin-left: 30%;">'
                        chatMessages += '<div class="message-content">'
                        chatMessages += '<div class="message-name">' + rply.chat_contents[list].customer_name + '</div>'
                        chatMessages += '<div class="message-bubble">'
                        chatMessages += '<div class="message-text-header">' + rply.chat_contents[list].chat_date_time + '</div>'
                        chatMessages += '<div class="message-text">' + rply.chat_contents[list].message + '</div>'
                        chatMessages += '<div class="message-text-footer">sent</div>'
                        chatMessages += '</div>'
                        chatMessages += '</div>'
                        chatMessages += '</div>'
                    }
                }
                $('#message').html(chatMessages);
            });
           
        }, 1000);
        
            if (counter==2){
                $$(".page-content").scrollTop(10000, 400);
                counter = parseInt(counter) + 1;
            }
        
        
        // setTimeout(app.getChat(chatType), 10000);
        chatTimeOut = setTimeout(function () {
            counter = parseInt(counter) + 1;
            app.getChat(chatType)
        }, 1000);
    },

    // This function For Send Message
    sendMessage: function (chatType){
        let messageContent = $('#txtMessage').val();
        $.ajax({
            type: "post",
            url: serverUrl + "send_chat",
            data: { user: user, to: chatType, message: messageContent},
            dataType: "JSON"
        }).done(function(rply){
            $('#txtMessage').val('');
            
        });
    },
    payOnline:function(){
        
            var orderId = Date.now();
            var orderCreationRequest = new XMLHttpRequest();
            orderCreationRequest.open('POST', 'https://sandbox.juspay.in/order/create', true, 'D97D086A3D9C4E5387F29B812F231CA3', '');
            orderCreationRequest.withCredentials = true;

            orderCreationRequest.setRequestHeader('Authorization', 'A6CDDF307DDF45F796BD025B605A1A9F');
            orderCreationRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            var errorCallback = function () {
                body.classList.remove('active');
                body.classList.add('error');

                window.setTimeout(function () {
                    body.classList.remove('error');
                    body.classList.add('active');
                }, 2000);
            };

            var successCallback = function () {
                body.classList.remove('active');
                body.classList.add('success');

                window.setTimeout(function () {
                    body.classList.remove('success');
                    body.classList.add('active');
                }, 2000);
            };


            orderCreationRequest.onreadystatechange = function () {
                if (orderCreationRequest.readyState == 4) {
                    if (orderCreationRequest.status == 200) {
                        ExpressCheckout.startCheckoutActivity({
                            endUrls: ['https://shop.com/juspay-response/.*'],
                            onEndUrlReached: function () {
                                successCallback();
                            },
                            onTransactionAborted: function () {
                                errorCallback();
                            },
                            environment: 'PRODUCTION',
                            instruments: [],
                            parameters: {
                                orderId: '1464119848',
                                merchantId: 'platter'
                            }
                        });
                    } else {
                        errorCallback();
                    }
                }
            };
            orderCreationRequest.send('order_id=' + orderId + '&amount=1.00');
    },
    // receivedEvent: function (id) {
    //     var body = document.getElementsByTagName('body')[0];
    //     body.classList.remove('inactive');
    //     body.classList.add('active');

    //     document.querySelector('#advert').onclick = function () {
    //         var orderId = Date.now();
    //         var orderCreationRequest = new XMLHttpRequest();
    //         orderCreationRequest.open('POST', 'https://sandbox.juspay.in/order/create', true, '9F64B727D4C048C08013EA0935BCBDB5', '');
    //         orderCreationRequest.withCredentials = true;

    //         orderCreationRequest.setRequestHeader('Authorization', 'OUY2NEI3MjdENEMwNDhDMDgwMTNFQTA5MzVCQ0JEQjU6');
    //         orderCreationRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    //         var errorCallback = function () {
    //             body.classList.remove('active');
    //             body.classList.add('error');

    //             window.setTimeout(function () {
    //                 body.classList.remove('error');
    //                 body.classList.add('active');
    //             }, 2000);
    //         };

    //         var successCallback = function () {
    //             body.classList.remove('active');
    //             body.classList.add('success');

    //             window.setTimeout(function () {
    //                 body.classList.remove('success');
    //                 body.classList.add('active');
    //             }, 2000);
    //         };


    //         orderCreationRequest.onreadystatechange = function () {
    //             if (orderCreationRequest.readyState == 4) {
    //                 if (orderCreationRequest.status == 200) {
    //                     ExpressCheckout.startCheckoutActivity({
    //                         endUrls: ['https:\\/\\/test.com.\\/'],
    //                         onEndUrlReached: function () {
    //                             successCallback();
    //                         },
    //                         onTransactionAborted: function () {
    //                             errorCallback();
    //                         },
    //                         environment: 'PRODUCTION',
    //                         instruments: [],
    //                         parameters: {
    //                             orderId: '1464119848',
    //                             merchantId: 'sachin_sharma'
    //                         }
    //                     });
    //                 } else {
    //                     errorCallback();
    //                 }
    //             }
    //         };
    //         orderCreationRequest.send('order_id=' + orderId + '&amount=1.00');
    //     }
    // }
};

function swipperminus(menu_id, restaurent_id) {
    let curretn_value = $('#' + menu_id).html();
    if (curretn_value != 0) {
        curretn_value = parseInt(curretn_value) - 1;
    }
    else {
        curretn_value = 0;
    }
    $('#' + menu_id).html(curretn_value);
    $.ajax({
        type: "POST",
        url: serverUrl + 'add_to_cart/',
        data: { user: localStorage.getItem('platuser'), restaurant: restaurent_id, menu: menu_id, qty: curretn_value },
        dataType: "JSON"
    }).done(function (rply) {
        if (rply.item_count < 1) {
            $('#lblDeliverySection').hide();
            $('#lblAddressSection').hide();
            $('#lblCartItemSection').hide();
            $('#lblCouponSection').hide();
            localStorage.setItem('couponCode', '');
            localStorage.setItem('couponGST', '');
            localStorage.setItem('couponFinalAmount', '');
            localStorage.setItem('couponDiscountAmount', '');
        }
        app.currentCartItems();
        window.plugins.toast.showLongBottom('Cart item update');
    });
}

function swipperadd(menu_id, resturent_id) {
    // 
    // $('#lblCartItemSection').show();
    // $('#lblCouponSection').show(); 
    let curretn_value = $('#' + menu_id).html();
    curretn_value = parseInt(curretn_value) + 1;
    $('#' + menu_id).html(curretn_value);
    $.ajax({
        type: "POST",
        url: serverUrl + 'add_to_cart/',
        data: { user: localStorage.getItem('platuser'), restaurant: resturent_id, menu: menu_id, qty: curretn_value },
        dataType: "JSON"
    }).done(function (rply) {
        app.currentCartItems();
        window.plugins.toast.showLongBottom('Cart item update');
    });
}

// This Function Add To Cart Menu Details Page
function swipperAddMenuDetails(menu_id, restaurant_id) {
    let tempHtmlId = menu_id
    menu_id = menu_id.split("_")
    let curretn_value = $('#' + tempHtmlId).html();
    curretn_value = parseInt(curretn_value) + 1;
    $('#' + tempHtmlId).html(curretn_value);
    $.ajax({
        type: "POST",
        url: serverUrl + 'add_to_cart/',
        data: { user: localStorage.getItem('platuser'), restaurant: restaurant_id, menu: menu_id[1], qty: curretn_value },
        dataType: "JSON"
    }).done(function (rply) {
        app.currentCartItems();
        window.plugins.toast.showLongBottom('Cart item update');
    });

}

function swipperMinusMenuDetails(menu_id, restaurant_id) {
    let tempHtmlId = menu_id
    menu_id = menu_id.split("_")
    let curretn_value = $('#' + tempHtmlId).html();
    if (curretn_value != 0) {
        curretn_value = parseInt(curretn_value) - 1;
    }
    else {
        curretn_value = 0;
    }
    $('#' + tempHtmlId).html(curretn_value);
    $.ajax({
        type: "POST",
        url: serverUrl + 'add_to_cart/',
        data: { user: localStorage.getItem('platuser'), restaurant: restaurent_id, menu: menu_id[1], qty: curretn_value },
        dataType: "JSON"
    }).done(function (rply) {
        if (rply.item_count < 1) {
            $('#lblDeliverySection').hide();
            $('#lblAddressSection').hide();
            $('#lblCartItemSection').hide();
            $('#lblCouponSection').hide();
        }
        app.currentCartItems();
        window.plugins.toast.showLongBottom('Cart item update');
    });

}






