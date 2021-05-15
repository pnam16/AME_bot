import {Client} from "discord.js";

import schedule from "node-schedule";
import moment from "moment-timezone";

import {getCovidData, processCommand} from "./services.js";

// set timezone
moment.tz.setDefault("Asia/Ho_Chi_Minh");

const client = new Client();

//Check kết nối discord
client.on("ready", () => {
  client.user.setActivity("DISCORD", {type: "STREAMING"});

  console.log("ready");
  // Vòng FOR duyệt guilds và các channels
  // client.guilds.cache.forEach((guild) => {
  //   console.log(guild.name);
  //   guild.channels.cache.forEach((channel) => {
  //     console.log(` - ${channel.name} ${channel.type} ${channel.id}`);
  //   });
  // });

  const channel = client.channels.cache.get("841682021218254858");

  // const attach = new Discord.MessageAttachment("./image/image.jpg");
  // channel.send("hihi");
  // channel.send(attach);

  // */6 * * *          // 6h
  // "*/3 * * * * *"    // 3s

  const rule = new schedule.RecurrenceRule();

  rule.hour = [5, 11, 17];
  rule.second = 0;

  schedule.scheduleJob(
    "*/1 * * *",
    // rule,
    async () => {
      channel.send(await getCovidData());
    });

  // job;
});

client.on("message", async(message) => {

  if (
    message.author === client.user ||
    message.member.roles.cache.some((role) => role.name === "bot") ||
    message.channel.name !== "phuong_nam"
  ) return;

  message.react("✅");
  message.react("😜");

  if (message.content.substr(0, 5) === "hit::") {
    processCommand(message);
  }
});

client.login(process.env.DIS_Token);
