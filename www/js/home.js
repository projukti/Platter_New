var serverUrl = 'http://platterexoticfood.com/pladmin/manage_api/'

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },

    onDeviceReady: function () {
        // Set Default Text And Value
        $('#lblLocality').html(localStorage.getItem('area')); //Display Area Here
        app.topFiveRestaurants();
        app.topTwelveRestaurants();
        app.generalRestaurants();
    },

    // Back Button Off 
    onBackKeyDown: function () {
        return false;
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
            console.log(rply)
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
        });
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
            $('#lblCouponDiscount').html(rply.discount_amount)
            $('#lblGSTAmount').html(rply.gst_amount)
            $('#lblSubTotal').html(finalAmount)
            window.plugins.toast.showLongBottom('Coupon Code Applied Successfully');
        });
    }

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

// // Get geo coordinates

// function getMapLocation() {

//     navigator.geolocation.getCurrentPosition
//         (onMapSuccess, onMapError, { enableHighAccuracy: true });
// }

// // Success callback for get geo coordinates

// var onMapSuccess = function (position) {

//     Latitude = position.coords.latitude;
//     Longitude = position.coords.longitude;

//     getMap(Latitude, Longitude);

// }

// // Get map by using coordinates

// function getMap(latitude, longitude) {

//     var mapOptions = {
//         center: new google.maps.LatLng(0, 0),
//         zoom: 1,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//     };

//     map = new google.maps.Map
//         (document.getElementById("map"), mapOptions);


//     var latLong = new google.maps.LatLng(latitude, longitude);

//     var marker = new google.maps.Marker({
//         position: latLong
//     });

//     marker.setMap(map);
//     map.setZoom(15);
//     map.setCenter(marker.getPosition());
// }

// // Success callback for watching your changing position

// var onMapWatchSuccess = function (position) {

//     var updatedLatitude = position.coords.latitude;
//     var updatedLongitude = position.coords.longitude;

//     if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

//         Latitude = updatedLatitude;
//         Longitude = updatedLongitude;

//         getMap(updatedLatitude, updatedLongitude);
//     }
// }

// // Error callback

// function onMapError(error) {
//     console.log('code: ' + error.code + '\n' +
//         'message: ' + error.message + '\n');
// }

// // Watch your changing position

// function watchMapPosition() {

//     return navigator.geolocation.watchPosition
//         (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
// }



