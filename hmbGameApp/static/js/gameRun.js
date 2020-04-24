function getName(){
    username = document.getElementById("name-text").value;

    // remove text field and button
    var name_box = document.getElementById("enter-name-box");
    name_box.parentElement.removeChild(name_box);

    startGame()
}

function startGame(){

  p1 = new Player(name=username, hand=new Hand());
  p2 = new Player(name="Chris", hand=new Hand(), is_bot=true);
  players = [p1, p2];

  game = new Game(p1,p2);

  playGame();
}

function playGame(){

  deck = new Deck();
  deck.shuffle();
  makeDeck(deck.allcards); //html

  // Who gets first pick
  p1.is_first_pick = randomChoice([true, false]);
  p2.is_first_pick = !p1.is_first_pick;

  // sort players array to first pick first
  players.sort(function(a, b){
      return b.is_first_pick-a.is_first_pick
  })

  // set which player it is.
  p = players[0];
  // toggleOrder();

  // start dealing phase
  dealingPhase();
}

function stackCards(ID) {
  var idcards = document.querySelectorAll('#'+ID+' .card-img'),
      offset = 25;

  // do the stacking stuff!
  for (var i = 0; i < idcards.length; i++) {
    idcards[i].style.left = (45-(1.45*(idcards.length-1)))+"%";
    if (i != 0){
      idcards[i].style.transform = "translateX(" + offset * i + "%)";
    }
  }
}

function makeDeck(cards) {
  var parentDeck = document.getElementById("deck");
  for (var i=0; i<cards.length; i++){
    var div = document.createElement("div");
    div.classList.add('card-img');
    div.id = 'card-back';
    parentDeck.appendChild(div);
  }
  stackDeck();
}

function stackDeck() {
  idcards = document.querySelectorAll('#deck .card-img');

  // do the stacking stuff!
  for (var i = 0; i < idcards.length ; i++) {
    idcards[idcards.length-i-1].style.transform = "translateX(-" + 0.25*i + "px)";
  }
}

function removeCardDeck() {
  var parentDeck = document.getElementById("deck");
  rem_card = parentDeck.children[parentDeck.children.length-1]
  parentDeck.removeChild(rem_card);
  stackDeck();
}

function newVisCard(card){
  var parentEl = document.getElementById("viscard");

  // if there is already a vis card, remove it.
  rem_card = parentEl.lastElementChild;
  if (rem_card) parentEl.removeChild(rem_card);

  // show new vis card
  var div = document.createElement("div");
  div.classList.add('card-img');
  div.id = 'card-'+card;
  parentEl.appendChild(div);
}

function remVisCard(card){
  var parentEl = document.getElementById("viscard");

  // if there is already a vis card, remove it.
  rem_card = parentEl.lastElementChild;
  if (rem_card) parentEl.removeChild(rem_card);
}

function displayPlayerHand(player){
  player_hand = player.hand.cards;

  if (player.is_bot) cards_ID = "cards-top";
  else cards_ID = "cards-bot";

  var parentEl = document.getElementById(cards_ID);

  child = parentEl.lastElementChild;
  while (child) {
    parentEl.removeChild(child);
    child = parentEl.lastElementChild;
  }

  for (var i=0; i<player_hand.length; i++){
    var div = document.createElement("div");
    div.classList.add("card-img");
    if (cards_ID=="cards-top") div.id = 'card-back';
    else div.id = 'card-'+player_hand[i];
    parentEl.appendChild(div);
  }
  stackCards(cards_ID);
}


// ==============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =============================================================================


function toggleOrder(){
  if (p == players[0]) p = players[1];
  else p = players[0];
}

function clickRemVisCard(val=1){
  var disccardClick = document.querySelector('#viscard .card-img');
  disccardClick.addEventListener('click', function() {
    if (val == 2){
      // 2) add card to player hand
      p.pickUpCard(disccard);
      // 3) display hands and remove viscard (picked up card)
      displayPlayerHand(p);
      remVisCard();
    }
    else{
      remVisCard();
    }
    // loop back
    if (deck.allcards.length) {
      toggleOrder();
      dealingPhase();
    }
    else{
      console.log("Begin Bidding Phase!");
      biddingPhase()
    }
  })
}

