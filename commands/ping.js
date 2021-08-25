/** test command */

module.exports.run = (CommandStruct) => {
	let msg = CommandStruct.message;
    msg.reply('Ping...')
        .then(m => {
            const ping = m.createdTimestamp - msg.createdTimestamp;

            m.edit(`Pong!\nConnection latency: ${ping}ms\nAPI Latency: ${Math.round(msg.client.ws.ping)}ms`);
        });
}

module.exports.helpText = '+ Ping command for testing'