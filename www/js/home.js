var serverUrl ='http://platterexoticfood.com/pladmin/manage_api/'

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },

    onDeviceReady: function() {
        // Set Default Text And Value
        $('#lblLocality').html(localStorage.getItem('area')); //Display Area Here
        app.topFiveRestaurants();
        app.topTwelveRestaurants();
        app.generalRestaurants();
    },

    // Back Button Off 
    onBackKeyDown : function(){
        return false;
    },
    
    // Open Camera Using this section
    openCamera : function(){
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
                else {
                    window.plugins.toast.showLongBottom('Profile image update successfully');
                }
            }).fail();
        }

        function onFail(message){
            window.plugins.toast.showLongBottom('Failed because: ' + message);
        }
    },

    // Open Gallery Uisng this section
    openGellery : function() {
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
                else{
                    window.plugins.toast.showLongBottom('Profile image update successfully');
                }
            }).fail();
        }

        function onFail(message) {
            window.plugins.toast.showLongBottom('Failed because: ' + message);
        }
    },

    // This Section For Get Top 5 Restaurents
    topFiveRestaurants : function(){
        // console.log('here');
        let topFiveRestaurantData =''
        $.ajax({
            type: "POST",
            url: "http://platterexoticfood.com/pladmin/manage_api/restaurant_top_five_list/",
            dataType: "JSON"
        }).done(function (rply){
            for (list in rply.restaurant) {
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open"){
                    topFiveRestaurantData += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '/' + rply.restaurant[list].restaurant_name + '/">'
                    topFiveRestaurantData += '<div class="card" class="card" style="margin-bottom: 10px;">'
                    topFiveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" style="width:100%;">'
                }else{
                    let cloaseMessage = "Restaurest will open at : " + rply.restaurant[list].opening_time
                    topFiveRestaurantData += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage +'\')">'
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
    topTwelveRestaurants : function(){
        let topTwelveRestaurantData = '' 
        $.ajax({
            type: "POST",
            url: "http://platterexoticfood.com/pladmin/manage_api/restaurant_top_twelve_list/",
            dataType: "JSON"
        }).done(function (rply) {
            for (list in rply.restaurant) {
                topTwelveRestaurantData += '<li>'
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open")
                {
                    topTwelveRestaurantData += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '/' + rply.restaurant[list].restaurant_name + '/" class="item-content" style="color:#676767;">'
                    topTwelveRestaurantData += '<div class="item-media">'
                    topTwelveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
                }
                else{
                    let cloaseMessage = "Restaurest will open at : " + rply.restaurant[list].opening_time
                    topTwelveRestaurantData += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\''+cloaseMessage+'\')" class="item-content" style="color:#676767;">'
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
                topTwelveRestaurantData += '<span>' + rply.restaurant[list].two_person_cost +' FOR TWO</span>'
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
                    generalRestaurents += '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' + cloaseMessage +'\')" class="item-content" style="color:#676767;">'
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
    custToastMessage : function(message){
        window.plugins.toast.showLongBottom(message);
    },

    // This Function For Get Rastuent Menu List
    restaurentMenus : function(resid,resName){
        let popularDish = ''
        let vegDish = ''
        let nonVegDish = ''
        $.ajax({
            type: "post",
            url: serverUrl +'menu_list/',
            data: { id: resid, user: localStorage.getItem('platuser')}, 
            dataType: "JSON"
        }).done(function(rply){
            // This is for popular dishes
            // console.log(rply)
            for (list in rply.popular) {
                popularDish += '<li>'
                popularDish += '<div class="item-content" style="color:#676767;">'
                popularDish += '<div class="item-media">'
                popularDish += '<img src="http://platterexoticfood.com/pladmin/uploads/menu/' + rply.popular[list].menuimg + '" style="height: 50px; width: 50px;">'
                popularDish += '</div>'
                popularDish += '<div class="item-inner">'
                popularDish += '<div class="item-title-row">'
                popularDish += '<a href="/menu-details/' + rply.popular[list].menu_id + '/' + rply.popular[list].menuname + '/' + resName + '/' + resid +'/" >'
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
                popularDish += '<div class="stepper-button-minus" onclick="swipperminus(\'' + rply.popular[list].menu_id + '\')"></div>'
                popularDish += '<div class="stepper-value" id="' + rply.popular[list].menu_id + '">0</div>'
                popularDish += '<div class="stepper-button-plus" onclick="swipperadd(\'' + rply.popular[list].menu_id + '\')"></div>'
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
            for (list in rply.veg){
                vegDish += '<li>'
                vegDish += '<div class="item-content" style="color:#676767;">'
                vegDish += '<div class="item-media">'
                vegDish += '<img src="http://platterexoticfood.com/pladmin/uploads/menu/' + rply.veg[list].menuimg + '" style="height: 50px; width: 50px;">'
                vegDish += '</div>'
                vegDish += '<div class="item-inner">'
                vegDish += '<div class="item-title-row">'
                vegDish += '<a href="/menu-details/' + rply.veg[list].menu_id + '/' + rply.veg[list].menuname + '/' + resName + '/' + resid +'/">'
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
                vegDish += '<div class="stepper-button-minus" onclick="swipperminus(\''+rply.veg[list].menu_id+'\')"></div>'
                vegDish += '<div class="stepper-value" id="'+rply.veg[list].menu_id+'">0</div>'
                vegDish += '<div class="stepper-button-plus" onclick="swipperadd(\''+rply.veg[list].menu_id+'\')"></div>'
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
                nonVegDish += '<a href="/menu-details/' + rply.nonveg[list].menu_id + '/' + rply.nonveg[list].menuname + '/' + resName + '/' + resid +'/">'
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
                nonVegDish += '<div class="stepper-button-minus" onclick="swipperminus(\'' + rply.nonveg[list].menu_id + '\')"></div>'
                nonVegDish += '<div class="stepper-value" id="' + rply.nonveg[list].menu_id + '">0</div>'
                nonVegDish += '<div class="stepper-button-plus" onclick="swipperadd(\'' + rply.nonveg[list].menu_id + '\')"></div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</div>'
                nonVegDish += '</li>'
            }
            $('#lblNonVeg').html(nonVegDish);
        }).fail(function(rply){
        });
    },

    // This Section For Menu Details 
    menuDetails : function(menuId,resId){
        // Set Menu Image
        let nutritionValue = ''
        $.ajax({
            type: "post",
            url: serverUrl + 'menu_details',
            data: { id: resId, menu: menuId, user: localStorage.getItem('platuser')},
            dataType: "JSON"
        }).done(function (rply){
            // Set Background Menu Image
            $('#fileMenuImage').attr('src', 'http://platterexoticfood.com/pladmin/uploads/menu/' + rply.menu.menuimg);
            $('#lblMenuRateing').html('<i class="icon material-icons md-only" style="font-size: 14px;margin-right: -5px;">star</i> &nbsp; ' + rply.menu.avg_rating);
            $('#lblMenuPrice').html(rply.menu.menuprice);

            nutritionValue += '<table>'
            nutritionValue += '<tbody>'
            nutritionValue += '<tr style="margin-right: 12%;margin-left: -50%;">'
            for (list in rply.nutrition_value) {
                nutritionValue += '<td>' + rply.nutrition_value[list].nutrition_name + ' : ' + rply.nutrition_value[list].nutrival +'</td>'
            }
            nutritionValue += '</tr>'
            nutritionValue += '</tbody>'
            nutritionValue += '</table>'
            $('#tblNurition').html(nutritionValue);

            $('#lblMenuDetails').html(rply.menu.menudetails);

            // This Section For User Liked Or Not
            if (rply.user_like_menu == null || rply.user_like_menu.is_like == 0){
                $('#lblLikeStatus').attr('src', 'img/like.png');
                $('#lblLikeStatusTarget').html('');
            }
                
            else
            {
                $('#lblLikeStatus').attr('src', 'img/like_fill.png');
                $('#lblLikeStatusTarget').html('1');
            }
        });
    },

    // this section for menu like or dislike
    menuLikeDislike : function(){
        // Get Current Like Status
        let currentStatus = $('#lblLikeStatusTarget').html();
        let changeStstus = 0
        let menuId = $('#lblMenuId').html();
        if (currentStatus=='1'){
            changeStstus = 0
        }
        else{
            changeStstus = 1
        }
         
        $.ajax({
            type: "POST",
            url: serverUrl + "/user_like_menu",
            data: { id: menuId, user: localStorage.getItem('platuser'), like: changeStstus},
            dataType: "JSON"
        }).done(function(rply){
            if (changeStstus==0){
                $('#lblLikeStatus').attr('src', 'img/like.png');
                $('#lblLikeStatusTarget').html('');
            }   
            else{
                $('#lblLikeStatus').attr('src', 'img/like_fill.png');
                $('#lblLikeStatusTarget').html('1');
            }
        });
    }
    
};

function swipperminus(menu_id,restaurent_id) {
    let curretn_value = $('#' + menu_id).html();
    if (curretn_value!=0){
        curretn_value = parseInt(curretn_value)-1;
    }
    else{
        curretn_value =0;
    }
    $('#' + menu_id).html(curretn_value);
}

function swipperadd(menu_id,resturent_id) {
    let curretn_value = $('#' + menu_id).html();
    curretn_value = parseInt(curretn_value)+1;
    $('#' + menu_id).html(curretn_value);
}