function pickVisCardClickFunction(){
  // remove created event listener
  var topdeckcards = document.querySelectorAll('#deck .card-img');
  topdeckcard = topdeckcards[topdeckcards.length-1];
  topdeckcard.removeEventListener('click', pickDeckCardClickFunction);
  var viscardClick = document.querySelector('#viscard .card-img');
  viscardClick.removeEventListener("click", pickVisCardClickFunction);

  // 1) move card to hand
  p.pickUpCard(viscard);
  // 2) move top deck card
  disccard = deck.getCard();
  newVisCard(disccard);
  // 2) remove top deck card
  removeCardDeck(); //html
  // 3) display hands and remove viscard (discard card)
  displayPlayerHand(p);
  // CLICK VERSION
  clickRemVisCard();
  // // remove existing event listeners
  // var topdeckcards = document.querySelectorAll('#deck .card-img');
  // topdeckcard = topdeckcards[topdeckcards.length-1];
  // topdeckcard.removeEventListener("click", pickDeckCardClickFunction);
  // loop back
  // if (deck.allcards) something();
}

function pickDeckCardClickFunction(){
  // remove created event listener
  var topdeckcards = document.querySelectorAll('#deck .card-img');
  topdeckcard = topdeckcards[topdeckcards.length-1];
  topdeckcard.removeEventListener('click', pickDeckCardClickFunction);
  var viscardClick = document.querySelector('#viscard .card-img');
  viscardClick.removeEventListener("click", pickVisCardClickFunction);

  // 1) move top deck card to viscard pile
  disccard = deck.getCard();
  newVisCard(disccard);
  // 2) remove top deck card
  removeCardDeck(); //html
  // CLICK VERSION
  clickRemVisCard(2);
}

function dealingPhase(){

  console.log("It is "+p.name+"'s turn");
  var topdeckcards = document.querySelectorAll('#deck .card-img');
  topdeckcard = topdeckcards[topdeckcards.length-1];

  if (!p.is_bot){
    topdeckcard.addEventListener('click', topDeckClickFunction);
  }
  else{
    // is bot - pick up and discard random card
    p.pickUpCard(deck.getCard());
    removeCardDeck(); //html
    ignore_card = deck.getCard()
    removeCardDeck(); //html

    displayPlayerHand(p);

    if (deck.allcards.length) { // deck is not finished
      toggleOrder();
      dealingPhase();
    }
    else{
      console.log("Begin Bidding Phase!");
      biddingPhase()
    }
  }
}

function topDeckClickFunction(){
  // remove created click event listener
  var topdeckcards = document.querySelectorAll('#deck .card-img');
  topdeckcard = topdeckcards[topdeckcards.length-1];
  topdeckcard.removeEventListener('click', topDeckClickFunction);

  // 1) move card to viscard pile
  viscard = deck.getCard();
  newVisCard(viscard); //html
  // 2) remove top deck card
  removeCardDeck(); //html
  // 3) add click event for viscard
  var viscardClick = document.querySelector('#viscard .card-img');
  viscardClick.addEventListener('click', pickVisCardClickFunction);
  // 4) add click event for new top deck card (discard option)
  var topdeckcards = document.querySelectorAll('#deck .card-img');
  topdeckcard = topdeckcards[topdeckcards.length-1];
  topdeckcard.addEventListener('click', pickDeckCardClickFunction);
}

function getBid() {
  var player_bid = document.getElementById("bid-list").value;

  // sort players array to player first, bot second
  players.sort(function(a, b){
      return a.is_bot-b.is_bot
  })

  players[0].bid = player_bid;

  if (!players[1].bid){
    players[1].bid = 12 - players[0].bid;
  }

  updateScoreboard();

  // remove bidding box
  var childEl = document.getElementById("enter-bid-box");
  childEl.parentElement.removeChild(childEl)

  // start playing phase
  playingPhase();
}


function makeScoreboard(){

  var sb_box = document.getElementById("scoreboard-box");
  sb_box.style.color = "black";
  sb_box.style.border = "5px grey solid";
  sb_box.style.backgroundColor = "white";

  var sb_title = document.getElementById("sb-title");
  sb_title.textContent = "SCORE"

  var p_p1name = document.getElementById("p1-name");
  var p_p2name = document.getElementById("p2-name");

  p_p1name.textContent = p1.name;
  p_p2name.textContent = p2.name;

}


function updateScoreboard(){

  var p_p1score = document.getElementById("p1-score");
  var p_p2score = document.getElementById("p2-score");
  var p_p1bid = document.getElementById("p1-bid");
  var p_p2bid = document.getElementById("p2-bid");

  p_p1score.textContent = p1.round_score;
  p_p2score.textContent = p2.round_score;
  if (p1.bid) p_p1bid.textContent = "("+p1.bid+")";
  else p_p1bid.textContent = "()";
  if (p2.bid) p_p2bid.textContent = "("+p2.bid+")";
  else p_p2bid.textContent = "()";
}


