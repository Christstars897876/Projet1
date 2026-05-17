const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "gifle",
    version: "3.0.0",
    author: "Zetsu",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Slap someone virtually!",
    },
    longDescription: {
      en: "This command allows you to virtually slap someone. Mention the person you want to slap.",
    },
    category: "fun",
    guide: {
      en: "{p}slap [tag]",
    },
  },
  onStart: async function({ api, event, args }) {
    const { threadID, messageID, mentions } = event;
    const mention = Object.keys(mentions)[0];
    const tag = mentions[mention].replace("@", "");

    if (!mention) {
      return api.sendMessage("Mention 1 person that you want to slap", threadID, messageID);
    }

    const link = ["https://i.postimg.cc/1tByLBHM/anime-slap.gif"];

    const callback = () =>
      api.sendMessage(
        {
          body: `J'ai giflé ${tag} ! \n\n*Désolé, j'avais cru voir un moustique sur ton vilain visage 🤷🏻‍♂️*`,
          mentions: [{ tag: tag, id: mention }],
          attachment: fs.createReadStream(__dirname + "/tmp/slap.gif"),
        },
        threadID,
        () => fs.unlinkSync(__dirname + "/tmp/slap.gif"),
        messageID
      );

    return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
      .pipe(fs.createWriteStream(__dirname + "/tmp/slap.gif"))
      .on("close", () => callback());
  },
};
