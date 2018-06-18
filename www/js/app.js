// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto',
  pushStateSeparator: '#/',
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
      // Demo products for Catalog section
      products: [
        {
          id: '1',
          title: 'Apple iPhone 8',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
        },
        {
          id: '2',
          title: 'Apple iPhone 8 Plus',
          description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
        },
        {
          id: '3',
          title: 'Apple iPhone X',
          description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
        },
      ]
    };
    // { domCache: true, pushState: true };


  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },

  view: {

    pushState: true,
  },
  },
  // App routes
  routes: routes,
});

// Init/Create views
var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var cartView = app.views.create('#view-cart', {
  url: '/cart/'
});
var accountView = app.views.create('#view-account', {
  url: '/account-user/'
});
var chatView = app.views.create('#view-chat',{
  url: '/chat/'
});
var searchView = app.views.create('#view-search', {
  url: '/request-and-load/user/123456/'
});
var searchbar = app.searchbar.create({
  el: '.searchbar',
  searchContainer: '.list',
  searchIn: '.item-title',
  on: {
    search(sb, query, previousQuery) {
      console.log(query, previousQuery);
    },
    enable: function () {
      console.log('Searchbar enabled')
    }
  }
});


// Login Screen Demo
$$('.login-screen .login-button').on('click', function () {
  console.log('Here');
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





