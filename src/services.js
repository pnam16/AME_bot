import axios from "axios";
import moment from "moment-timezone";

import {readdirSync} from "fs";
import {MessageAttachment, MessageEmbed} from "discord.js";

export const ShowImage = (receivedMessage) => {
  const img = readdirSync("image/"); // Lấy tất cả ảnh thành một list trong folder Image/Anime

  // Lấy random ảnh anime
  const attachment = new MessageAttachment("image/" + img[0]); // Lấy ảnh đầu trong thư mục
  receivedMessage.channel.send(attachment);
};

export const processCommand = (receivedMessage) => {
  let fullCommand = receivedMessage.content
    .substr(5, receivedMessage.content.length);
  if (fullCommand==null || fullCommand =="") return;
  let splitCommand = fullCommand.split(" ");
  let cmd = splitCommand[0];
  let args = splitCommand.slice(1);
  let firstArg = splitCommand[1];
  let secondArg = splitCommand[2];
  let thirdArg = splitCommand[3];

  console.log(splitCommand);
  console.log("Command received: " + cmd);
  console.log("Arguments: " + args);
  console.log("Arguments 1: " + firstArg);
  console.log("Arguments 2: " + secondArg);
  console.log("Arguments 3: " + thirdArg);

  switch(cmd)
  {
  case "covid":
    Covid(receivedMessage);
    break;
  default:
    receivedMessage.channel.send("Bot không hỉu, bot không hỉu, bot không hỉu");
    break;
  }
};

const Covid = async (receivedMessage) => {
  const data = await getCovidData();

  receivedMessage.reply("");
  const exampleEmbed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("Covid 19")
    .setURL("https://www.facebook.com/namnam2k")
    .setAuthor("@pnam")
    .addFields(data)
    .setImage("https://disease.sh/assets/img/flags/vn.png");

  receivedMessage.channel.send(exampleEmbed);
};

const covidUrl = "https://corona.lmao.ninja/v2/countries/vn";
const fetchApi = () => axios.get(covidUrl);

export const getCovidData = async () => {
  const {data} = await fetchApi();
  const {
    updated,
    country,
    cases,
    todayCases,
    deaths,
    todayDeaths,
    recovered,
    todayRecovered,
    population,
    continent,
    undefined: undefine,
    // active,
    // critical,
    // casesPerOneMillion,
    // deathsPerOneMillion,
    // tests,
    // testsPerOneMillion,
    // oneCasePerPeople,
    // oneDeathPerPeople,
    // oneTestPerPeople,
    // activePerOneMillion,
    // recoveredPerOneMillion,
    // criticalPerOneMillion,
  } = data;

  const arr = [
    `Quốc gia:${country}`,
    `Khu vực:${continent}`,
    `Dân số:${population}`,
    `Số ca nhiễm:${cases}`,
    `Số ca tử vong:${deaths}`,
    `Số ca đã phục hồi:${recovered}`,
    `Số ca nhiễm (nay):${todayCases}`,
    `Số ca tử vong (nay):${todayDeaths}`,
    `Số ca đã phục hồi (nay):${todayRecovered}`,
    `Số ca chưa xác định:${undefine}`,
    `Cập nhật lúc:${moment(updated)
      .locale("vi")
      .format("HH:mm:ss, DD/MM/YYYY")}`,
  ];

  return arr.map(e => {
    const items = e.split(":");
    const name = items[0];
    const value = items.slice(1).join(":");
    return {name, value, inline: true};
  },
  );
};
