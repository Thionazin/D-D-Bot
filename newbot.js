const Discord = require('discord.js');
 const client = new Discord.Client();
 const mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost/playTimeDatabase', {useNewUrlParser: true});
 const Player = require("./playtimes.js");
 const Maps = require("./maps.js");

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 client.user.setGame('with nukes | $help')
 });

 const prefix = '$';

client.on('guildMemberAdd', member =>
{
  member.client.channels.find('name', "welcome").send('Hello and welcome to the server ' + member + '! Please check out <#585523771797012504>');
}
);

client.on('message', msg => {
  if(msg.channel.name == "character-approval")
  {
    msg.guild.channels.find('name', "senior-dm-chat").send('<@&522718332332277770> A character approval request has been submitted.');
  }

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

const args = msg.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();


//if(command === 'test')
//{
//  msg.client.channels.find('name', "welcome").send('Hello and welcome to the server' + '! Please check out <#585523771797012504>');
//}
if(command === 'help')
{

  //msg.channel.send('**Command List:**\n```yaml\nlogon: starts logging rp time\nlogoff: stops logging rp time\nrewardxp: Gives out the xp currently logged in the database.\nloglist: Checks who is currently logging RP time.\nrpon: shows you are available for RP\nrpoff: Shows you are not available for RP\ndmon: Shows you are available for dming.\ndmoff: Shows you are not available for dming.\ncharacterlist: lists all characters you have and their status.\n```');
  msg.author.send('**Role Commands:**\n```yaml\n$rpon: Shows you are available for RP\n$rpoff: Shows you are not available for RP\n```\n**Character Commands:**```yaml\n$createcharacter "<charactername>": Creates a character in one of your slots.\n$deletecharacter "<charactername>": Deletes said character.\n$listcharacters: Lists your characters and your slots.\n```\n**Log Commands:**```yaml\n$logon "<charactername>": Starts logging time for said character.\n$logoff "<charactername>": Stops logging time for said character.\n$loglist: Check who is currently logging their RP time.\n```\n**Map Commands:**\n```yaml\n$getmap "<Map Name>": Gets a map with said name.\n$maplist: Lists all maps\n```\n');
  if (msg.member.roles.has(msg.guild.roles.find("name", "Server Staff").id)) {
      msg.author.send('**Special Commands:**\n```yaml\n$rewardxp: RP Approvers only. Rewards XP from RP.\n$dmon: Shows you are available for dming. DM only.\n$dmoff: Shows you are not available for dming. DM only.\n$createmap "<Map Name>" "<Link to Map>": Creates a map entry with given name and link.\n$deletemap "<Map Name>": Deletes a man entry with given name.\n```\n');
    } else {

    }
}
else if(command === 'logon')
{
  if(msg.content.includes('"'))
  {
  var start_pos = msg.content.indexOf('"') + 1;
  var end_pos = msg.content.indexOf('"',start_pos);
  var characterName = msg.content.substring(start_pos,end_pos).toLowerCase();
  }
  else {
    if(args.length != 1) {
      msg.channel.send('Invalid syntax\n**Format:** $logon "<character name>"');
      return;
    }
    var characterName = args[0].toLowerCase();
  }
  let rightNow = new Date();
  let now = rightNow.getTime();
  Player.findOne({
    userID: msg.author.id,
    character: characterName
  }, (err, playTime) => {
    if(err) {console.log(err); msg.channel.send('Error, this is either not your character or some other error.')};
    if(!playTime){
      /*
      msg.channel.send('You are now logging RP time!');
      const newPlayer = new Player({
        serverID: msg.guild.id,
        userID: msg.author.id,
        character: characterName,
        time: 0,
        startTime: now,
        endTime: 0,
        logging: true
      })
      newPlayer.save().catch(err => console.log(err));
      */
      msg.channel.send('You do not currently have a character by this name.')
    }
    else
    {
      if(playTime.logging)
      {
        msg.channel.send('You are already logging RP time!');
      }
      else {
        msg.channel.send('You are now logging RP time!');
        playTime.startTime = now;
        playTime.logging = true;
        playTime.save().catch(err => console.log(err));
      }
    }
  })
}
else if(command === 'logoff')
{
  if(msg.content.includes('"'))
  {
  var start_pos = msg.content.indexOf('"') + 1;
  var end_pos = msg.content.indexOf('"',start_pos);
  var characterName = msg.content.substring(start_pos,end_pos).toLowerCase();
  }
  else {
    if(args.length != 1) {
      msg.channel.send('Invalid syntax\n**Format:** $logoff "<character name>"');
      return;
    }
    characterName = args[0].toLowerCase();
  }
  let rightNow = new Date();
  let now = rightNow.getTime();
  Player.findOne({
    userID: msg.author.id,
    character: characterName
  }, (err, playTime) => {
    if(err) {console.log(err); msg.channel.send('Error, this is either not your character or some other error.')};
    if(!playTime){
      msg.channel.send('You do not currently have a character by this name.');
      /*
      const newPlayer = new Player({
        serverID: msg.guild.id,
        userID: msg.author.id,
        character: characterName,
        time: 0,
        startTime: 0,
        endTime: 0,
        logging: false
      })
      */

      //newPlayer.save().catch(err => console.log(err));
    }
    else
    {
      if(playTime.logging)
      {
        msg.channel.send('You are no longer logging RP time.');
        let tempTime = now - playTime.startTime;
        let secondTemp = Math.round(tempTime / 1000);
        let minuteTemp = Math.round(secondTemp / 60);
        playTime.time = playTime.time + minuteTemp;
        playTime.startTime = 0;
        playTime.logging = false;
        playTime.save().catch(err => console.log(err));
      }
      else {
        msg.channel.send('You are not currently logging RP time.');
      }
    }
  })

}
else if(command === 'createcharacter')
{
  /*
  if(args.length != 1) {
    msg.channel.send('Invalid syntax\n**Format:** $createcharacter <character name>');
    return;
  }
  */
  if(msg.content.includes('"'))
  {
  var start_pos = msg.content.indexOf('"') + 1;
  var end_pos = msg.content.indexOf('"',start_pos);
  var characterName = msg.content.substring(start_pos,end_pos).toLowerCase();
  }
  else {
    if(args.length != 1) {
      msg.channel.send('Invalid syntax\n**Format:** $createcharacter "<Character Name>"');
      return;
    }
    var characterName = args[0].toLowerCase();
  }

  let canCreate = true;
  Player.find({} , (err, players) => {
    let characterCount = 0;
      if(err) console.log(err);

      players.map(player => {
          //Do somethign with the user
          //player.userID === msg.author.id
          if(player.userID === msg.author.id)
          {
            characterCount = characterCount + 1;
          }
          else {
            {

            }
          }
      })
      if(characterCount >= 2)
      {
        canCreate = false;
      }
      else if(characterCount <= 2)
      {
        canCreate = true;
      }

      if(canCreate)
      {
        Player.findOne({
          userID: msg.author.id,
          character: characterName
        }, (err, playTime) => {
          if(err) {console.log(err); msg.channel.send('Error.')};
          if(!playTime){

            msg.channel.send('Character created successfully!');
            const newPlayer = new Player({
              serverID: msg.guild.id,
              userID: msg.author.id,
              character: characterName,
              time: 0,
              startTime: 0,
              endTime: 0,
              logging: false,
            })
            newPlayer.save().catch(err => console.log(err));


          }
          else
          {
            msg.channel.send('This character already exists.');
          }
        })
      }
      else {
        msg.channel.send('You have used up all your character slots.');
        return;
      }

  });
  //let characterName = text_to_get;

}
else if(command === 'deletecharacter')
{
  /*
  if(args.length != 1) {
    msg.channel.send('Invalid syntax\n**Format:** $cdeletecharacter <character name>');
    return;
  }
  */
  if(msg.content.includes('"'))
  {
  var start_pos = msg.content.indexOf('"') + 1;
  var end_pos = msg.content.indexOf('"',start_pos);
  var characterName = msg.content.substring(start_pos,end_pos).toLowerCase();
  }
  else {
    if(args.length != 1) {
      msg.channel.send('Invalid syntax\n**Format:** $deletecharacter "<character name>"');
      return;
    }
    var characterName = args[0].toLowerCase();
  }
  Player.findOneAndDelete({
    userID: msg.author.id,
    character: characterName
  }, (err, playTime) => {
    if(err) {console.log(err); msg.channel.send('Error.')};
    if(!playTime){
      msg.channel.send('Character does not exist.');
    }
    else
    {
      msg.channel.send('Character deleted successfully!');
    }
  })
}
else if(command === 'listcharacters')
{
  //let textReply = '**List of your characters:**\n';
  Player.find({} , (err, players) => {
    let characterCount = 0;
    let textReply = '**List of your characters:**\n';
      if(err) console.log(err);

      players.map(player => {
          //Do somethign with the user
          //player.userID === msg.author.id
          if(player.userID === msg.author.id)
          {
            let activity = '';
            let logging = '';
            if(player.active)
            {
              activity = '*Active*, '
            }
            else {
              activity = '*Retired*, '
            }
            if(player.logging)
            {
              logging = 'Currently logging hours';
            }
            else {
              logging = 'Not logging hours';
            }
            textReply = textReply.concat('**' + player.character + '**, ' + logging + '\n');
            characterCount += 1;
          }
          else {
            {

            }
          }
      })
      if(characterCount === 0)
      {
        msg.channel.send(textReply + '*Empty Slot*\n' + '*Empty Slot*\n');
      }
      else if (characterCount === 1)
      {
        msg.channel.send(textReply + '*Empty Slot*\n');
      }
      else {
        msg.channel.send(textReply);
      }
  })
  //msg.channel.send(textReply);
}
else if(command === 'rewardxp')
{
  if (msg.member.roles.has(msg.guild.roles.find("name", "RP-approvers").id)) {
    Player.find({} , (err, players) => {
        if(err) console.log(err);

        players.map(player => {
            //Do somethign with the user
            if(player.time != 0)
            {
              let tempExp = player.time * 2;
              let characterName = player.character;
              msg.client.channels.find('name', "xp-rewards").send('<@' + player.userID + '>' + ' ' + tempExp + 'XP for RP as ' + '**' + characterName + '**');
              player.time = 0;
              player.save().catch(err => console.log(err));
            }
            else {
              {

              }
            }
        })
    })
    msg.channel.send('Success');
    } else {
      msg.channel.send('You do not have permission to run this command.');
    }


}
else if(command === 'loglist')
{
  //let logList = '**Currently Logging RP:**\n';
  Player.find({} , (err, players) => {
      if(err) console.log(err);
      let logList = '**Currently Logging RP:**\n';
      players.map(player => {
          //Do somethign with the user
          if(player.logging)
          {
            //let useridTemp = '<@' + player.userID + '>';
            logList = logList + '*' + msg.guild.members.get(player.userID).displayName + '* as **' + player.character + '**\n'
          }
          else {
            {

            }
          }
      })
      msg.channel.send(logList);
  })
  //msg.channel.send(logList);
}
else if(command === 'testreward')
{
  Player.findOne({
    userID: msg.author.id
  }, (err, playTime) => {
    if(err) console.log(err);
    if(!playTime){



    }
    else
    {
      msg.client.channels.find('name', "xp-rewards").send(playTime.time);
      playTime.time = 0;
      playTime.save().catch(err => console.log(err));
    }
  })
}
else if(command === 'rpon')
{
  if(msg.member.roles.has(msg.guild.roles.find("name", "Available for RP").id))
  {
    msg.channel.send('You are already available for RP.');
  }
  else
    {
msg.channel.send('You are now available for RP!');
msg.member.addRole(msg.guild.roles.find("name", "Available for RP"));
    }
}
else if(command === 'rpoff')
{
  if(msg.member.roles.has(msg.guild.roles.find("name", "Available for RP").id))
  {
    msg.channel.send('You are no longer available for RP.');
    msg.member.removeRole(msg.guild.roles.find("name", "Available for RP"));
  }
  else
    {
      msg.channel.send('You are already not available for RP.');
    }
}
else if(command === 'dmon')
{
  if (msg.member.roles.has(msg.guild.roles.find("name", "Dungeon Master").id)) {
    if(msg.member.roles.has(msg.guild.roles.find("name", "Available DM").id))
    {
      msg.channel.send('You are already available for DMing.');
    }
    else
      {
  msg.channel.send('You are now available for DMing!');
  msg.member.addRole(msg.guild.roles.find("name", "Available DM"));
      }
    } else {

    }
}
else if(command === 'dmoff')
{
  if (msg.member.roles.has(msg.guild.roles.find("name", "Dungeon Master").id)) {
    if(msg.member.roles.has(msg.guild.roles.find("name", "Available DM").id))
    {
      msg.member.removeRole(msg.guild.roles.find("name", "Available DM"));
      msg.channel.send('You are no longer available for DMing.');
    }
    else
      {
  msg.channel.send('You are already not available for DMing.');
      }
    } else {

    }
}
else if(command === 'launchnukes')
{
  msg.channel.send('Nukes have been launched successfully!');
}
else if(command === 'selfdestruct')
{
  msg.channel.send('Feature is disabled.');
}
else if(command === 'death')
{
  Player.findOneAndDelete({
    userID: msg.author.id,
  }, (err, playTime) => {
    if(err) {console.log(err); msg.channel.send('Error.')};
    if(!playTime){
      msg.channel.send('Character does not exist.');
    }
    else
    {
      msg.channel.send('Character deleted successfully!');
    }
  })
}
else if(command === 'maplist')
{
  Maps.find({} , (err, maps) => {
      if(err) console.log(err);
      var mapList = '**Maps:**\n';
      maps.map(map => {
        mapList = mapList + map.mapName + '\n';

      })
      msg.channel.send(mapList);
  })
}
else if(command === 'createmap')
{
  if (!msg.member.roles.has(msg.guild.roles.find("name", "Server Staff").id))
  {
    msg.channel.send('You do not have permission to run this command.');
    return;
  }
  var start_pos = msg.content.indexOf('"') + 1;
  var second_pos = msg.content.indexOf('"',start_pos);
  var third_pos = msg.content.indexOf('"',second_pos + 1);
  var fourth_pos = msg.content.indexOf('"',third_pos + 1);
  if((start_pos == -1) || (second_pos == -1) || (third_pos == -1) || (fourth_pos == -1))
  {
    msg.channel.send('*Invalid Syntax*\n$createmap "<Map Name>" "<Map Link>"');
    return;
  }
  var mapName = msg.content.substring(start_pos,second_pos).toLowerCase();
  var mapLink = msg.content.substring(third_pos+1,fourth_pos);
  //msg.channel.send('' + start_pos + second_pos + third_pos + fourth_pos);
  Maps.findOne({
    serverID: msg.guild.id,
    mapName: mapName
  }, (err, map) => {
    if(err) {console.log(err); msg.channel.send('Error.')};
    if(!map){
      msg.channel.send('Map created successfully!');
      const newMap = new Maps({
        serverID: msg.guild.id,
        mapName: mapName,
        mapLink: mapLink,
      })
      newMap.save().catch(err => console.log(err));
    }
    else
    {
      msg.channel.send('A map with this name already exists.');
    }
  })
}
else if(command === 'deletemap')
{
  if (!msg.member.roles.has(msg.guild.roles.find("name", "Server Staff").id))
  {
    msg.channel.send('You do not have permission to run this command.');
    return;
  }
  var start_pos = msg.content.indexOf('"') + 1;
  var second_pos = msg.content.indexOf('"',start_pos);
  if((start_pos == -1) || (second_pos == -1))
  {
    msg.channel.send('*Invalid Syntax*\n$deletemap "<Map Name>"');
    return;
  }
  var mapName = msg.content.substring(start_pos,second_pos).toLowerCase();
  Maps.findOneAndDelete({
    serverID: msg.guild.id,
    mapName: mapName
  }, (err, map) => {
    if(err) {console.log(err); msg.channel.send('Error.')};
    if(!map){
      msg.channel.send('This map does not exist.');
    }
    else
    {
      msg.channel.send('Map deleted.');
    }
  })
}
else if(command === 'getmap')
{
  var start_pos = msg.content.indexOf('"') + 1;
  var second_pos = msg.content.indexOf('"',start_pos);
  if((start_pos == -1) || (second_pos == -1))
  {
    msg.channel.send('*Invalid Syntax*\n$getmap "<Map Name>"');
    return;
  }
  var mapName = msg.content.substring(start_pos,second_pos).toLowerCase();
  Maps.findOne({
    serverID: msg.guild.id,
    mapName: mapName
  }, (err, map) => {
    if(err) {console.log(err); msg.channel.send('Error.')};
    if(!map){
      msg.channel.send('This map does not exist.');
    }
    else
    {
      msg.channel.send('**' + map.mapName + ':**\n' + '*' + map.mapLink + '*');
    }
  })
}
else if(command === 'forceresethours')
{
  if (msg.member.roles.has(msg.guild.roles.find("name", "Senior DM").id) || msg.member.roles.has(msg.guild.roles.find("name", "Server IT").id)) {
    var start_pos = msg.content.indexOf('"') + 1;
    var second_pos = msg.content.indexOf('"',start_pos);
    if((start_pos == -1) || (second_pos == -1))
    {
      msg.channel.send('*Invalid Syntax*\n$forceresethours "<Character Name>"');
      return;
    }
    let characterName = msg.content.substring(start_pos,second_pos).toLowerCase();
    Player.findOne({q
      character: characterName
    }, (err, char) => {
      if(err) {console.log(err); msg.channel.send('Error.')};
      if(!char){
        msg.channel.send('This character does not exist.');
        msg.channel.send(characterName);
      }
      else
      {
        char.time = 0;
        msg.channel.send('Time reset successfully!');
      }
    })

    } else {
      msg.channel.send('You do not have permission to run this command.');
    }
}



 });



 const fs = require('fs')
 fs.readFile('./login', 'utf8', (err, data) => {
     client.login(data)
   }
 )
