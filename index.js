// jshint esversion: 6
const {
    token,
    categoryID,
    voiceID,
    permissions
} = require('./config.json'), {
    Client
} = require('discord.js'),
    client = new Client();

client.once('ready',
    () => console.info('Bot started.')
);

client.on('voiceStateUpdate', (Old, New) => {
    if(New.user.bot) return;
    if(Old.user.bot) return;

    if(New.voiceChannelID == voiceID) {
        New.guild.createChannel(New.user.username, { type: "voice", parent: categoryID })
            .then((set) => {
                set.overwritePermissions(New.user, permissions[0]);
                set.overwritePermissions(New.guild.id, permissions[1]);
            
                return New.setVoiceChannel(New.guild.channels.get(set.id));
            });
    }

    if(Old.voiceChannel) {
        let filter = (ch) =>
            (ch.parentID == categoryID)
            && (ch.id !== voiceID)
            && (Old.voiceChannelID == ch.id)
            && (Old.voiceChannel.members.size == 0);
        
        return Old.guild.channels
            .filter(filter)
            .forEach((ch) => ch.delete());
    }
});

client.login(token);
