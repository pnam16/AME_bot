import schedule from "node-schedule";
import moment from "moment-timezone";

import {Client} from "discord.js";
import {getCovidEmbeded, getCovidData, processCommand} from "./services.js";
// import {token} from "../secrets.js";

// set timezone
moment.tz.setDefault("Asia/Ho_Chi_Minh");

const client = new Client();

//Check kết nối discord
client.on("ready", () => {
  client.user.setActivity("4`");

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

  const rule = new schedule.RecurrenceRule();
  rule.hour = [5, 8, 11, 14, 17, 20, 23];
  rule.minute = 0;
  rule.second = 0;

  // 0 */3 * * *          // 3h
  // */5 * * * *        // 5min
  // "*/3 * * * * *"    // 3s

  schedule.scheduleJob(
    // "*/3 * * * * *",
    rule,
    async () => {
      channel.send(`Bây giờ là: ${moment()
        .locale("vi").format("HH:mm:ss")}`);

      const data = await getCovidData();
      channel.send(getCovidEmbeded(data));
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
  message.react("🙄");

  if (message.content.substr(0, 5) === "hit::") {
    processCommand(message);
  }
});

client.login(process.env.DIS_Token);
// client.login(token);
