const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "tid",
	version: "1.2",
	author: "chris dt",
		countDown: 5,
	role: 0,
		description: {
			vi: "Xem id nhóm chat của bạn",
			en: "View threadID of your group chat"
	},
		category: "info",
	guide: {
			en: "{pn}"
	}
	},

	onStart: async function ({ message, event, api }) {
		const threadID = event.threadID.toString();
		const senderID = event.senderID.toString();

	// Récupère nom + avatar
		let userName = "User";
		let avatarUrl = `https://graph.facebook.com/${senderID}/picture?width=200&height=200`;
		try {
			const userInfo = await api.getUserInfo(senderID);
			userName = userInfo[senderID].name;
	} catch (e) {}

	// Crée le canvas
		const canvas = createCanvas(700, 220);
		const ctx = canvas.getContext("2d");

	// Fond
		ctx.fillStyle = "#18191c";
		ctx.fillRect(0, 0, 700, 220);

	// Avatar utilisateur à gauche
		const avatar = await loadImage(avatarUrl);
		ctx.drawImage(avatar, 30, 30, 120, 120);

	// Texte profil à gauche
		ctx.fillStyle = "#fff";
		ctx.font = "bold 28px Arial";
		ctx.fillText(userName, 170, 80);
		ctx.font = "22px Arial";
		ctx.fillText("Command: !tid", 170, 120);

	// Séparateur vertical
		ctx.strokeStyle = "#444";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(350, 30);
		ctx.lineTo(350, 190);
		ctx.stroke();

	// Réponse bot à droite
		ctx.fillStyle = "#00bfff";
		ctx.font = "bold 28px Arial";
		ctx.fillText("🤖 Bot Response", 380, 80);
		ctx.fillStyle = "#fff";
		ctx.font = "22px Arial";
		ctx.fillText("Thread ID:", 380, 120);
		ctx.fillText(threadID, 380, 155);

	// Sauvegarde et envoie
		const filePath = path.join(__dirname, `tid_${senderID}.png`);
		const buffer = canvas.toBuffer("image/png");
		fs.writeFileSync(filePath, buffer);

		message.reply({ attachment: fs.createReadStream(filePath) });

	// Supprime le fichier après envoi
		setTimeout(() => fs.unlinkSync(filePath), 5000);
	}
};
