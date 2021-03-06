// Dom7
var $$ = Dom7;

// Framework7 App main instance
var newApp = new Framework7({
  root: "#app", // App root element
  id: "io.framework7.testapp", // App bundle ID
  name: "Platter", // App name
  theme: "md",
  pushStateSeparator: "#/",
  data: function() {
    return {
      user: {
        firstName: "John",
        lastName: "Doe"
      },
      // Demo products for Catalog section
      products: [
        {
          id: "1",
          title: "Apple iPhone 8",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis."
        },
        {
          id: "2",
          title: "Apple iPhone 8 Plus",
          description:
            "Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!"
        },
        {
          id: "3",
          title: "Apple iPhone X",
          description:
            "Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum."
        }
      ]
    };
    // { domCache: true, pushState: true };
  },
  // App root methods
  methods: {
    helloWorld: function() {
      newApp.dialog.alert("Hello World!");
    },
    dialog: {
      // set default title for all dialog shortcuts
      title: "Platter"
    }
  },
  // App routes
  routes: routes
});

// Init/Create views
var homeView = newApp.views.create("#view-home", {
  url: "/"
});
var catalogView = newApp.views.create("#view-catalog", {
  url: "/catalog/"
});
var cartView = newApp.views.create("#view-cart", {
  url: "/cart/"
});
var accountView = newApp.views.create("#view-account", {
  url: "/account-user/"
});
var chatView = newApp.views.create("#view-chat", {
  url: "/chat/"
});
var searchView = newApp.views.create("#view-search", {
  url: "/request-and-load/user/123456/"
});
var searchbar = newApp.searchbar.create({
  el: ".searchbar",
  searchContainer: ".list",
  searchIn: ".item-title",
  on: {
    search(sb, query, previousQuery) {
      let searchValue = "";
      $.ajax({
        type: "post",
        url: serverUrl + "search_dish/",
        //data: { dishname: searchQuery,resttype:'all', cuisine: 'all', lat: localStorage.getItem('lat'), lang: localStorage.getItem('lang'),user:user, pincode:  localStorage.getItem('curr_pin')},
        data: {
          dishname: query,
          resttype: "all",
          cuisine: "all",
          lat: "22.4724863",
          lang: "88.3785082",
          user: user,
          pincode: "700047"
        },
        dataType: "JSON"
      }).done(function(rply) {
        console.log(rply);
        for (list in rply.menu_data) {
          searchValue += "<li>";
          if (
            app.isRestaurantOpen(
              rply.menu_data[list].opening_time,
              rply.menu_data[list].closing_time
            ) == "open"
          ) {
            searchValue +=
              '<a href="/restaurent-details/' +
              rply.menu_data[list].restaurant_id +
              "/" +
              rply.menu_data[list].restaurant_name +
              '/" class="item-content" style="color:#676767;">';
            searchValue += '<div class="item-media">';
            searchValue +=
              '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' +
              rply.menu_data[list].restaurant_image +
              '" width="80" style="border-radius: 50%;height: 85px;width: 85px;"/>';
          } else {
            let cloaseMessage =
              "Restaurest will open at : " + rply.menu_data[list].opening_time;
            searchValue +=
              '<a href="javascript:void(0);" onclick="javascript:app.custToastMessage(\'' +
              cloaseMessage +
              '\')" class="item-content" style="color:#676767;">';
            searchValue += '<div class="item-media">';
            searchValue +=
              '<img src="http://platterexoticfood.com/pladmin/uploads/restaurant/' +
              rply.menu_data[list].restaurant_image +
              '" width="80" style="border-radius: 50%;height: 85px;width: 85px;-webkit-filter: grayscale(100%); filter: grayscale(100%);"/>';
          }
          searchValue += "</div>";
          searchValue += '<div class="item-inner">';
          searchValue += '<div class="item-title-row">';
          searchValue +=
            '<div class="item-title" style="font-size: 14px; font-weight: bold;">' +
            rply.menu_data[list].restaurant_name +
            "</div>";
          searchValue += "</div>";
          searchValue +=
            '<div class="item-subtitle" style="font-size: 12px;">' +
            rply.menu_data[list].cuisine_tags +
            "</div>";
          searchValue += '<hr style="height: 0px; color: #fff;">';
          searchValue += '<div class="item-subtitle">';
          searchValue += '<div class="row">';
          searchValue += '<div class="col-40" style="font-size: 12px;">';
          searchValue +=
            '<i class="icon material-icons md-only" style="font-size: 18px;margin-right: -5px;">star</i>' +
            rply.menu_data[list].avg_rating;
          searchValue += "</div>";
          searchValue +=
            '<div class="col-60" style="font-size: 12px;text-align: right;">';
          searchValue +=
            '<img src="img/iconset/rupee.png" style="height: 14px;margin-bottom: -3px;">';
          searchValue +=
            "<span>" + rply.menu_data[list].two_person_cost + " FOR TWO</span>";
          searchValue += "</div>";
          searchValue += "</div>";
          searchValue += "</div>";
          searchValue += "</div>";
          searchValue += "</a>";
          searchValue += "</li>";

          $("#normalListing").hide();
          $("#lblFilterRestaurents").html(searchValue);
          $("#lblFilterRestaurentCount").html("Match Restaurents");
          $("#filterResult").show();

          // if (searchQuery.length === 0) {
          //   $('#lblRestaurentSearchList').html('')
          // }
          // else {
          //   $('#lblRestaurentSearchList').html(searchValue)
          // }
        }
      });

      if (query == "") {
        $("#filterResult").hide();
        $("#lblFilterRestaurents").html("");
        $("#lblFilterRestaurentCount").html("");
        $("#normalListing").show();
      }
    },
    enable: function() {
      console.log("Searchbar enabled");
    },
    disable: function() {
      $("#filterResult").hide();
      $("#lblFilterRestaurents").html("");
      $("#lblFilterRestaurentCount").html("");
      $("#normalListing").show();
    }
  }
});

// Init/Create left panel view
// var mainView = app.views.create('.view-left', {
//   url: '/'
// });

// Init/Create main view
var mainView = newApp.views.create(".view-main", {
  url: "/"
});
// Init Messagebar

// Login Screen Demo
$$(".login-screen .login-button").on("click", function() {
  console.log("Here");
  // var username = $$('#login-screen [name="username"]').val();
  // var password = $$('#login-screen [name="password"]').val();

  // // Close login screen
  // app.loginScreen.close('login-screen');

  // // Alert username and password
  // app.dialog.alert('Username: ' + username + '<br>Password: ' + password);
});

// app.onPageInit(function (page) {
//   if (page.name == "chat_details") {
//     page.view.hideToolbar();
//   }
//   else {
//     page.view.showToolbar();
//   }
// });

// Init Messages
