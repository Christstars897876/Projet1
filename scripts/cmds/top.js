const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "top",
	version: "1.0",
	author: "chris st",
	role: 0,
		shortDescription: {
			en: "Top 15 Rich Users"
	},
		longDescription: {
			en: ""
	},
		category: "game",
	guide: {
			en: "{pn}"
	}
	},
	
	onStart: async function ({ api, message, event, usersData }) {
		const allUsers = await usersData.getAll();
		const topUsers = allUsers.sort((a, b) => b.money - a.money).slice(0, 15);

		const canvas = createCanvas(900, 650);
		const ctx = canvas.getContext("2d");

	// Fond
		ctx.fillStyle = "#0f1115";
		ctx.fillRect(0, 0, 900, 650);

	// Titre
		ctx.fillStyle = "#ffd700";
		ctx.font = "bold 40px Arial";
		ctx.fillText("🏆 TOP 15 RICHEST", 270, 60);

	// Ligne de séparation verticale
		ctx.strokeStyle = "#333";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(450, 90);
		ctx.lineTo(450, 620);
		ctx.stroke();

		let y1 = 110, y2 = 110;
		const promises = [];

	// Précharge tous les avatars
		for (let i = 0; i < topUsers.length; i++) {
			const user = topUsers[i];
			const avatarUrl = `https://graph.facebook.com/${user.userID}/picture?width=100&height=100`;
			promises.push(loadImage(avatarUrl).catch(() => null));
	}

		const images = await Promise.all(promises);

		for (let i = 0; i < topUsers.length; i++) {
			const user = topUsers[i];
			const img = images[i];
			
			const isLeft = i < 8;
			const x = isLeft? 30 : 480;
			const y = isLeft? y1 : y2;

			// Rang
			ctx.fillStyle = i < 3? "#ffd700" : "#fff";
			ctx.font = "bold 26px Arial";
			ctx.fillText(`${i + 1}.`, x, y);

			// Avatar
			if (img) {
				ctx.drawImage(img, x + 40, y - 25, 50, 50);
			}

			// Nom
			ctx.fillStyle = "#fff";
			ctx.font = "22px Arial";
			const name = user.name.length > 15? user.name.slice(0, 15) + "..." : user.name;
			ctx.fillText(name, x + 100, y);

			// Argent
			ctx.fillStyle = "#00ff88";
			ctx.font = "20px Arial";
			ctx.fillText(user.money.toLocaleString() + "$", x + 100, y + 22);

			if (isLeft) y1 += 65;
			else y2 += 65;
	}

		const filePath = path.join(__dirname, `top_${event.threadID}.png`);
		fs.writeFileSync(filePath, canvas.toBuffer("image/png"));

		message.reply({ attachment: fs.createReadStream(filePath) });
		setTimeout(() => fs.unlinkSync(filePath), 5000);
	}
};
