// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMPORTATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Canvas
const {
	createCanvas,
	loadImage
} = require("canvas");

// Fichiers
const {
	writeFileSync,
	createReadStream,
	existsSync,
	mkdirSync
} = require("fs-extra");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT MODULE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

module.exports = {

	config: {

		name: "count",

		version: "2.0",

		author: "NTKhang + Derla Kiritö",

		countDown: 5,

		role: 0,

		description: {
			vi: "Đếm tin nhắn",
			en: "Count messages"
		},

		category: "box chat",

		guide: {
			vi:
				"   {pn}\n"
				+ "   {pn} @tag\n"
				+ "   {pn} all",

			en:
				"   {pn}\n"
				+ "   {pn} @tag\n"
				+ "   {pn} all"
		}
	},

	langs: {

		vi: {

			count:
				"📊 | Số tin nhắn thành viên:",

			endMessage:
				"Những người không có tên là chưa gửi tin nhắn.",

			page:
				"📄 Trang [%1/%2]",

			reply:
				"Reply số trang để xem tiếp",

			result:
				"%1 đứng hạng %2 với %3 tin nhắn",

			yourResult:
				"Bạn đứng hạng %1 với %2 tin nhắn",

			invalidPage:
				"Số trang không hợp lệ"
		},

		en: {

			count:
				"📊 | Message ranking:",

			endMessage:
				"Users not listed have not sent messages.",

			page:
				"📄 Page [%1/%2]",

			reply:
				"Reply with page number",

			result:
				"%1 rank %2 with %3 messages",

			yourResult:
				"You rank %1 with %2 messages",

			invalidPage:
				"Invalid page"
		}
	},

	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
	// START COMMAND
	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

	onStart: async function ({
		args,
		threadsData,
		message,
		event,
		api,
		commandName,
		getLang
	}) {

		const {
			threadID,
			senderID
		} = event;

		// Données thread
		const threadData =
			await threadsData.get(threadID);

		const { members } =
			threadData;

		// Utilisateurs groupe
		const usersInGroup =
			(await api.getThreadInfo(threadID))
				.participantIDs;

		let arraySort = [];

		// Trie membres
		for (const user of members) {

			if (!usersInGroup.includes(user.userID))
				continue;

			const charac =
				"️️️️️️️️️️️️️️️️️";

			arraySort.push({

				name:
					user.name.includes(charac)
						? `Uid: ${user.userID}`
						: user.name,

				count:
					user.count,

				uid:
					user.userID
			});
		}

		// Classement
		let stt = 1;

		arraySort.sort(
			(a, b) => b.count - a.count
		);

		arraySort.map(
			item => item.stt = stt++
		);

		// ━━━━━━━━━━━━━━━━━━━━━━━━
		// COUNT ALL
		// ━━━━━━━━━━━━━━━━━━━━━━━━

		if (
			args[0]
			&&
			args[0].toLowerCase() == "all"
		) {

			// Création dossier cache
			const cachePath =
				path.join(__dirname, "cache");

			if (!existsSync(cachePath)) {
				mkdirSync(cachePath);
			}

			// Canvas
			const canvas =
				createCanvas(1400, 800);

			const ctx =
				canvas.getContext("2d");

			// Fond
			const gradient =
				ctx.createLinearGradient(
					0,
					0,
					1400,
					800
				);

			gradient.addColorStop(
				0,
				"#111827"
			);

			gradient.addColorStop(
				1,
				"#0f172a"
			);

			ctx.fillStyle = gradient;

			ctx.fillRect(
				0,
				0,
				canvas.width,
				canvas.height
			);

			// Bordure
			ctx.strokeStyle = "#00d9ff";

			ctx.lineWidth = 10;

			ctx.strokeRect(
				20,
				20,
				1360,
				760
			);

			// Glow
			ctx.shadowColor = "#00d9ff";

			ctx.shadowBlur = 30;

			// Titre
			ctx.fillStyle = "#ffffff";

			ctx.font = "bold 65px Sans";

			ctx.fillText(
				"📊 MESSAGE RANKING",
				60,
				100
			);

			// Top 5
			ctx.font = "38px Sans";

			let posY = 210;

			const topUsers =
				arraySort.slice(0, 5);

			for (const user of topUsers) {

				ctx.fillStyle = "#00d9ff";

				ctx.fillText(
					`#${user.stt}`,
					80,
					posY
				);

				ctx.fillStyle = "#ffffff";

				ctx.fillText(
					`${user.name}`,
					180,
					posY
				);

				ctx.fillStyle = "#00ff99";

				ctx.fillText(
					`${user.count} msgs`,
					950,
					posY
				);

				posY += 95;
			}

			// Barre
			ctx.fillStyle = "#2f2f2f";

			ctx.fillRect(
				70,
				690,
				600,
				35
			);

			ctx.fillStyle = "#00d9ff";

			ctx.fillRect(
				70,
				690,
				520,
				35
			);

			// Pourcentage
			ctx.fillStyle = "#ffffff";

			ctx.font = "26px Sans";

			ctx.fillText(
				"Top Activity 86%",
				250,
				715
			);

			// Cercle avatar admin
			ctx.beginPath();

			ctx.arc(
				1120,
				320,
				150,
				0,
				Math.PI * 2
			);

			ctx.closePath();

			ctx.fillStyle = "#00d9ff";

			ctx.fill();

			ctx.beginPath();

			ctx.arc(
				1120,
				320,
				132,
				0,
				Math.PI * 2
			);

			ctx.closePath();

			ctx.clip();

			try {

				// Avatar admin
				const adminID =
					global.GoatBot.config.adminBot[0];

				const avatarURL =
					`https://graph.facebook.com/${adminID}/picture?width=512&height=512`;

				const avatarPath =
					path.join(
						cachePath,
						`count_admin_${adminID}.png`
					);

				const response =
					await axios.get(
						avatarURL,
						{
							responseType: "arraybuffer"
						}
					);

				fs.writeFileSync(
					avatarPath,
					response.data
				);

				const avatar =
					await loadImage(avatarPath);

				ctx.drawImage(
					avatar,
					988,
					188,
					264,
					264
				);

			} catch (e) {

				ctx.font = "120px Sans";

				ctx.fillStyle = "#ffffff";

				ctx.fillText(
					"👑",
					1060,
					365
				);
			}

			// Footer
			ctx.font = "26px Sans";

			ctx.fillStyle = "#bbbbbb";

			ctx.fillText(
				"Statistics Interface • GoatBot",
				70,
				770
			);

			// Sauvegarde image
			const imgPath =
				path.join(
					cachePath,
					`count_${threadID}.png`
				);

			writeFileSync(
				imgPath,
				canvas.toBuffer()
			);

			// Délai 3 secondes
			await new Promise(resolve =>
				setTimeout(resolve, 3000)
			);

			// Message classement
			let msg =
				getLang("count");

			for (const item of topUsers) {

				msg +=
					`\n${item.stt}/ ${item.name}: ${item.count}`;
			}

			// Envoie
			return message.reply({

				body:
					msg,

				attachment:
					createReadStream(imgPath)
			});
		}

		// ━━━━━━━━━━━━━━━━━━━━━━━━
		// TAG USER
		// ━━━━━━━━━━━━━━━━━━━━━━━━

		else if (
			args[0]
			&&
			event.mentions
		) {

			let msg = "";

			for (const id in event.mentions) {

				const findUser =
					arraySort.find(
						item => item.uid == id
					);

				msg +=
					`\n${getLang(
						"result",
						findUser.name,
						findUser.stt,
						findUser.count
					)}`;
			}

			return message.reply(msg);
		}

		// ━━━━━━━━━━━━━━━━━━━━━━━━
		// USER RESULT
		// ━━━━━━━━━━━━━━━━━━━━━━━━

		else {

			const findUser =
				arraySort.find(
					item => item.uid == senderID
				);

			return message.reply(

				getLang(
					"yourResult",
					findUser.stt,
					findUser.count
				)
			);
		}
	},

	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
	// REPLY PAGE
	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

	onReply: ({
		message,
		event,
		Reply,
		commandName,
		getLang
	}) => {

		const {
			senderID,
			body
		} = event;

		const {
			author,
			splitPage
		} = Reply;

		if (author != senderID)
			return;

		const page =
			parseInt(body);

		if (
			isNaN(page)
			||
			page < 1
			||
			page > splitPage.totalPage
		) {
			return message.reply(
				getLang("invalidPage")
			);
		}

		let msg =
			getLang("count");

		const arraySort =
			splitPage.allPage[page - 1];

		for (const item of arraySort) {

			if (item.count > 0)

				msg +=
					`\n${item.stt}/ ${item.name}: ${item.count}`;
		}

		message.reply(
			msg
		);
	},

	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
	// AUTO COUNT MESSAGE
	// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━

	onChat: async ({
		usersData,
		threadsData,
		event
	}) => {

		const {
			senderID,
			threadID
		} = event;

		const members =
			await threadsData.get(
				threadID,
				"members"
			);

		const findMember =
			members.find(
				user =>
					user.userID == senderID
			);

		// Nouveau membre
		if (!findMember) {

			members.push({

				userID:
					senderID,

				name:
					await usersData.getName(senderID),

				nickname:
					null,

				inGroup:
					true,

				count:
					1
			});
		}

		// Ajoute message
		else {

			findMember.count += 1;
		}

		// Sauvegarde
		await threadsData.set(
			threadID,
			members,
			"members"
		);
	}
};
