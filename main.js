const Discord = require('discord.js');
const keys = require('./keys.json');
const discordToken = keys.discord_token; //TODO needs actual key
const discordClient = new Discord.Client();
const commandPrefix = '/';
const commandWord = "31";
const commandKey = commandPrefix+commandWord;
const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// https://atom.io/
// https://developers.google.com/sheets/api/quickstart/nodejs
// https://www.youtube.com/watch?v=MiPpQzW_ya0
// https://www.youtube.com/watch?v=dNKWTyhbE1w
// Codeing a deck: https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript

var deck1 = getDeck();
shuffle(deck1);
renderDeck(deck1);

discordClient.login(discordToken);

discordClient.on('ready', () => {
  console.log('Connected to Discord.');
  console.info(`Logged in as ${discordClient.user.tag}!`);
});

//pong
discordClient.on('message', async msg => {
  if (msg.content === 'ping'){
    msg.channel.send('pong');
  }

//command usage
  else if (msg.content === commandKey){
      sayUsage(msg);
  }

//debug
  else if (msg.content === '/debug'){
    console.log(msg)
    msg.channel.send('Please check console logs.');
  }
});

//strike
discordClient.on('message', async msg => {
  if (!msg.content.startsWith(commandKey + ' ')) return;
    let incomingStrike = msg.content;

    if (incomingStrike.startsWith(commandKey)){
      let usageDeclared = false;
      if (!msg.guild.member(msg.author.id).hasPermission("MANAGE_ROLES")) return null;

      let strikeParts = incomingStrike.split(' ');
      if ( strikeParts.length > 2 ) {
        let member = getMember(incomingStrike);
        let reason = incomingStrike.substring(getPosition(incomingStrike, ' ', 2)).trim();

      } else if (strikeParts.length <= 2) {
        if(!usageDeclared){
          msg.channel.send('Please provide a reason.');
          sayUsage(msg);
          usageDeclared = false;
        }
      }
    }
  }
);

function getMember(incomingStrike){
  let parts = incomingStrike.split(' ');
  return parts[1];
}

function getPosition(string, substring, index) {
  return string.split(substring, index).join(substring).length;
}

function sayUsage(msg){
  msg.channel.send('Provide the `@member` and `reason` as following arguments. \n**e.g.** `'+commandKey+' @MemberMan Late for AQ`');
}

function validateMember(member){
  if (member.match(/(<@![0-9])\w+/g)) {
    return true;
  } else if (member.match(/(<@[0-9])\w+/g)) {
    return true;
  } else {
    return false;
  }
}

function getDeck()
{
	var deck = new Array();

	for(var i = 0; i < suits.length; i++)
	{
		for(var x = 0; x < values.length; x++)
		{
			var card = {Value: values[x], Suit: suits[i]};
			deck.push(card);
		}
	}

	return deck;
}

function shuffle(deck)
{
	// for 1000 turns
	// switch the values of two random cards
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}

function renderDeck(deck)
{
 document.getElementById('deck').innerHTML = '';

 for(var i = 0; i < deck.length; i++)
 {
   var card = document.createElement("div");
   var icon = '';
   if (deck[i].Suit == 'hearts')
   icon='?';
   else if (deck[i].Suit == 'spades')
   icon = '?';
   else if (deck[i].Suit == 'diamonds')
   icon = '?';
   else
   icon = '?';

   card.innerHTML = deck[i].Value + '' + icon;
   card.className = 'card';
 document.getElementById("deck").appendChild(card);
 }
}

//**
// Piece that work, that I will still probably
//
// If user has manage roles:
// if (!msg.guild.member(msg.author.id).hasPermission("MANAGE_ROLES")) return null;
//
// Nicknames and author tags:
// let strikedMemberID = msg.guild.member(msg.mentions.users.first()); // strikedMemberID: 153227877008015360
// let memberTag = msg.guild.member(msg.mentions.users.first()).nickname || msg.mentions.users.first().username; // memberTag:Baron Tao
// let authorTag = msg.guild.member(msg.author.id).nickname || msg.author.username;
//
