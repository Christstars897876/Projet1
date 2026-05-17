const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");
const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

module.exports = {
	config: {
		name: "uid",
	version: "1.3",
	author: "NTKhang",
		countDown: 5,
	role: 0,
		description: {
			vi: "Xem user id facebook của người dùng",
			en: "View facebook user id of user"
	},
		category: "info",
	guide: {
			vi: " {pn}: dùng để xem id facebook của bạn"
				+ "\n {pn} @tag: xem id facebook của những người được tag"
				+ "\n {pn} <link profile>: xem id facebook của link profile"
				+ "\n Phản hồi tin nhắn của người khác kèm lệnh để xem id facebook của họ",
			en: " {pn}: use to view your facebook user id"
				+ "\n {pn} @tag: view facebook user id of tagged people"
				+ "\n {pn} <profile link>: view facebook user id of profile link"
				+ "\n Reply to someone's message with the command to view their facebook user id"
	}
	},

	langs: {
	vi: {
			syntaxError: "Vui lòng tag người muốn xem uid hoặc để trống để xem uid của bản thân"
	},
	en: {
			syntaxError: "Please tag the person you want to view uid or leave it blank to view your own uid"
	}
	},

	onStart: async function ({ message, event, args, getLang, api }) {
		let targetID = event.senderID;
		let targetName = "You";

		if (event.messageReply) {
			targetID = event.messageReply.senderID;
	} else if (Object.keys(event.mentions).length > 0) {
			targetID = Object.keys(event.mentions)[0];
			targetName = event.mentions[targetID].replace("@", "");
	} else if (args[0] && args[0].match(regExCheckURL)) {
			try {
				targetID = await findUid(args[0]);
	} catch (e) {
				return message.reply(`ERROR: ${e.message}`);
	}
	} else if (!args[0]) {
			targetID = event.senderID;
	} else {
			return message.reply(getLang("syntaxError"));
	}

		if (targetName === "You") {
			try {
				const info = await api.getUserInfo(targetID);
				targetName = info[targetID].name;
	} catch (e) {}
	}

	// 1. Envoie le message texte d'abord
		await message.reply(`Voici l'UID de ${targetName} :`);

	// 2. Génère le canvas
		const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=200&height=200`;
		const canvas = createCanvas(650, 200);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "#1c1e22";
		ctx.fillRect(0, 0, 650, 200);

		try {
			const avatar = await loadImage(avatarUrl);
			ctx.drawImage(avatar, 30, 30, 140, 140);
	} catch (e) {}

		ctx.strokeStyle = "#444";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(200, 30);
		ctx.lineTo(200, 170);
		ctx.stroke();

		ctx.fillStyle = "#fff";
		ctx.font = "bold 28px Arial";
		ctx.fillText(targetName, 230, 70);

		ctx.fillStyle = "#00bfff";
		ctx.font = "bold 26px Arial";
		ctx.fillText("UID:", 230, 115);
		ctx.fillStyle = "#fff";
		ctx.font = "24px Arial";
		ctx.fillText(targetID, 300, 115);

	// 3. Envoie l'image juste après
		const filePath = path.join(__dirname, `uid_${targetID}.png`);
		fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

		await message.reply({ attachment: fs.createReadStream(filePath) });
		fs.unlinkSync(filePath);
	}
};
