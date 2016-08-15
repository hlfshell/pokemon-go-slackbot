var SlackBot = require('slackbots');
var PokemonGo = require('pokemon-go-node-api');
var geolib = require('geolib');
var opts = require('commander');

function list(val){
	return val.split(',');
}

opts
	.version(require('./package.json').version)
	.option('-c, --config [filepath]', 'Set configuration json file (can set all below settings)')
	.option('-u, --username [username]', 'Pokemon Trainer Club username')
	.option('-p, --password [password]', 'Pokemon Trainer Club password')
	.option('-n, --name [name]', 'Name of your slack bot')
	.option('-t, --token [token]', 'Slack bot token')
	.option('--latitude [latitude]', 'Latitude of scan location', parseFloat)
	.option('--longitude [longitude]', 'Longitude of scan location', parseFloat)
	.option('--channels <channels>', 'List of channels to join (comma seperated) ie: general,games,srsbznss,etc', list)
	.parse(process.argv);

function optsError(){
	console.log.apply(null, Object.keys(arguments).map(key => arguments[key]));
	opts.outputHelp();
	process.exit(0);
}

if(opts.config){
	var config;
	try{
		config = require(opts.config);
	} catch(err){
		optsError("Something has gone wrong while trying to load config file : ", opts.config, err);
	}

	Object.keys(config).forEach(function(key){
		opts[key] = config[key];
	});``
}

//Validate our settings
if(!opts.username || !opts.password) return optsError("Username + password for Pokemon Trainers Club must be provided");
if(!opts.name) return optsError("You must provide the name of your slackbot");
if(!opts.token) return optsError("You must provide the slack bot token");
if(!opts.channels || opts.channels.length <= 0) return optsError("You must provide channels for the bot to enter");
if(!opts.latitude || !opts.longitude) return optsError("You must provide latitude and longitude for scanning");

var bot = new SlackBot({
    token: opts.token, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: opts.name,
	channels: opts.channels
});

var pokeGo = new PokemonGo.Pokeio();

var location = {
	type: 'coords',
	coords: {
		latitude: opts.latitude,
		longitude: opts.longitude,
		altitude: 0
	}
};

var encounters = [];
var heartbeat;

var connectToPokemon = function(){
	pokeGo.init(opts.username, opts.password, location, 'ptc', function(err){
		if(err) return console.error("Something has gone wrong", err);

		console.log("Connected");

		heartbeat = setInterval(function(){
			pokeGo.Heartbeat(function(err, hb){
				if(err) return handleHeartbeatFailure(err);
				nearby = [];
				hb.cells.forEach(function(cell){
					if(cell.MapPokemon.length <= 0) return;
					
					cell.MapPokemon.forEach(function(pokemon){
						announcePokemon(pokemon);
					});
				});
			});
		}, 5000);

	});
};

var handleHeartbeatFailure = function(err){
	console.log("Heartbeat failure, resetting.", err);
	clearInterval(heartbeat);
	connectToPokemon();
};

var announcePokemon = function(pokemon){
	var upid = pokemon.EncounterId.high + ' ' + pokemon.EncounterId.low;
	if(encounters.indexOf(upid) != -1) return;
	encounters.push(upid);
	var distance = geolib.getDistance(
		{ latitude: location.coords.latitude, longitude: location.coords.longitude },
		{ latitude: pokemon.Latitude, longitude: pokemon.Longitude });
	var name = pokeGo.pokemonlist[parseInt(pokemon.PokedexTypeId)-1].name;
	bot.postMessageToChannel('games', 'Pokemon detected: #' + pokemon.PokedexTypeId + ' - ' + name + ' is ' + distance + ' meters away');
}

bot.on('start', function() {
	console.log("Bot started");
	connectToPokemon();
});
