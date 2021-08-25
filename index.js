require('dotenv').config()

const Discord = require('discord.js')

Intents = Discord.Intents

// Init discord client
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })


// This will contain all the commands when loaded, allowing reference to them later
client.CommandRegistry = {}

const prefix = '~'
const modrole = process.env.MODROLE

//LOAD COMMANDS
const normalizedPath = require('path').join(__dirname, "commands")
// For each file in the commands directory...
const fs = require('fs').readdirSync(normalizedPath).forEach( file => {
  let extensionlessFilename = file.split('.js')[0]
  // Set a member in client.CommandRegistry to the exports of a file in /commands
  client.CommandRegistry[extensionlessFilename] = require('./commands/' + file)

  // Let us know it loaded
  console.log(`Loaded command from ${file}`)
})


//MESSAGE EVENT HANDLER
client.on('messageCreate', msg => {
	//if DM or from bot, ignore
	if(msg.author.bot) return
	else if(msg.guild === null) return

	//TODO: replace in the future if commands usable by everyone are added
	//ignore message if author doesn't have mod role
	if(!msg.member.permissions.has('MANAGE_CHANNELS') && !msg.member.permissions.has('ADMINISTRATOR')) return

    //process command if msg starts with prefix
    if(msg.content.startsWith(prefix)){
        //create command struct
        const CommandStruct = {}
        let CommandSubstring = msg.content.split('~')[1].split(' ') // Splits up a command message

        CommandStruct.command = CommandSubstring[0]
        CommandStruct.args = CommandSubstring.slice(1, CommandSubstring.length+1)
        CommandStruct.message = msg

        //help command is special
        if(CommandStruct.command == 'help'){
            let helpmsg = '\`\`\`markdown\n'
            Object.keys(client.CommandRegistry).forEach((cmd) => {
                helpmsg += `# ${cmd}\n ${client.CommandRegistry[cmd].helpText} \n`
            })
            helpmsg += '\`\`\`'
            msg.reply(helpmsg)
        }
        //if not help, try to run command if possible
        else if(client.CommandRegistry.hasOwnProperty(CommandStruct.command)){
            client.CommandRegistry[CommandStruct.command].run(CommandStruct)
        }
    }   
})

// Set the status
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}`)
    client.user.setPresence({
         activities: [{
             name: 'PLanG',
             type: 'PLAYING'
         }],
         status: 'online'
     })
})

client.login(process.env.DISCORD_TOKEN)