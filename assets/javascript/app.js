//app initializing
var app = {};
app.wins =0;
app.ties = 0; 
app.losses = 0; 
app.chosenLang = 'English';
app.playerNumber = 1;
app.playerName = '';   
app.playerOneExists = false;  
app.gameFull = false;  
app.multiplayer = false; 
app.notYetChosen = true;  
app.roundNumber = 1;  

//language settings
app.languages = {
  'Français': {
    game: 'Pierre-Feuille-Ciseaux',
    rock: 'Pierre',
    paper: 'Feuille',
    scissors: 'Ciseaux',
    start: 'début',
    warning: "S'il vous plaît entrez votre nom"
  },
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
    start: 'Comienzo',
    warning: 'por favor, escriba su nombre'
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
    start: 'Начало',
    warning: 'Пожалуйста, введите Ваше имя'
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
    console.log(`User entered ${$('#user-name').val()}`)
    e.preventDefault();
    //if game is already full  
    if (that.gameFull){
      alert('There are already two players logged in; please wait for an empty spot becomes available')
    } else {
    //otherwise, proceed to 
      if ($('#user-name').val()){
        var userName = $('#user-name').val();
        that.loggedIN(userName);  
      } else {
        console.log(that.languages[that.chosenLang].warning)
      }
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

//logic for logging in onto Firebase
app.loggedIN = function (name) {
  console.log('user is logged in');
  //render regular game screen
  this.render();
  this.playerName = name; 
  var players = DB.ref('/players');
  
  //if player one exists
   if (this.playerOneExists) {
    //you are player two
    players.child(2).set(
      {
        name: app.playerName,
        wins: 0,
        losses: 0
      }
    )
  //otherwise, you are player one 
  } else {
    players.child(1).set(
      {
        name: app.playerName,
        wins: 0,
        losses: 0
      }
    )
  }
  //logic for logging out
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
  $('#user-name').val('') ; 
  $('#languages').empty();
  var langDiv = $('<div>'); 
  langDiv.addClass('center-block') ;
  langDiv.attr('id', 'langDiv');
  langDiv.append(`<button class='btn-primary choice' id='rock'>${that.languages[that.chosenLang].rock}</button>`)
  langDiv.append(`<button class='btn-primary choice' id='paper'>${that.languages[that.chosenLang].paper}</button>`)
  langDiv.append(`<button class='btn-primary choice' id='scissors'>${that.languages[that.chosenLang].scissors}</button>`)
  $('#languages').append(langDiv);
  $('#username').toggle();  
  $('#chat').toggle();
}

//Starting main game
app.gameStarts = function (arr) {
  var that = this; 
  console.log('multiplayer starting')
  this.multiplayerRender(arr);
  DB.ref('/rounds').set(app.roundNumber);
}

app.multiplayerRender = function(array) {
  var that = this;  
  $('#instructions').html(that.languages[that.chosenLang].game);
  $('#funStuff').show(); 
  $('#player1name').text(array[1].name);
  $('#player2name').text(array[2].name);
}

//Main game logic
app.outcome = function(a, b) {
  console.log('trying to determine outcome!')
  var that = this; 
  if (a === b) {
    that.ties ++;
    $('#ties').text(that.ties);
  } else if (a==='rock' && b==='scissors'){
    if (this.playerNumber === 1){
      that.wins++;
      $('#wins').text(that.wins);
    } else {
      that.losses++;
      $('#losses').text(that.losses);
    }
  } else if (a==='scissors' && b==='paper'){
    if (this.playerNumber === 1){
      that.wins++;
      $('#wins').text(that.wins);
    } else {
      that.losses++;
      $('#losses').text(that.losses);
    }
  } else if (a==='paper' && b==='rock'){
    if (this.playerNumber === 1){
      that.wins++;
      $('#wins').text(that.wins);
    } else {
      that.losses++;
      $('#losses').text(that.losses);
    }
  } else {
    if (this.playerNumber === 2){
      app.wins++;
      $('#wins').text(app.wins);
    } else {
      app.losses++;
      $('#losses').text(app.losses);
    }
  }
  //go to next round
  console.log('trying to go to next round')
  this.roundNumber++; 
  this.notYetChosen = true;  
  DB.ref('/players/1').child('choice').remove();
  DB.ref('/players/2').child('choice').remove();
  DB.ref('/rounds').set(that.roundNumber)
}

//event listener for child_added in order to determine if player one exists
DB.ref('/players').on('child_added', (snap)=>{
  // console.log('IMPORTANT', snap.val())
  if (snap.val()){
    if (app.playerOneExists) {
      app.playerNumber = 2;  
    }
  }
  console.log('really?')
  app.playerOneExists = true;
  console.log(snap.val())
  
})

//event listener for when there are exactly two players
DB.ref('/players').on('value', (snap) => {

  if (snap.val()) {
    console.log(snap.val())
    if (snap.val()[2]){
      app.playerOneExists = false;
      console.log('please trigger!')
    }
    if (snap.val()[1] && !app.multiplayer){
      if (snap.val()[1].name == app.playerName) {
        $('#instructions').html('Waiting for the other player');
      } else {
        $('#instructions').html('The other player is waiting for you!');
      }
    }
    //if we have two players (player zero is undefined)
    if (snap.val().length === 3 && app.multiplayer === false) {
      console.log('game starts!')
      app.gameStarts(snap.val()); 
      app.multiplayer = true;  
      app.gameFull = true; 
    } 
    if (snap.val().length === 3) {
      if (snap.val()[1].choice && snap.val()[2].choice){
        app.outcome(snap.val()[1].choice, snap.val()[2].choice);
      }
    }
  } else {
    console.log('clearing all history');
    DB.ref().remove();
  }
})

//logic to handle disconnect 
DB.ref('/players').on('child_removed', (snap) => {
      $('#chat-window').append('<p class="warning">The other player has disconnected</p>')
      app.multiplayer = false;;  
      app.gameFull = false; 
      app.roundNumber = 1;
})

//logic for chat window: send text 
$('#submit-chat').on('click', (e) => {
  e.preventDefault();
  var textToSend = $('#chat-type').val().trim();
  //if user submits a non-empty string
  if (textToSend.length > 0) {
    //push to firebase
    DB.ref('/chat').push({
      text: `${app.playerName}: ${textToSend}`,
      sender: app.playerName,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    })
  $('#chat-type').val('')  
  }
})

//logic for displaying chats
DB.ref('/chat').orderByChild('dateAdded').on('value', (snap)=> {
  // console.log(snap.val())
  $('#chat-window').empty();
  _.each(snap.val(), (v) => {
    var myself = false; 
    if (v.sender === app.playerName){
      myself = true;  
      $('#chat-window').append(`<p class='myself'>${v.text}</p>`)
    } else {
      $('#chat-window').append(`<p class='others'>${v.text}</p>`)
    }
  })
} )

//event listener for rock-paper-scissors choices
$(document.body).on('click', '.choice', function() {
  var choice = $(this).attr('id');
  if (app.notYetChosen){
    app.notYetChosen = false;  
    DB.ref(`/players/${app.playerNumber}`).child('choice').set(choice);
    console.log('extra trigger?')
  }
})

app.initialize()

