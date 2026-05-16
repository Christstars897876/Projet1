const axios = require('axios');
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
  config: {
    name: "demo",
    aliases: ["dm"],
    version: "1.0",
    author: "Mariancross",
    countDown: 5,
    role: 2,
    shortDescription: "Générateur d'images via l'API Demonic",
    longDescription: "Génère des images en utilisant l'API Demonic avec un prompt et un format personnalisé.",
    category: "ai",
    guide: {
      fr: "{pn} <prompt> --size <format>"
    }
  },

  onStart: async function ({ message, args }) {
    const waitingMessages = [
      "🎨 Création de votre image en cours...",
      "🖌️ Application des effets visuels...",
      "🌈 Chargement des couleurs et des textures...",
      "🔮 Interrogation de l'API Demonic...",
      "🚀 Lancement de la génération d'image..."
    ];

    const randomWaitingMessage = waitingMessages[Math.floor(Math.random() * waitingMessages.length)];
    await message.reply(randomWaitingMessage);

    let prompt = args.join(" ");
    let size = "2:3"; // Format par défaut

    // Extraction du format si fourni
    const sizeIndex = args.indexOf("--size");
    if (sizeIndex !== -1 && args[sizeIndex + 1]) {
      size = args[sizeIndex + 1];
      // Suppression de --size et de sa valeur du prompt
      args.splice(sizeIndex, 2);
      prompt = args.join(" ");
    }

    try {
      const apiUrl = `https://www.samirxpikachu.run.place/demonic?prompt=${encodeURIComponent(prompt)}&size=${size}`;
      const imageStream = await global.utils.getStreamFromURL(apiUrl);

      if (!imageStream) {
        return message.reply("❌ Oups ! L'image n'a pas pu être générée. Pour le support, contactez https://m.me/mariancrosss ❤️");
      }
      
      return message.reply({
        body: '✨ Voici votre image générée ! 🖼️',
        attachment: imageStream
      });
    } catch (error) {
      console.error(error);
      return message.reply("💔 Oh non ! Quelque chose s'est mal passé.");
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
