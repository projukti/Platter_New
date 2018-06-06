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
                topFiveRestaurantData += '<div class="card" class="card" style="margin-bottom: 10px;">'
                topFiveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" style="width:100%;">'
                topFiveRestaurantData += '</div>'
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
            console.log(rply);
            for (list in rply.restaurant) {
                topTwelveRestaurantData += '<li>'
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open")
                {
                    topTwelveRestaurantData += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '" class="item-content" style="color:#676767;">'
                    topTwelveRestaurantData += '<div class="item-media">'
                    topTwelveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
                }
                else{
                    topTwelveRestaurantData += '<a href="javascript:void(0);" onclick="' + app.custToastMessage("Rasturant will open at : " + rply.restaurant[list].opening_time) +'" class="item-content" style="color:#676767;">'
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
            console.log(rply);
            for (list in rply.restaurant) {
                generalRestaurents += '<li>'
                if (app.isRestaurantOpen(rply.restaurant[list].opening_time, rply.restaurant[list].closing_time) == "open") {
                    generalRestaurents += '<a href="/restaurent-details/' + rply.restaurant[list].restaurant_id + '" class="item-content" style="color:#676767;">'
                    generalRestaurents += '<div class="item-media">'
                    generalRestaurents += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply.restaurant[list].restaurant_image + '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>'
                }
                else {
                    generalRestaurents += '<a href="javascript:void(0);" onclick="' + app.custToastMessage("Rasturant will open at : " + rply.restaurant[list].opening_time) +'" class="item-content" style="color:#676767;">'
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

}

function swipperadd(value) {
    let curretn_value = $('#' + value).html();
    curretn_value = parseInt(curretn_value)+1;
   
    $('#' + value).html(curretn_value);
    
}



