// Script with classes for Honeymoon Bridge game.

var SUITE = 'C D S H'.split(' ')
var RANKS = '2 3 4 5 6 7 8 9 T J Q K A'.split(' ')
var RANKS_MAP = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'T':10,'J':11,'Q':12,'K':13,'A':14}
var SUITE_MAP = {'C':1,'D':2,'S':3,'H':4};

// ----------------------------------------------------------------------------
// FUNCTOINS
// ----------------------------------------------------------------------------

// Shuffle cards
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Remove element from array by value
function arrayRemove(array, val){
    oldArr = [...array];
    for (var i = 0; i < array.length; i++){
      if (array[i] === val){
        array.splice(i, 1);
        break;
      }
    }
    if (oldArr.length == array.length){
      throw "card not in hand.";
    }
    return array;
}

// Random choice from arrayRemove
function randomChoice(array){
  return array[Math.floor(Math.random() * array.length)]
}

// filter to cards of same suite
function arrayFilter(cards, suite) {
  var newArr = new Array();
  for (var i=0; i<cards.length; i++){
    if (cards[i][1] === suite){
      newArr.push(cards[i])
    }
  }
  return newArr;
}

// order cards in player's hand
function orderBySuit(a,b){
  if (SUITE_MAP[a[1]] < SUITE_MAP[b[1]]) return -1;
  if (SUITE_MAP[a[1]] > SUITE_MAP[b[1]]) return 1;
  if (RANKS_MAP[a[0]] < RANKS_MAP[b[0]]) return -1;
  if (RANKS_MAP[a[0]] > RANKS_MAP[b[0]]) return 1;
}

// ----------------------------------------------------------------------------
// CLASSES
// ----------------------------------------------------------------------------

class Deck {
    constructor(){
        console.log("Creating New Ordered Deck");
        this.allcards = this.newDeck()
    }
    shuffle(){
        console.log("Shuffling Deck");
        shuffleArray(this.allcards);
    }
    newDeck(){
        var deck = new Array();
    	  for(var i = 0; i < SUITE.length; i++){
    		    for(var x = 0; x < RANKS.length; x++){
    			       var card = RANKS[x] + SUITE[i];
                 deck.push(card);
             }
        }
        return deck;
    }
    getCard(){
        return this.allcards.pop();
    }
}

class Hand{

    constructor(){
        this.cards = new Array();
        this.suites = new Array()
    }
    addCard(card){
        this.cards.push(card);
        this.suites.push(card[1]);
        // re-sort cards
        this.cards.sort(orderBySuit);
    }

    removeCard(card){
        this.cards = arrayRemove(this.cards, card);
        this.suites = arrayRemove(this.suites, card[1]);
    }
    hasSuite(suite){
        return this.suites.includes(suite);
    }
}

class Player{

    constructor(name, hand, is_bot=false){
        this.name = name;
        this.hand = hand;
        this.seen_cards = new Array();
        this.bid = null;
        this.is_bot = is_bot;
        this.is_first_pick = false;
        this.round_score = 0;
        this.game_score = 0;

        if (this.is_bot == true){this.name = 'Bot' + this.name;}
    }

    pickUpCard(card){
        // print("{} picked card {}".format(self.name, card))
        this.hand.addCard(card);
    }
    discardCard(card){
        // print("{} discarded card {}".format(self.name, card))
        this.seen_cards.push(card);
    }
    playCard(card){
        // # print("{} played card {}".format(self.name, card))
        this.hand.removeCard(card);
    }
    hasCards(){
        return len(this.hand.cards) != 0;
    }
}


class Trick{
    constructor(){
        this.suite = '';
        this.num = 1;
        this.lead_card = '';
        this.follow_card = '';
        this.lead_player = '';
        this.follow_player = '';
    }
    setSuite(){
        this.suite = this.lead_card[1];
    }

    toggleOrder(){
        var temp = this.follow_player;
        this.follow_player = this.lead_player;
        this.lead_player = temp;
    }

}

class Round{

  constructor(trick, lead_player, follow_player){
    this.trick = trick;
    this.total_tricks = 13;
    this.player1 = lead_player;
    this.player2 = follow_player;
    this.trick.lead_player = lead_player;
    this.trick.follow_player = follow_player;
    this.is_toggleOrder = false;
  }

  nextTrick(){
    // increment trick number and reset
    this.trick.num += 1;
    this.trick.suite = '';
    this.trick.lead_card = '';
    this.trick.follow_card = '';
    if (this.is_toggleOrder) this.trick.toggleOrder();
  }

  tallyScores(){
    // commpare cards for points
    if (this.trick.lead_card[1] == this.trick.follow_card[1]){ // same suite
      if (RANKS_MAP[this.trick.lead_card[0]]>RANKS_MAP[this.trick.follow_card[0]]){
          console.log(this.trick.lead_player.name + " wins with " + this.trick.lead_card);
          this.trick.lead_player.round_score += 1;
          this.is_toggleOrder = false;
      }
      else{ // follow player wins
          console.log(this.trick.follow_player.name + " wins with " + this.trick.follow_card);
          this.trick.follow_player.round_score += 1;
          this.is_toggleOrder = true;
      }
    }
    else{ // note same suite, lead player wins
      console.log(this.trick.lead_player.name + " wins with " + this.trick.lead_card);
      this.trick.lead_player.round_score += 1;
      this.is_toggleOrder = false;
    }
  }

  logScores(){
    console.log(this.player1.name + ": " + this.player1.round_score + " (" + this.player1.bid + ")");
    console.log(this.player2.name + ": " + this.player2.round_score + " (" + this.player2.bid + ")");
  }
}
