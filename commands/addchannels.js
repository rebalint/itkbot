module.exports.run = (CommandStruct) => {
	let msg = CommandStruct.message;
    msg.guild.channels.fetch(CommandStruct.args[0])
        .then((channel) => {
            //check if first arg is a valid channel category
            if(channel.type == 'GUILD_CATEGORY'){
                console.log(`Adding channels to ${channel.name}`)
                //loop through the rest of args and make channels, copying category perms
                CommandStruct.args.shift()
                CommandStruct.args.forEach((chname) => {
                    msg.guild.channels.create(chname, {
                        type: 'GUILD_TEXT',
                        parent: channel,
                        reason: `Automatic channel creation requested by ${msg.member.user.username}` 
                    })
                        .catch(console.error)
                })
            }
        })
        .catch(console.error);
}

module.exports.helpText = '+ Adds channels to a given category \n - First arg: category id \n - Args after that should be channel names (remember, no spaces)'