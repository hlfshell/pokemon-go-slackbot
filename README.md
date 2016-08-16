# pokemon-go-slackbot
Pokemon-Go-SlackBot is a bot that announces nearby pokemon to channel(s). Pair this bot with a Slack token, a login for Pokemon Trainer's Club, and a latitude/longitude position to have a helpful Pokemon announcement in any channels you want.

*Warning: Since api usage is a bannable offense, don't be surprised if the account is banned after awhile. I suggest using a fake throw away Pokemon Trainer's Club account.*

#Installation

##Manual
```
git clone https://github.com/hlfshell/pokemon-go-slackbot.git
cd pokemon-go-slackbot
npm install
node chatbot.js -c config.json
```
##Automatic
```
npm install -g pokemon-go-slackbot
pokemon-go-slackbot -c config.json
```

#Setting up
You can use any combination of a configuration file and command line parameters you wish.
##Command Line
```
Username + password for Pokemon Trainers Club must be provided

  Usage: chatbot [options]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -c, --config [filepath]    Set configuration json file (can set all below settings)
    -u, --username [username]  Pokemon Trainer Club username
    -p, --password [password]  Pokemon Trainer Club password
    -n, --name [name]          Name of your slack bot
    -t, --token [token]        Slack bot token
    --latitude [latitude]      Latitude of scan location
    --longitude [longitude]    Longitude of scan location
    --channels <channels>      List of channels to join (comma seperated) ie: general,games,srsbznss,etc
    --exclude <pokemon-list>   List of pokemon to exclude from announcement (comma seperated) ie: 21,16,17,etc
```

## Configuration file (JSON)
```
{
	"username": "Pokemon Trainer's Club username",
	"password": "Pokemon Trainer's Club password",
	"token": "slack token",
	"name": "name",
	"channels": ["channel"],
	"exclude": [21, 16, 17],
	"latitude": 38.632699,
	"longitude": -90.207765
}
```
## Running the bot
You must ensure that you log into Pokemon Go at least once with that account - a Trainer's Club account does not mean you have a Pokemon Go account.

*Warning: It seems that cloud provider IP address ranges are blocked, so you can't use AWS with this.*

Be sure to use the bot-name that you provided slack for that API token. Also, bots will not auto-join rooms - you must invite them into the room before they can post to it.,
