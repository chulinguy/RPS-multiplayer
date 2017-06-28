//app initializing
var app = {};
app.chosenLang = 'English';
app.playerNumber = 1;
app.playerName = '';   
app.playerOneExists = false;  

//language settings
app.languages = {
  'Français': {
    game: 'Pierre-Feuille-Ciseaux',
    rock: 'Pierre',
    paper: 'Feuille',
    scissors: 'Ciseaux',
    start: 'début'
  },
  // 日本語: {
  //   game: 'じゃん拳ぽん',
  //   rock:
  //   paper:
  //   scissors:
  //   start: 'はじめ'
  // },
   'English': {
    game: 'Rock-Paper-Scissors',
    rock:'Rock',
    paper: 'Paper',
    scissors: 'Scissors',
    start: 'Start',
    warning: 'Please enter a name'
  },
   'Español': {
    game: 'Piedra-Papel-Tijera',
    rock: 'Piedra',
    paper: 'Papel',
    scissors: 'Tiejera',
    start: 'Comienzo'
  },
   '中文': {
    game: '剪刀-石頭-布',
    rock:'石頭',
    paper:'布',
    scissors: '剪刀',
    start: '開始',
    warning: '請輸入你的名字'
  },
  'Russian': {
    game: 'Раз-Два-Три',
    rock:'камень',
    paper:'бумага',
    scissors: 'ножницы',
    start: 'Начало'
  }
}

//firebase initializing
var config = {
  apiKey: "AIzaSyDfVipUEwS8gHo96nSMaovhvxxUOC_LGqQ",
  authDomain: "rps-multiplayer-49444.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-49444.firebaseio.com",
  projectId: "rps-multiplayer-49444",
  storageBucket: "",
  messagingSenderId: "676675049392"
};
firebase.initializeApp(config);
var DB = firebase.database();

//initializing logic
app.initialize = function () {
  var that = this;  
  this.initRender();
  //event listerner for language choices
  $(document.body).on('click', '.language', function() {
    var chosenLang = $(this).attr('id');
    that.chosenLang = chosenLang;
    console.log(`User chose ${chosenLang}`)
    $('#submit-name').text(that.languages[chosenLang].start);
    $('h2').text(that.languages[chosenLang].game)
  })
  //event listern for enter name
  $('#submit-name').on('click', function(e){
    console.log($('#user-name').val())
    e.preventDefault();
    if ($('#user-name').val()){
      var userName = $('#user-name').val();
      $('#user-name').val('') ; 
      $('#languages').empty();
      that.loggedIN(userName);  
    } else {
      console.log(that.languages[that.chosenLang].warning)
    }
  })
}

//Rendering of language buttons
app.initRender = function () {
  var that = this; 
  _.each(that.languages, (v, i) => {
    var langBTN = $('<button>').attr('id', i);
    langBTN.addClass('language');
    langBTN.text(i);
    $('#languages').append(langBTN); 
  })
}

//
app.loggedIN = function (name) {
  console.log('game is starting');
  this.render();
  this.playerName = name; 
  var players = DB.ref('/players');
  if (this.playerOneExists) {
    // this.playerNumber = 2; 
    players.child(2).set(
      {
        name: app.playerName,
        wins: 0,
        losses: 0
      }
    )
  } else {
    // this.playerNumber = 1; 
    players.child(1).set(
      {
        name: app.playerName,
        wins: 0,
        losses: 0
      }
    )
  }
  DB.ref('.info/connected').on('value', (snap) => {
    console.log('app.playerNumber: ', app.playerNumber)
    if (snap.val()) {
      DB.ref('players').child(app.playerNumber).onDisconnect().remove();
    }
  })
}

//regular rendering logic
app.render = function () {
  var that = this; 
  console.log('rendering game');
  $('#languages').append(`<button class='btn-primary choice' id='rock'>${that.languages[that.chosenLang].rock}</button>`)
  $('#languages').append(`<button class='btn-primary choice' id='paper'>${that.languages[that.chosenLang].paper}</button>`)
  $('#languages').append(`<button class='btn-primary choice' id='scissors'>${that.languages[that.chosenLang].scissors}</button>`)

  $('#chat').toggle();
}


//
DB.ref('/players').on('child_added', (snap)=>{
  
  console.log(snap.val())
  if (app.playerOneExists) {
    app.playerNumber = 2;  
  }
  
    app.playerOneExists = true;
    // app.playerNumber = 2;  
  

  // if (snap.child('1').exists()){
  //   app.playerOneExists = true;
  //   app.playerNumber = 2;  
  //   console.log('starting up/ I see there is a player one')
  // } else if (!snap.child('1').exists() && !snap.child('2').exists()){
  //   app.playerOneExists = false;
  //   app.playerNumber = 1;  
  //   console.log('starting up/I see no player one')
  // } else {
  //   console.log('player 1 quit but player 2 is still there')
  // }
})

 

app.initialize()