function biddingPhase(){

  // sort players array to first pick first
  players.sort(function(a, b){
      return b.is_first_pick-a.is_first_pick
  })

  // make scoreboard html
  makeScoreboard()

  // start making bidding graphic
  var parentEl = document.getElementById("deck");

  var div = document.createElement("div");
  div.classList.add("enter-bid-box");
  div.id = "enter-bid-box";

  // var lab = document.createElement("label");
  // lab.htmlFor = "bid-list";
  // lab.textContent = "Select Bid: ";
  var p_bid = document.createElement("p");
  p_bid.textContent = "Select Bid:";

  var ddlist = document.createElement("SELECT");
  ddlist.id = "bid-list";

  // player 1 bid
  if (players[0].is_bot){
    // random bot bid
    players[0].bid = 6;

    for (var i=1; i<=13; i++){
      if (i == 13-players[0].bid) continue;
      var option = document.createElement("option");
      option.text = i;
      option.value = i;
      ddlist.add(option);
    }
  }
  else{ // first player is player
    for (var i=1; i<=13; i++){
      var option = document.createElement("option");
      option.text = i;
      option.value = i;
      ddlist.add(option);
    }
  }

  updateScoreboard();

  var but = document.createElement("button");
  but.id = "bid-button"
  but.textContent = "Submit"

  div.appendChild(p_bid);
  div.appendChild(ddlist);
  div.appendChild(but);
  parentEl.appendChild(div);

  document.getElementById("bid-button").addEventListener("click", getBid);

}

function playingPhase(){
  console.log("Playing Phase!")

  // sort players to highest bid goes first
  players.sort(function(a, b){
      return b.bid-a.bid;
  })

  trick = new Trick();
  round = new Round(trick, players[0], players[1]);


  // round.trick.lead_player = players[0];
  // round.trick.follow_player = players[1];

  gamePlay()

}

function gamePlay(){

  // remove any played cards from cardtable
  removePlayedCards();

  if (round.trick.lead_player.is_bot){
    // lead player is a bot
    round.trick.lead_card = randomChoice(round.trick.lead_player.hand.cards);
    console.log(round.trick.lead_card);
    round.trick.setSuite(); // set suite based on lead card

    round.trick.lead_player.playCard(round.trick.lead_card);
    displayPlayerHand(round.trick.lead_player);
    displayPlayedCards();

    // follow player is player
    showPlayableCardsAddClickEvent();
  }
  else{
    // lead player is human
    showPlayableCardsAddClickEvent();
  }
}


// hover effect and gray out
function showPlayableCardsAddClickEvent(){

  // make player cards move on hover (only playable cards)
  document.querySelectorAll('#cards-bot .card-img').forEach(item => {

    if (p1.hand.hasSuite(round.trick.suite)){
      if (item.id[6] == round.trick.suite){
        // hover effect
        var tform = item.style.transform;
        item.addEventListener('mouseover', function() {
          item.style.transform = item.style.transform + " translateY(-10px)";
        })
        item.addEventListener('mouseout', function() {
          item.style.transform = tform;
        })
        item.addEventListener('click', playerPlayCard);
      }
      else{
        // grey wash
        item.classList.add("brightness");
      }
    }

    else{ // doesn't have suite. All cards are playable.
      // hover effect
      var tform = item.style.transform;
      item.addEventListener('mouseover', function() {
        item.style.transform = item.style.transform + " translateY(-10px)";
      })
      item.addEventListener('mouseout', function() {
        item.style.transform = tform;
      })
      item.addEventListener('click', playerPlayCard);
    }
  });
}

function playerPlayCard(evt){
  console.log("Card clicked: "+evt.currentTarget.id.slice(5));

  play_card = evt.currentTarget.id.slice(5);

  if (round.trick.lead_player == p1){

    round.trick.lead_card = play_card;
    round.trick.setSuite();

    // bot must pick card
    // new hand filtered to trick suite
    var filtered_hand = arrayFilter(p2.hand.cards, round.trick.suite);

    if (filtered_hand.length > 0) round.trick.follow_card = randomChoice(filtered_hand);
    else round.trick.follow_card = randomChoice(p2.hand.cards);

    p2.playCard(round.trick.follow_card)

  }
  else {
    round.trick.follow_card = play_card;
  }

  p1.playCard(play_card); // remove card from hand

  displayPlayedCards(); // show cards on table
  displayPlayerHand(p1); // re-display player hand without card
  displayPlayerHand(p2); // re-display player hand without card
  endTrick();

  sleep(2000)
    .then(() => {
  if (round.trick.num == round.total_tricks+1) {
    removePlayedCards();
    $('#play-cards').prependTo('#cards-mid');
    finishRound();
  }
  else {
    gamePlay();
  }
  });
}

