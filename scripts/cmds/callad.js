const { getStreamsFromAttachment, log } = global.utils;

// Importation canvas
const { createCanvas } = require("canvas");

const {
	writeFileSync,
	createReadStream,
	existsSync,
	mkdirSync
} = require("fs-extra");

const path = require("path");

// Types de médias acceptés
const mediaTypes = [
	"photo",
	"png",
	"animated_image",
	"video",
	"audio"
];

module.exports = {

	config: {
		name: "callad",
		version: "2.0",
		author: "NTKhang + Derla Kiritö",
		countDown: 5,
		role: 0,

		description: {
			vi: "gửi báo cáo tới admin",
			en: "send feedback to admin"
		},

		category: "utility",

		guide: {
			vi: "   {pn} <message>",
			en: "   {pn} <message>"
		}
	},

	langs: {

		vi: {
			missingMessage:
				"⚠️ | Vui lòng nhập nội dung",

			sendByGroup:
				"\n- Nhóm: %1\n- Thread ID: %2",

			sendByUser:
				"\n- Gửi từ người dùng",

			content:
				"\n\nNội dung:\n─────────────────\n%1\n─────────────────",

			success:
				"✅ | Đã gửi tin nhắn tới %1 admin",

			failed:
				"❌ | Lỗi gửi tới %1 admin",

			reply:
				"📩 Reply từ admin %1:\n─────────────────\n%2\n─────────────────",

			replySuccess:
				"✅ | Đã gửi phản hồi tới admin",

			feedback:
				"📝 Feedback từ %1:\n- UID: %2%3\n\nNội dung:\n─────────────────\n%4\n─────────────────",

			replyUserSuccess:
				"✅ | Đã gửi phản hồi tới người dùng",

			noAdmin:
				"⚠️ | Bot chưa có admin"
		},

		en: {
			missingMessage:
				"⚠️ | Please enter a message",

			sendByGroup:
				"\n- Group: %1\n- Thread ID: %2",

			sendByUser:
				"\n- Sent from user",

			content:
				"\n\nContent:\n─────────────────\n%1\n─────────────────",

			success:
				"✅ | Message sent to %1 admin",

			failed:
				"❌ | Failed to send to %1 admin",

			reply:
				"📩 Reply from admin %1:\n─────────────────\n%2\n─────────────────",

			replySuccess:
				"✅ | Reply sent to admin",

			feedback:
				"📝 Feedback from %1:\n- UID: %2%3\n\nContent:\n─────────────────\n%4\n─────────────────",

			replyUserSuccess:
				"✅ | Reply sent to user",

			noAdmin:
				"⚠️ | Bot has no admin"
		}
	},

	onStart: async function ({
		args,
		message,
		event,
		usersData,
		threadsData,
		api,
		commandName,
		getLang
	}) {

		const { config } =
			global.GoatBot;

		// Vérifie message
		if (!args[0]) {
			return message.reply(
				getLang("missingMessage")
			);
		}

		// Vérifie admins
		if (config.adminBot.length == 0) {
			return message.reply(
				getLang("noAdmin")
			);
		}

		const {
			senderID,
			threadID,
			isGroup
		} = event;

		// Nom utilisateur
		const senderName =
			await usersData.getName(senderID);

		// Création dossier cache
		const cachePath =
			path.join(__dirname, "cache");

		if (!existsSync(cachePath)) {
			mkdirSync(cachePath);
		}

		// Création canvas
		const canvas =
			createCanvas(1400, 750);

		const ctx =
			canvas.getContext("2d");

		// Fond dégradé
		const gradient =
			ctx.createLinearGradient(
				0,
				0,
				1400,
				750
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

		// Bordure cyan
		ctx.strokeStyle = "#00d9ff";
		ctx.lineWidth = 10;

		ctx.strokeRect(
			20,
			20,
			1360,
			710
		);

		// Glow
		ctx.shadowColor = "#00d9ff";
		ctx.shadowBlur = 35;

		// Titre
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 65px Sans";

		ctx.fillText(
			"📨 CALL ADMIN SYSTEM",
			60,
			100
		);

		// Nom utilisateur
		ctx.fillStyle = "#00d9ff";
		ctx.font = "bold 50px Sans";

		ctx.fillText(
			senderName,
			70,
			220
		);

		// ID utilisateur
		ctx.fillStyle = "#cccccc";
		ctx.font = "30px Sans";

		ctx.fillText(
			`UID : ${senderID}`,
			70,
			280
		);

		// Message
		ctx.fillStyle = "#ffffff";
		ctx.font = "34px Sans";

		const content =
			args.join(" ").slice(0, 60);

		ctx.fillText(
			`Message : ${content}`,
			70,
			390
		);

		// Groupe
		ctx.fillStyle = "#aaaaaa";

		ctx.fillText(
			isGroup
				? "Source : Group Chat"
				: "Source : Private Chat",
			70,
			450
		);

		// Barre progression
		ctx.fillStyle = "#2f2f2f";

		ctx.fillRect(
			70,
			560,
			620,
			40
		);

		ctx.fillStyle = "#00d9ff";

		ctx.fillRect(
			70,
			560,
			540,
			40
		);

		// Pourcentage
		ctx.fillStyle = "#ffffff";
		ctx.font = "28px Sans";

		ctx.fillText(
			"87%",
			330,
			590
		);

		// Cercle décoration
		ctx.beginPath();

		ctx.arc(
			1110,
			320,
			150,
			0,
			Math.PI * 2
		);

		ctx.closePath();

		ctx.fillStyle = "#00d9ff";
		ctx.fill();

		// Cercle intérieur
		ctx.beginPath();

		ctx.arc(
			1110,
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
			"📩",
			1060,
			365
		);

		// Footer
		ctx.font = "26px Sans";
		ctx.fillStyle = "#bbbbbb";

		ctx.fillText(
			"Administrator Contact Interface • GoatBot",
			70,
			690
		);

		// Sauvegarde image
		const imgPath =
			path.join(
				cachePath,
				`callad_${senderID}.png`
			);

		writeFileSync(
			imgPath,
			canvas.toBuffer()
		);

		// Attente 3 secondes
		await new Promise(resolve =>
			setTimeout(resolve, 3000)
		);

		// Message admin
		const msg =
			"==📨️ CALL ADMIN 📨️=="
			+
			`\n- User Name: ${senderName}`
			+
			`\n- User ID: ${senderID}`
			+
			(
				isGroup
					?

					getLang(
						"sendByGroup",
						(await threadsData.get(threadID)).threadName,
						threadID
					)

					:

					getLang("sendByUser")
			);

		// Formulaire
		const formMessage = {

			body:
				msg
				+
				getLang(
					"content",
					args.join(" ")
				),

			mentions: [{
				id: senderID,
				tag: senderName
			}],

			attachment:
				await getStreamsFromAttachment(

					[
						...event.attachments,

						...(event.messageReply?.attachments || [])
					]

					.filter(item =>
						mediaTypes.includes(item.type)
					)
				)
		};

		const successIDs = [];
		const failedIDs = [];

		// Noms admins
		const adminNames =
			await Promise.all(

				config.adminBot.map(
					async item => ({
						id: item,
						name:
							await usersData.getName(item)
					})
				)
			);

		// Envoie aux admins
		for (const uid of config.adminBot) {

			try {

				const messageSend =
					await api.sendMessage(
						formMessage,
						uid
					);

				successIDs.push(uid);

				global.GoatBot.onReply.set(
					messageSend.messageID,
					{
						commandName,
						messageID:
							messageSend.messageID,
						threadID,
						messageIDSender:
							event.messageID,
						type:
							"userCallAdmin"
					}
				);

			} catch (err) {

				failedIDs.push({
					adminID: uid,
					error: err
				});
			}
		}

		let msg2 = "";

		// Succès
		if (successIDs.length > 0) {

			msg2 += getLang(
				"success",
				successIDs.length
			);
		}

		// Erreur
		if (failedIDs.length > 0) {

			msg2 += "\n"
				+
				getLang(
					"failed",
					failedIDs.length
				);

			log.err(
				"CALL ADMIN",
				failedIDs
			);
		}

		// Envoie image
		return message.reply({

			body: msg2,

			attachment:
				createReadStream(imgPath),

			mentions:
				adminNames.map(item => ({
					id: item.id,
					tag: item.name
				}))
		});
	},

	onReply: async function ({
		args,
		event,
		api,
		message,
		Reply,
		usersData,
		commandName,
		getLang
	}) {

		const {
			type,
			threadID,
			messageIDSender
		} = Reply;

		const senderName =
			await usersData.getName(
				event.senderID
			);

		const { isGroup } = event;

		switch (type) {

			// Réponse admin -> utilisateur
			case "userCallAdmin": {

				const formMessage = {

					body:
						getLang(
							"reply",
							senderName,
							args.join(" ")
						),

					mentions: [{
						id: event.senderID,
						tag: senderName
					}],

					attachment:
						await getStreamsFromAttachment(

							event.attachments.filter(
								item =>
									mediaTypes.includes(item.type)
							)
						)
				};

				api.sendMessage(
					formMessage,
					threadID,

					(err, info) => {

						if (err)
							return message.err(err);

						message.reply(
							getLang("replyUserSuccess")
						);

						global.GoatBot.onReply.set(
							info.messageID,
							{
								commandName,
								messageID:
									info.messageID,
								messageIDSender:
									event.messageID,
								threadID:
									event.threadID,
								type:
									"adminReply"
							}
						);
					},

					messageIDSender
				);

				break;
			}

			// Réponse utilisateur -> admin
			case "adminReply": {

				let sendByGroup = "";

				if (isGroup) {

					const { threadName } =
						await api.getThreadInfo(
							event.threadID
						);

					sendByGroup =
						getLang(
							"sendByGroup",
							threadName,
							event.threadID
						);
				}

				const formMessage = {

					body:
						getLang(
							"feedback",
							senderName,
							event.senderID,
							sendByGroup,
							args.join(" ")
						),

					mentions: [{
						id: event.senderID,
						tag: senderName
					}],

					attachment:
						await getStreamsFromAttachment(

							event.attachments.filter(
								item =>
									mediaTypes.includes(item.type)
							)
						)
				};

				api.sendMessage(
					formMessage,
					threadID,

					(err, info) => {

						if (err)
							return message.err(err);

						message.reply(
							getLang("replySuccess")
						);

						global.GoatBot.onReply.set(
							info.messageID,
							{
								commandName,
								messageID:
									info.messageID,
								messageIDSender:
									event.messageID,
								threadID:
									event.threadID,
								type:
									"userCallAdmin"
							}
						);
					},

					messageIDSender
				);

				break;
			}
		}
	}
};
