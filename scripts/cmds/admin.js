const { config } = global.GoatBot;
const { writeFileSync, createReadStream, existsSync, mkdirSync } = require("fs-extra");
const path = require("path");

// Importation du canvas
const { createCanvas, loadImage } = require("canvas");

module.exports = {
	config: {
		name: "admin",
		version: "2.0",
		author: "NTKhang + Modified By Derla Kiritö",
		countDown: 5,
		role: 2,

		description: {
			vi: "Thêm, xóa, sửa quyền admin",
			en: "Add, remove, edit admin role"
		},

		category: "box chat",

		guide: {
			vi:
				'   {pn} [add | -a] <uid | @tag>: Thêm quyền admin cho người dùng'
				+ '\n'
				+ '   {pn} [remove | -r] <uid | @tag>: Xóa quyền admin của người dùng'
				+ '\n'
				+ '   {pn} [list | -l]: Liệt kê danh sách admin',

			en:
				'   {pn} [add | -a] <uid | @tag>: Add admin role for user'
				+ '\n'
				+ '   {pn} [remove | -r] <uid | @tag>: Remove admin role of user'
				+ '\n'
				+ '   {pn} [list | -l]: List all admins'
		}
	},

	langs: {
		vi: {
			added: "✅ | Đã thêm quyền admin cho %1 người dùng:\n%2",
			alreadyAdmin: "\n⚠️ | %1 người dùng đã có quyền admin từ trước rồi:\n%2",
			missingIdAdd: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn thêm quyền admin",
			removed: "✅ | Đã xóa quyền admin của %1 người dùng:\n%2",
			notAdmin: "⚠️ | %1 người dùng không có quyền admin:\n%2",
			missingIdRemove: "⚠️ | Vui lòng nhập ID hoặc tag người dùng muốn xóa quyền admin",
			listAdmin: "👑 | Danh sách admin:\n%1"
		},

		en: {
			added: "✅ | Added admin role for %1 users:\n%2",
			alreadyAdmin: "\n⚠️ | %1 users already have admin role:\n%2",
			missingIdAdd: "⚠️ | Please enter ID or tag user to add admin role",
			removed: "✅ | Removed admin role of %1 users:\n%2",
			notAdmin: "⚠️ | %1 users don't have admin role:\n%2",
			missingIdRemove: "⚠️ | Please enter ID or tag user to remove admin role",
			listAdmin: "👑 | List of admins:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {

		switch (args[0]) {

			case "add":
			case "-a": {

				if (args[1]) {

					let uids = [];

					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);

					else if (event.messageReply)
						uids.push(event.messageReply.senderID);

					else
						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];
					const adminIds = [];

					for (const uid of uids) {

						if (config.adminBot.includes(uid))
							adminIds.push(uid);

						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);

					const getNames = await Promise.all(
						uids.map(uid =>
							usersData.getName(uid).then(name => ({ uid, name }))
						)
					);

					writeFileSync(
						global.client.dirConfig,
						JSON.stringify(config, null, 2)
					);

					return message.reply(
						(notAdminIds.length > 0
							? getLang(
								"added",
								notAdminIds.length,
								getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")
							)
							: "")
						+
						(adminIds.length > 0
							? getLang(
								"alreadyAdmin",
								adminIds.length,
								adminIds.map(uid => `• ${uid}`).join("\n")
							)
							: "")
					);
				}

				else {
					return message.reply(getLang("missingIdAdd"));
				}
			}

			case "remove":
			case "-r": {

				if (args[1]) {

					let uids = [];

					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);

					else
						uids = args.filter(arg => !isNaN(arg));

					const notAdminIds = [];
					const adminIds = [];

					for (const uid of uids) {

						if (config.adminBot.includes(uid))
							adminIds.push(uid);

						else
							notAdminIds.push(uid);
					}

					for (const uid of adminIds) {
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					}

					const getNames = await Promise.all(
						adminIds.map(uid =>
							usersData.getName(uid).then(name => ({ uid, name }))
						)
					);

					writeFileSync(
						global.client.dirConfig,
						JSON.stringify(config, null, 2)
					);

					return message.reply(
						(adminIds.length > 0
							? getLang(
								"removed",
								adminIds.length,
								getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")
							)
							: "")
						+
						(notAdminIds.length > 0
							? getLang(
								"notAdmin",
								notAdminIds.length,
								notAdminIds.map(uid => `• ${uid}`).join("\n")
							)
							: "")
					);
				}

				else {
					return message.reply(getLang("missingIdRemove"));
				}
			}

			case "list":
			case "-l": {

				// Création dossier cache
				const cachePath = path.join(__dirname, "cache");

				if (!existsSync(cachePath)) {
					mkdirSync(cachePath);
				}

				// Création canvas
				const canvas = createCanvas(1400, 700);
				const ctx = canvas.getContext("2d");

				// Fond sombre
				ctx.fillStyle = "#0d1026";
				ctx.fillRect(0, 0, canvas.width, canvas.height);

				// Bordure orange néon
				ctx.strokeStyle = "#ff9d00";
				ctx.lineWidth = 8;
				ctx.strokeRect(15, 15, 1370, 670);

				// Ombre néon
				ctx.shadowColor = "#ff9d00";
				ctx.shadowBlur = 25;

				// Titre
				ctx.fillStyle = "#ffffff";
				ctx.font = "bold 55px Sans";
				ctx.fillText("👑 ADMIN LIST", 60, 90);

				// Argent fictif
				ctx.fillStyle = "#ff9d00";
				ctx.font = "bold 90px Sans";
				ctx.fillText("$999.99", 500, 180);

				// Barre décoration
				ctx.fillStyle = "#2f2f2f";
				ctx.fillRect(70, 300, 500, 35);

				ctx.fillStyle = "#ff9d00";
				ctx.fillRect(70, 300, 350, 35);

				// Pourcentage
				ctx.fillStyle = "#ffffff";
				ctx.font = "28px Sans";
				ctx.fillText("70%", 270, 327);

				// Texte secondaire
				ctx.fillStyle = "#ff9d00";
				ctx.font = "bold 38px Sans";
				ctx.fillText("🏆 Top Administrators", 70, 260);

				// Liste admins
				const getNames = await Promise.all(
					config.adminBot.map(uid =>
						usersData.getName(uid).then(name => ({ uid, name }))
					)
				);

				ctx.fillStyle = "#ffffff";
				ctx.font = "30px Sans";

				let y = 400;

				getNames.slice(0, 10).forEach(({ uid, name }, index) => {

					ctx.fillText(
						`${index + 1}. ${name}`,
						90,
						y
					);

					y += 45;
				});

				// Cercle avatar déco
				ctx.beginPath();
				ctx.arc(1120, 280, 130, 0, Math.PI * 2);
				ctx.closePath();

				ctx.fillStyle = "#ff9d00";
				ctx.fill();

				// Intérieur cercle
				ctx.beginPath();
				ctx.arc(1120, 280, 118, 0, Math.PI * 2);
				ctx.closePath();

				ctx.fillStyle = "#111111";
				ctx.fill();

				// Emoji admin
				ctx.font = "100px Sans";
				ctx.fillStyle = "#ffffff";
				ctx.fillText("👑", 1075, 315);

				// Footer
				ctx.font = "24px Sans";
				ctx.fillStyle = "#aaaaaa";
				ctx.fillText(
					"Secure Admin System • GoatBot Messenger",
					60,
					650
				);

				// Sauvegarde image
				const imgPath = path.join(
					cachePath,
					`admin_list_${event.threadID}.png`
				);

				const buffer = canvas.toBuffer();

				writeFileSync(imgPath, buffer);

				// Texte message
				const listText = getNames
					.map(({ uid, name }) => `• ${name} (${uid})`)
					.join("\n");

				// Envoi image
				return message.reply({
					body: getLang("listAdmin", listText),
					attachment: createReadStream(imgPath)
				});
			}

			default:
				return message.SyntaxError();
		}
	}
};
