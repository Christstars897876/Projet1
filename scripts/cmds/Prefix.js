const fs = require("fs-extra");
const { utils } = global;
const Canvas = require("canvas");
const path = require("path");

const BOT_UID = global.botID;

async function createPrefixImage(type, data, usersData) {
  try {
    const width = 1200;
    const height = 700;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    let botAvatar;
    let botName = "MINATO NAMIKAZE";

    try {
      const avatarUrl = await usersData.getAvatarUrl(BOT_UID);
      botAvatar = await Canvas.loadImage(avatarUrl);

      const botInfo = await usersData.get(BOT_UID);
      if (botInfo && botInfo.name) {
        botName = botInfo.name;
      }
    } catch (error) {
      botAvatar = null;
    }

    // Fond sombre + dégradé néon bleu
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0d1026');
    gradient.addColorStop(1, '#1a1f3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Bordure néon bleu
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#00d9ff';
    ctx.shadowBlur = 25;
    ctx.strokeRect(15, 15, width - 30, height - 30);
    ctx.shadowBlur = 0;

    // Avatar rond avec glow
    const avatarSize = 140;
    const avatarX = 80;
    const avatarY = 80;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (botAvatar) {
      ctx.drawImage(botAvatar, avatarX, avatarY, avatarSize, avatarSize);
    } else {
      ctx.fillStyle = '#1a1f3a';
      ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
    }
    ctx.restore();

    // Cercle glow autour avatar
    ctx.strokeStyle = '#00d9ff';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#00d9ff';
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
    ctx.fillStyle = '#00d9ff';
    ctx.fillText(`UID: ${BOT_UID}`, avatarX + avatarSize + 30, avatarY + 95);

    // Titre selon type
    let title, color, icon, status;
    switch(type) {
      case 'info':
        title = '🥷 SYSTÈME PRÉFIX 🌀';
        color = '#00d9ff';
        icon = '⚙️';
        status = 'CONFIGURATION';
        break;
      case 'changed':
        title = data.isGlobal? '🥷 PRÉFIX GLOBAL MODIFIÉ 🌍' : '🥷 PRÉFIX BOX MODIFIÉ ✅';
        color = data.isGlobal? '#FFD700' : '#00d9ff';
        icon = data.isGlobal? '👑' : '💬';
        status = data.isGlobal? 'GLOBAL CHANGÉ' : 'BOX CHANGÉE';
        break;
      case 'confirmation':
        title = data.isGlobal? '⚠️ CONFIRMATION GLOBALE ⚠️' : '⚠️ CONFIRMATION ⚠️';
        color = '#ff4d4d';
        icon = '❓';
        status = 'EN ATTENTE';
        break;
      case 'reset':
        title = '🔄 PRÉFIX RÉINITIALISÉ 🔄';
        color = '#888';
        icon = '↩️';
        status = 'RÉINITIALISÉ';
        break;
    }

    // Titre centré avec glow
    ctx.font = 'bold 48px Sans';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillText(title, width / 2, avatarY + avatarSize + 80);
    ctx.shadowBlur = 0;

    // Ligne déco
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, avatarY + avatarSize + 95);
    ctx.lineTo(width / 2 + 200, avatarY + avatarSize + 95);
    ctx.stroke();

    // Infos
    ctx.font = 'bold 32px Sans';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';

    let y = avatarY + avatarSize + 160;

    if (data.newPrefix) {
      ctx.fillText(`🎯 Nouveau Préfix: ${data.newPrefix}`, 100, y);
      y += 50;
    }
    if (data.oldPrefix) {
      ctx.fillText(`📊 Ancien Préfix: ${data.oldPrefix}`, 100, y);
      y += 50;
    }
    if (data.globalPrefix) {
      ctx.fillText(`👑 Préfix Global: ${data.globalPrefix}`, 100, y);
      y += 50;
    }
    if (data.boxPrefix!== undefined) {
      const boxText = data.boxPrefix || 'Défaut';
      ctx.fillText(`💬 Préfix Box: ${boxText}`, 100, y);
      y += 50;
    }

    // Status en bas avec glow
    ctx.font = 'bold 36px Sans';
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillText(`${icon} ${status}`, 100, y);
    ctx.shadowBlur = 0;

    // Footer
    ctx.font = '24px Sans';
    ctx.fillStyle = '#aaaaaa';
    ctx.textAlign = 'center';
    ctx.fillText('Système Minato • Gestion Préfix v2.0', width / 2, height - 40);

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

    const fileName = `prefix_${Date.now()}.png`;
    const filePath = path.join(cachePath, fileName);

    fs.writeFileSync(filePath, imageBuffer);

    await api.sendMessage({
      body: "",
      attachment: fs.createReadStream(filePath)
    }, event.threadID);

    // Supprime après envoi
    setTimeout(() => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }, 3000);

  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  config: {
    name: "prefix",
    version: "2.1",
    author: "Ntkhang (patched by L'Uchiha Perdu & Soma Sonic)",
    countDown: 5,
    role: 0,
    description: "Gère les prefixes du bot",
    category: "config",
    guide: {
      en: `╭─⌾🥷 NAMIKAZE 🥷
│🌀| Système préfix:!
│🪵| Box chat préfix: #
│
│📌 Utilisation:
│• prefix <nouveau> → Change box
│• prefix <nouveau> -g → Change global
│• prefix reset → Réinitialise box
╰──────────⌾`
    }
  },

  langs: {
    en: {
      reset: `≪━─━─━─◈─━─━─━≫
🥷 Préfix reset ✅

Préfix box réinitialisé à: %1

Utilise maintenant chez minato: "%1help"
≪━─━─━─◈─━─━─━≫`,
      onlyAdmin: `≪━─━─━─◈─━─━─━≫
🚫 PERMISSION REFUSÉ

Seuls les admins de minato peuvent changer le préfix global.
≪━─━─━─◈─━─━─━≫`,
      confirmGlobal: `≪━─━─━─◈─━─━─━≫
⚠️ CONFIRMATION GLOBALE

Changer le préfixe GLOBAL en "%1"?

⚠️ Affecte TOUT de minato
✅ Réagis pour confirmer
⏱️ 30 secondes
≪━─━─━─◈─━─━─━≫`,
      confirmThisThread: `≪━─━─━─◈─━─━─━≫
⚠️ CONFIRMATION

Changer le prefix BOX en "%1"?

✅ Réagis pour confirmer
⏱️ 30 secondes
≪━─━─━─◈─━─━─━≫`,
      successGlobal: `≪━─━─━─◈─━─━─━≫
🌍 PRÉFIX GLOBAL MODIFIÉ

Nouveau préfix global: %1

Affecte toutes les conversations.
≪━─━─━─◈─━─━─━≫`,
      successThisThread: `≪━─━─━─◈─━─━─━≫
✅ PRÉFIX BOX MODIFIÉ

Nouveau préfix box: %1

Utilise maintenant: "%1help"
≪━─━─━─◈─━─━─━≫`,
      myPrefix: `╭─⌾🌿 NAMIKAZE 🌿
│🌀| Système préfix: %1
│🥷| Box chat préfix: %2
╰──────────⌾`
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang, api, usersData }) {
    if (!args[0]) {
      const globalPrefix = global.GoatBot.config.prefix;
      const boxPrefix = await threadsData.get(event.threadID, "data.prefix");

      const infoImage = await createPrefixImage('info', {
        globalPrefix: globalPrefix,
        boxPrefix: boxPrefix
      }, usersData);

      await message.reply(getLang("myPrefix", globalPrefix, boxPrefix || globalPrefix));

      if (infoImage) {
        await sendImage(api, event, infoImage);
      }
      return;
    }

    if (args[0] == 'reset') {
      const oldPrefix = await threadsData.get(event.threadID, "data.prefix") || global.GoatBot.config.prefix;
      await threadsData.set(event.threadID, null, "data.prefix");

      const resetImage = await createPrefixImage('reset', {
        newPrefix: global.GoatBot.config.prefix,
        oldPrefix: oldPrefix,
        type: 'Box Réinitialisé'
      }, usersData);

      await message.reply(getLang("reset", global.GoatBot.config.prefix));

      if (resetImage) {
        await sendImage(api, event, resetImage);
      }
      return;
    }

    let newPrefix;
    let setGlobal = false;

    if (args[0] === "-g" && args[1]) {
      setGlobal = true;
      newPrefix = args[1];
    } else if (args[1] === "-g") {
      setGlobal = true;
      newPrefix = args[0];
    } else {
      newPrefix = args[0];
    }

    if (setGlobal && role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal,
      threadID: event.threadID
    };

    const confirmMessage = setGlobal?
      getLang("confirmGlobal", newPrefix) :
      getLang("confirmThisThread", newPrefix);

    const confirmImage = await createPrefixImage('confirmation', {
      newPrefix: newPrefix,
      isGlobal: setGlobal,
      type: setGlobal? 'Changement Global' : 'Changement Box'
    }, usersData);

    await message.reply(confirmMessage, async (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);

      if (confirmImage) {
        await sendImage(api, event, confirmImage);
      }
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang, api, usersData }) {
    const { author, newPrefix, setGlobal, threadID } = Reaction;
    if (event.userID!== author) return;

    const oldPrefix = setGlobal?
      global.GoatBot.config.prefix :
      (await threadsData.get(threadID, "data.prefix")) || global.GoatBot.config.prefix;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));

      const successImage = await createPrefixImage('changed', {
        newPrefix: newPrefix,
        oldPrefix: oldPrefix,
        isGlobal: true,
        type: 'Changement Global'
      }, usersData);

      await message.reply(getLang("successGlobal", newPrefix));

      if (successImage) {
        await sendImage(api, event, successImage);
      }
    } else {
      await threadsData.set(threadID, newPrefix, "data.prefix");

      const successImage = await createPrefixImage('changed', {
        newPrefix: newPrefix,
        oldPrefix: oldPrefix,
        isGlobal: false,
        type: 'Changement Box'
      }, usersData);

      await message.reply(getLang("successThisThread", newPrefix));

      if (successImage) {
        await sendImage(api, event, successImage);
      }
    }
  },

  onChat: async function ({ event, message, getLang, api, usersData }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      const globalPrefix = global.GoatBot.config.prefix;
      const boxPrefix = utils.getPrefix(event.threadID);

      const infoImage = await createPrefixImage('info', {
        globalPrefix: globalPrefix,
        boxPrefix: boxPrefix
      }, usersData);

      await message.reply(getLang("myPrefix", globalPrefix, boxPrefix));

      if (infoImage) {
        await sendImage(api, event, infoImage);
      }
    }
  }
};
