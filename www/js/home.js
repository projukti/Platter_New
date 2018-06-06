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
            for (list in rply) {
                topFiveRestaurantData += '<div class="card" class="card" style="margin-bottom: 10px;">'
                topFiveRestaurantData += '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' + rply[list].restaurant_image + '" style="width:100%;">'
                topFiveRestaurantData += '</div>'
                $('#lblTopFiveRestaurents').html(topFiveRestaurantData)
            }
            
        }).fail();
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