function displayPlayedCards(){

  // remove played cards from table
  removePlayedCards();

  var parentPC = document.getElementById('play-cards');

  // now add played cards to div
  // lead card
  div_lc = document.createElement("div");
  div_lc.classList.add("card_img");
  div_lc.id = "card-"+round.trick.lead_card;
  parentPC.appendChild(div_lc);

  // follow card
  if (round.trick.follow_card!=''){ // a follow card has been played
    div_fc = document.createElement("div");
    div_fc.classList.add("card_img");
    div_fc.id = "card-"+round.trick.follow_card;
    parentPC.appendChild(div_fc);
  }

  stackPlayedCards();
}


function removePlayedCards(){
  var parentPC = document.getElementById('play-cards');
  var parentCM = parentPC.parentElement;

  // remove all played cards
  parentCM.removeChild(parentPC);

  // re-add play-cards div
  div_PC = document.createElement("div");
  div_PC.classList.add("play-cards");
  div_PC.id = "play-cards";
  parentCM.appendChild(div_PC);
}

function stackPlayedCards(){
  var played_cards = document.querySelectorAll('#play-cards .card_img'),
      offsetX = 25,
      offsetY = 15;

  // do the stacking stuff!
  for (var i = 1; i < played_cards.length; i++) {
    played_cards[i].style.transform = "translate(" + offsetX * i + "%," + offsetY * i + "%)"
    // played_cards[i].style.transform = "translateY(" + offset * i + "%)";
  }
}

function endTrick(){
  console.log("ENDED TRICK! :D");
  round.tallyScores();
  updateScoreboard();
  highlightWinnerCardScoreboard(); // highlight winning card, player and score
  round.nextTrick();
}

function highlightWinnerCardScoreboard(){
  // commpare cards for points
  if (round.trick.lead_card[1] == round.trick.follow_card[1]){ // same suite
    if (RANKS_MAP[round.trick.lead_card[0]]>RANKS_MAP[round.trick.follow_card[0]]){
      // change style of card
      var div_card = document.querySelector('#card-'+round.trick.lead_card)

      // change style of scoreboard entry
      if (round.trick.lead_player == p1) {
        var div_win_name = document.getElementById("p1-name");
        var div_win_score = document.getElementById("p1-score");
        highlight_colour = "blue";
      }
      else{
        var div_win_name = document.getElementById("p2-name");
        var div_win_score = document.getElementById("p2-score");
        highlight_colour = "red";
      }
    }
    else{ // follow player wins

      // change style of scoreboard entry
      var div_card = document.querySelector('#card-'+round.trick.follow_card)

      // change style of scoreboard entry
      if (round.trick.follow_player == p1) {
        var div_win_name = document.getElementById("p1-name");
        var div_win_score = document.getElementById("p1-score");
        highlight_colour = "blue";
      }
      else{
        var div_win_name = document.getElementById("p2-name");
        var div_win_score = document.getElementById("p2-score");
        highlight_colour = "red";
      }
    }
  }
  else{ // not same suite, lead player wins
    // change style of card
    var div_card = document.querySelector('#card-'+round.trick.lead_card)

    // change style of scoreboard entry
    if (round.trick.lead_player == p1) {
      var div_win_name = document.getElementById("p1-name");
      var div_win_score = document.getElementById("p1-score");
      highlight_colour = "blue";
    }
    else{
      var div_win_name = document.getElementById("p2-name");
      var div_win_score = document.getElementById("p2-score");
      highlight_colour = "red";
    }
  }

  div_card.style.border = "5px solid "+highlight_colour;
  div_card.style.borderRadius = "10px";

  old_name_style = div_win_name.style;
  old_score_style = div_win_score.style;

  div_win_name.style.color = highlight_colour;
  div_win_name.style.fontWeight = "900";
  div_win_score.style.color = highlight_colour;
  div_win_score.style.fontWeight = "900";

  sleep(2000)
  .then(() => {
    div_card.style.border = "";
    div_win_name.style = old_name_style
    div_win_score.style = old_score_style
  });
}

function finishRound(){
  console.log("FINISHED ROUND!")

  // game.calcScores()
  game.nextRound();

  // sort players to highest score goes first
  players.sort(function(a, b){
      return b.round_score-a.round_score;
  })

  // trick = new Trick();
  // round = new Round(trick, players[0], players[1]);

  if (game.round_count!=2) playGame();
  else console.log("Game Over!");
}

// ============================================================================
// Main
// ============================================================================

game = new Game();

var p_cbtext = document.getElementById("cb-text")
var p_username = document.getElementById("username")

if (p_username){ // player is logged in
    username = p_username.textContent;
    p_cbtext.textContent = "Welcome "+username+" to Honeymoon Bridge!";
    startGame();
}
else{ // player not logged in. Need to create text input field
  p_cbtext.textContent = "Welcome to Honeymoon Bridge! Please insert your name below.";
  document.getElementById("name-button").addEventListener("click", getName);
}
