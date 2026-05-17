const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");
const Canvas = require("canvas");
const fs = require("fs-extra");
const path = require("path");

const BOT_UID = global.botID;

async function createAdminImage(botName, botAvatarUrl, adminList) {
	try {
		const width = 1200;
		const height = 700;
		const canvas = Canvas.createCanvas(width, height);
		const ctx = canvas.getContext('2d');

	// Fond + dégradé sombre
		const gradient = ctx.createLinearGradient(0, 0, width, height);
	gradient.addColorStop(0, '#0d1026');
	gradient.addColorStop(1, '#1a1f3a');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

	// Bordure néon dorée
		ctx.strokeStyle = '#FFD700';
		ctx.lineWidth = 8;
		ctx.shadowColor = '#FFD700';
		ctx.shadowBlur = 25;
		ctx.strokeRect(15, 15, width - 30, height - 30);
		ctx.shadowBlur = 0;

	// Avatar bot
		let botAvatar = null;
		try {
			if (botAvatarUrl) botAvatar = await Canvas.loadImage(botAvatarUrl);
	} catch {}

		const avatarSize = 140;
		const avatarX = 80;
		const avatarY = 80;

		ctx.save();
		ctx.beginPath();
		ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
		ctx.clip();
		if (botAvatar) {
			ctx.drawImage(botAvatar, avatarX, avatarY, avatarSize, avatarSize);
	} else {
			ctx.fillStyle = '#1a1f3a';
			ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
	}
		ctx.restore();

	// Glow avatar
		ctx.strokeStyle = '#FFD700';
		ctx.lineWidth = 5;
		ctx.shadowColor = '#FFD700';
		ctx.shadowBlur = 20;
		ctx.beginPath();
		ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + 5, 0, Math.PI * 2);
		ctx.stroke();
		ctx.shadowBlur = 0;

	// Nom + UID
		ctx.font = 'bold 38px Sans';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		ctx.fillText(botName, avatarX + avatarSize + 30, avatarY + 55);

		ctx.font = '28px Sans';
		ctx.fillStyle = '#FFD700';
		ctx.fillText(`UID: ${BOT_UID}`, avatarX + avatarSize + 30, avatarY + 95);

	// Titre
		ctx.font = 'bold 48px Sans';
		ctx.fillStyle = '#FFD700';
		ctx.textAlign = 'center';
		ctx.shadowColor = '#FFD700';
		ctx.shadowBlur = 15;
		ctx.fillText('👑 LISTE DES ADMINS BOT 👑', width / 2, avatarY + avatarSize + 80);
		ctx.shadowBlur = 0;

	// Ligne déco
		ctx.strokeStyle = '#FFD700';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(width / 2 - 200, avatarY + avatarSize + 95);
		ctx.lineTo(width / 2 + 200, avatarY + avatarSize + 95);
		ctx.stroke();

		// Liste admins
		ctx.font = '30px Sans';
		ctx.fillStyle = '#FFFFFF';
		ctx.textAlign = 'left';
		let y = avatarY + avatarSize + 160;
		const maxHeight = height - 100;

		for (let i = 0; i < adminList.length; i++) {
			if (y > maxHeight) {
				ctx.fillText(`... et ${adminList.length - i} autres`, 100, y);
				break;
			}
			ctx.fillText(adminList[i], 100, y);
			y += 45;
	}

	// Footer
		ctx.font = '24px Sans';
		ctx.fillStyle = '#aaaaaa';
		ctx.textAlign = 'center';
		ctx.fillText('Système Admin • GoatBot v1.7', width / 2, height - 40);

		return canvas.toBuffer();
	} catch (error) {
		console.log(error);
		return null;
	}
}

async function sendImage(api, event, imageBuffer) {
	try {
		if (!imageBuffer) return;
		const cachePath = path.join(__dirname, "cache");
		if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath, { recursive: true });

		const fileName = `admin_${Date.now()}.png`;
		const filePath = path.join(cachePath, fileName);
		fs.writeFileSync(filePath, imageBuffer);

		await api.sendMessage({
			body: "",
			attachment: fs.createReadStream(filePath)
	}, event.threadID);

		setTimeout(() => {
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
	}, 3000);
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	config: {
		name: "admin",
	version: "1.7",
	author: "NTKhang",
		countDown: 5,
	role: 2,
		description: {
			vi: "Thêm, xóa, sửa quyền admin",
			en: "Add, remove, edit admin role"
	},
		category: "box chat",
	guide: {
			vi: ' {pn} [add | -a] <uid | @tag>: Thêm quyền admin cho người dùng'
				+ '\n	{pn} [remove | -r] <uid | @tag>: Xóa quyền admin của người dùng'
				+ '\n	{pn} [list | -l]: Liệt kê danh sách admin',
			en: ' {pn} [add | -a] <uid | @tag>: Add admin role for user'
				+ '\n	{pn} [remove | -r] <uid | @tag>: Remove admin role of user'
				+ '\n	{pn} [list | -l]: List all admins'
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

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
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
						uids = args.filter(arg =>!isNaN(arg));
					
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid =>
						usersData.getName(uid).then(name => ({ uid, name })).catch(() => ({ uid, name: uid }))
					));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					
					return message.reply(
						(notAdminIds.length > 0? getLang("added", notAdminIds.length, getNames.filter(g => notAdminIds.includes(g.uid)).map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			
			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else
						uids = args.filter(arg =>!isNaN(arg));
					
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					
					const getNames = await Promise.all(adminIds.map(uid =>
						usersData.getName(uid).then(name => ({ uid, name })).catch(() => ({ uid, name: uid }))
					));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					
					return message.reply(
						(adminIds.length > 0? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			
			case "list":
			case "-l": {
				if (config.adminBot.length === 0)
					return message.reply("👑 | Aucun admin configuré");

				const getNames = await Promise.all(config.adminBot.map(uid =>
					usersData.getName(uid).then(name => `• ${name} (${uid})`).catch(() => `• ${uid}`)
				));

				// Message texte d'abord
				await message.reply(getLang("listAdmin", getNames.join("\n")));

				// Puis image profil bot + liste
				const botInfo = await usersData.get(BOT_UID).catch(() => ({ name: "BOT" }));
				const avatarUrl = await usersData.getAvatarUrl(BOT_UID).catch(() => null);
				
				const adminImage = await createAdminImage(botInfo.name || "BOT", avatarUrl, getNames);
				if (adminImage) await sendImage(api, event, adminImage);
				return;
			}
			
			default:
				return message.SyntaxError();
	}
	}
};
