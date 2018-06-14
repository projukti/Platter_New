routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/home/',
    url: './home.html',
    on: {
      pageInit: function (e, page) {
        app.topFiveRestaurants();
        app.topTwelveRestaurants();
        app.generalRestaurants();
      }
    }
  },
  {
    path: '/restaurent_list/',
    url: './pages/restaurent_list.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      let router = this;
      let unique = router.app;
      
      unique.preloader.show();
      setTimeout(function () {
        app.resturentListByType();
        unique.preloader.hide();
        resolve(
          {
            componentUrl: './pages/restaurent_list.html',
          }
        );
      }, 1000);
    },
  },
  {
    path: '/restaurent-details/:id/:name/',
    componentUrl: './pages/restaurent_details.html',
  },
  {
    path: '/menu-details/:id/:menu_name/:restaurent_name/:restaurent_id',
    componentUrl: './pages/menu_details.html',
  },
  {
    path: '/catalog/:finalamount/:coupon/',
    componentUrl: './pages/catalog.html',
  },
  {
    path: '/chat/',
    componentUrl: './pages/chat.html',
  },
  {
    path: '/product/:id/',
    // componentUrl: './pages/product.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      let router = this;
      let unique = router.app;
      unique.preloader.show();
      var reply
      setTimeout(function () {
        app.orderHistory();
        unique.preloader.hide();
        resolve(
          {
            componentUrl: './pages/product.html',
          },
          {
            context: {
              order: reply,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '/chat_details/:id/',
    componentUrl: './pages/chat_details.html',
  },
  {
    path: '/order_details/:id/',
    
    async: function (routeTo, routeFrom, resolve, reject) {
      let router = this;
      let unique = router.app;
      let id = routeTo.params.id;
      unique.preloader.show();
      setTimeout(function () {
        app.orderDetails(id);
        unique.preloader.hide();
        resolve(
          {
            componentUrl: './pages/order_details.html',
          }
        );
      }, 1000);
    },
    
  },
  {
    path: '/friends_profile/:id/',
    componentUrl: './pages/profile.html',
  },


  {
    path: '/favourites_user/',
    async: function (routeTo, routeFrom, resolve, reject) {
      let router = this;
      let unique = router.app;
      unique.preloader.show();
      setTimeout(function () {
        app.userWishlist();
        unique.preloader.hide();
        resolve(
          {
            componentUrl: './pages/favourites.html',
          }
        );
      }, 1000);
    },
    
  },


  {
    path: '/referrals/',
    componentUrl: './pages/referrals.html',
  },
  {
    path: '/friend/',
    componentUrl: './pages/friend.html',
  },
  {
    path: '/customized-meal/',
    componentUrl: './pages/customize_meal.html',
  },
  {
    path: '/cart/',
    componentUrl: './pages/cart.html',
  },
  {
    path: '/checkout-address/',
    componentUrl: './pages/checkout-address.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path:'/account-user/',
    componentUrl: './pages/account.html',
  },
  {
    path: '/edit-profile/',
    componentUrl: './pages/edit_profile.html',
  },
  {
    path:'/payment-success/:id/',
    componentUrl: './pages/payment-success.html',
  },
  {
    path: '/payment-error/',
    componentUrl: './pages/payment-error.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './index.html',
  },
];
