if (!global.client.busyList)
	global.client.busyList = {};

// Importation canvas
const { createCanvas } = require("canvas");

const {
	writeFileSync,
	createReadStream,
	existsSync,
	mkdirSync
} = require("fs-extra");

const path = require("path");

module.exports = {

	config: {
		name: "busy",
		version: "2.0",
		author: "NTKhang + Derla Kiritö",
		countDown: 5,
		role: 0,

		description: {
			vi: "bật chế độ không làm phiền",
			en: "turn on do not disturb mode"
		},

		category: "box chat",

		guide: {
			vi:
				"   {pn} [reason]"
				+ "\n   {pn} off",

			en:
				"   {pn} [reason]"
				+ "\n   {pn} off"
		}
	},

	langs: {

		vi: {
			turnedOff: "✅ | Đã tắt chế độ không làm phiền",
			turnedOn: "✅ | Đã bật chế độ không làm phiền",
			turnedOnWithReason: "✅ | Đã bật với lý do: %1",
			turnedOnWithoutReason: "✅ | Đã bật chế độ không làm phiền",
			alreadyOn: "Người dùng %1 đang bận",
			alreadyOnWithReason: "%1 đang bận với lý do: %2"
		},

		en: {
			turnedOff: "✅ | Do not disturb disabled",
			turnedOn: "✅ | Do not disturb enabled",
			turnedOnWithReason: "✅ | Enabled with reason: %1",
			turnedOnWithoutReason: "✅ | Do not disturb enabled",
			alreadyOn: "User %1 is busy",
			alreadyOnWithReason: "%1 is busy with reason: %2"
		}
	},

	onStart: async function ({
		args,
		message,
		event,
		getLang,
		usersData
	}) {

		const { senderID } = event;

		// Création dossier cache
		const cachePath =
			path.join(__dirname, "cache");

		if (!existsSync(cachePath)) {
			mkdirSync(cachePath);
		}

		// Désactivation
		if (args[0] == "off") {

			const { data } =
				await usersData.get(senderID);

			delete data.busy;

			await usersData.set(
				senderID,
				data,
				"data"
			);

			// Création canvas
			const canvas =
				createCanvas(1300, 700);

			const ctx =
				canvas.getContext("2d");

			// Fond sombre
			const gradient =
				ctx.createLinearGradient(
					0,
					0,
					1300,
					700
				);

			gradient.addColorStop(0, "#0f172a");
			gradient.addColorStop(1, "#111827");

			ctx.fillStyle = gradient;

			ctx.fillRect(
				0,
				0,
				canvas.width,
				canvas.height
			);

			// Bordure verte
			ctx.strokeStyle = "#00ff99";
			ctx.lineWidth = 10;

			ctx.strokeRect(
				20,
				20,
				1260,
				660
			);

			// Glow
			ctx.shadowColor = "#00ff99";
			ctx.shadowBlur = 35;

			// Titre
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 65px Sans";

			ctx.fillText(
				"🟢 DND MODE OFF",
				70,
				110
			);

			// Texte principal
			ctx.fillStyle = "#00ff99";
			ctx.font = "bold 90px Sans";

			ctx.fillText(
				"AVAILABLE",
				350,
				260
			);

			// Description
			ctx.fillStyle = "#ffffff";
			ctx.font = "35px Sans";

			ctx.fillText(
				"You can now receive mentions.",
				70,
				430
			);

			// Cercle décoration
			ctx.beginPath();

			ctx.arc(
				1050,
				320,
				150,
				0,
				Math.PI * 2
			);

			ctx.closePath();

			ctx.fillStyle = "#00ff99";
			ctx.fill();

			// Cercle intérieur
			ctx.beginPath();

			ctx.arc(
				1050,
				320,
				132,
				0,
				Math.PI * 2
			);

			ctx.closePath();

			ctx.fillStyle = "#0f172a";
			ctx.fill();

			// Emoji
			ctx.font = "120px Sans";
			ctx.fillStyle = "#ffffff";

			ctx.fillText(
				"✅",
				1000,
				365
			);

			// Footer
			ctx.font = "26px Sans";
			ctx.fillStyle = "#aaaaaa";

			ctx.fillText(
				"Busy System • GoatBot Messenger",
				70,
				650
			);

			// Sauvegarde
			const imgPath =
				path.join(
					cachePath,
					`busy_off_${senderID}.png`
				);

			writeFileSync(
				imgPath,
				canvas.toBuffer()
			);

			// Attend 3 secondes
			await new Promise(resolve =>
				setTimeout(resolve, 3000)
			);

			// Envoie image
			return message.reply({

				body:
					getLang("turnedOff"),

				attachment:
					createReadStream(imgPath)
			});
		}

		// Raison busy
		const reason =
			args.join(" ") || "";

		// Sauvegarde
		await usersData.set(
			senderID,
			reason,
			"data.busy"
		);

		// Création canvas
		const canvas =
			createCanvas(1300, 700);

		const ctx =
			canvas.getContext("2d");

		// Fond
		const gradient =
			ctx.createLinearGradient(
				0,
				0,
				1300,
				700
			);

		gradient.addColorStop(0, "#190019");
		gradient.addColorStop(1, "#0f172a");

		ctx.fillStyle = gradient;

		ctx.fillRect(
			0,
			0,
			canvas.width,
			canvas.height
		);

		// Bordure rouge
		ctx.strokeStyle = "#ff004c";
		ctx.lineWidth = 10;

		ctx.strokeRect(
			20,
			20,
			1260,
			660
		);

		// Glow
		ctx.shadowColor = "#ff004c";
		ctx.shadowBlur = 35;

		// Titre
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 65px Sans";

		ctx.fillText(
			"🔕 DND MODE ON",
			70,
			110
		);

		// Texte principal
		ctx.fillStyle = "#ff004c";
		ctx.font = "bold 90px Sans";

		ctx.fillText(
			"BUSY",
			470,
			250
		);

		// Raison
		ctx.fillStyle = "#ffffff";
		ctx.font = "35px Sans";

		ctx.fillText(
			reason
				? `Reason : ${reason}`
				: "No reason provided.",
			70,
			430
		);

		// Barre décoration
		ctx.fillStyle = "#2f2f2f";

		ctx.fillRect(
			70,
			520,
			600,
			40
		);

		ctx.fillStyle = "#ff004c";

		ctx.fillRect(
			70,
			520,
			520,
			40
		);

		// Pourcentage
		ctx.fillStyle = "#ffffff";
		ctx.font = "28px Sans";

		ctx.fillText(
			"90%",
			310,
			550
		);

		// Cercle décoration
		ctx.beginPath();

		ctx.arc(
			1050,
			320,
			150,
			0,
			Math.PI * 2
		);

		ctx.closePath();

		ctx.fillStyle = "#ff004c";
		ctx.fill();

		// Cercle intérieur
		ctx.beginPath();

		ctx.arc(
			1050,
			320,
			132,
			0,
			Math.PI * 2
		);

		ctx.closePath();

		ctx.fillStyle = "#111827";
		ctx.fill();

		// Emoji
		ctx.font = "120px Sans";
		ctx.fillStyle = "#ffffff";

		ctx.fillText(
			"🔕",
			1005,
			365
		);

		// Footer
		ctx.font = "26px Sans";
		ctx.fillStyle = "#aaaaaa";

		ctx.fillText(
			"Private Mode System • GoatBot",
			70,
			650
		);

		// Sauvegarde image
		const imgPath =
			path.join(
				cachePath,
				`busy_on_${senderID}.png`
			);

		writeFileSync(
			imgPath,
			canvas.toBuffer()
		);

		// Attend 3 secondes
		await new Promise(resolve =>
			setTimeout(resolve, 3000)
		);

		// Envoie image
		return message.reply({

			body:
				reason
					? getLang(
						"turnedOnWithReason",
						reason
					)
					: getLang(
						"turnedOnWithoutReason"
					),

			attachment:
				createReadStream(imgPath)
		});
	},

	onChat: async ({
		event,
		message,
		getLang
	}) => {

		const { mentions } = event;

		// Vérifie mentions
		if (
			!mentions
			||
			Object.keys(mentions).length == 0
		)
			return;

		const arrayMentions =
			Object.keys(mentions);

		for (const userID of arrayMentions) {

			// Vérifie raison busy
			const reasonBusy =
				global.db.allUserData.find(
					item => item.userID == userID
				)?.data.busy || false;

			// Si utilisateur busy
			if (reasonBusy !== false) {

				return message.reply(

					reasonBusy
						?

						getLang(
							"alreadyOnWithReason",
							mentions[userID]
								.replace("@", ""),
							reasonBusy
						)

						:

						getLang(
							"alreadyOn",
							mentions[userID]
								.replace("@", "")
						)
				);
			}
		}
	}
};
