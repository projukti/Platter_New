// Dom7
var $$ = Dom7;

// Framework7 App main instance
var newApp  = new Framework7({
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
      let searchValue=''
      $.ajax({
        type: "post",
        url: serverUrl + "search_dish/",
        //data: { dishname: searchQuery,resttype:'all', cuisine: 'all', lat: localStorage.getItem('lat'), lang: localStorage.getItem('lang'),user:user, pincode:  localStorage.getItem('curr_pin')},
        data: { dishname: query, resttype: 'all', cuisine: 'all', lat: '22.4724863', lang: '88.3785082', user: user, pincode: '700047' },
        dataType: "JSON"
      }).done(function (rply) {
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

          $('#normalListing').hide();
          $('#lblFilterRestaurents').html(searchValue)
          $('#lblFilterRestaurentCount').html("Match Restaurents");
          $('#filterResult').show();

          // if (searchQuery.length === 0) {
          //   $('#lblRestaurentSearchList').html('')
          // }
          // else {
          //   $('#lblRestaurentSearchList').html(searchValue)
          // }

        }
      });
      
      if(query==""){
        $('#filterResult').hide();
        $('#lblFilterRestaurents').html('')
        $('#lblFilterRestaurentCount').html("");
        $('#normalListing').show();
      }
    },
    enable: function () {
      console.log('Searchbar enabled')
    },
    disable: function(){
      $('#filterResult').hide();
      $('#lblFilterRestaurents').html('')
      $('#lblFilterRestaurentCount').html("");
      $('#normalListing').show();
    }
  }
});
var messages = app.messages.create({
  el: '.messages',

  // First message rule
  firstMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no previous message
      - or previous message type (send/received) is different
      - or previous message sender name is different
    */
    if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  lastMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no next message
      - or next message type (send/received) is different
      - or next message sender name is different
    */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  tailMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if (bascially same as lastMessageRule):
    - there is no next message
    - or next message type (send/received) is different
    - or next message sender name is different
  */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  }
});

// Init Messagebar
var messagebar = app.messagebar.create({
  el: '.messagebar'
});
// Response flag
var responseInProgress = false;

// Send Message
$$('.send-link').on('click', function () {
  var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
  // return if empty message
  if (!text.length) return;

  // Clear area
  messagebar.clear();

  // Return focus to area
  messagebar.focus();

  // Add message to messages
  messages.addMessage({
    text: text,
  });

  if (responseInProgress) return;
  // Receive dummy message
  receiveMessage();
});

// Dummy response
var answers = [
  'Yes!',
  'No',
  'Hm...',
  'I am not sure',
  'And what about you?',
  'May be ;)',
  'Lorem ipsum dolor sit amet, consectetur',
  'What?',
  'Are you sure?',
  'Of course',
  'Need to think about it',
  'Amazing!!!'
]
var people = [
  {
    name: 'Kate Johnson',
    avatar: 'http://lorempixel.com/100/100/people/9'
  },
  {
    name: 'Blue Ninja',
    avatar: 'http://lorempixel.com/100/100/people/7'
  }
];
function receiveMessage() {
  responseInProgress = true;
  setTimeout(function () {
    // Get random answer and random person
    var answer = answers[Math.floor(Math.random() * answers.length)];
    var person = people[Math.floor(Math.random() * people.length)];

    // Show typing indicator
    messages.showTyping({
      header: person.name + ' is typing',
      avatar: person.avatar
    });

    setTimeout(function () {
      // Add received dummy message
      messages.addMessage({
        text: answer,
        type: 'received',
        name: person.name,
        avatar: person.avatar
      });
      // Hide typing indicator
      messages.hideTyping();
      responseInProgress = false;
    }, 4000);
  }, 1000);
}


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





