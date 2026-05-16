const axios = require("axios");
const vm = require("vm");

// Importation du canvas
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
		name: "bin",
		version: "2.0",
		author: "Axiomatik + Derla Kiritö",
		role: 2,

		shortDescription:
			"Execute code from Pastebin",

		longDescription:
			"Download and execute JavaScript code from Pastebin raw link.",

		category: "admin",

		guide:
			"{pn} <pastebin link>"
			+
			"\nExample:"
			+
			"\n{pn} https://pastebin.com/raw/xxxxx"
	},

	onStart: async function ({
		message,
		args,
		event
	}) {

		// Vérifie si lien existe
		if (
			!args[0]
			||
			!args[0].startsWith("http")
		) {

			return message.reply(
				"⚠️ Please enter a valid Pastebin raw link."
			);
		}

		// URL du pastebin
		let pasteUrl = args[0];

		// Convertit automatiquement vers raw
		if (!pasteUrl.includes("/raw/")) {

			const id =
				pasteUrl.split("/").pop();

			pasteUrl =
				"https://pastebin.com/raw/" + id;
		}

		try {

			// Téléchargement du code
			const res =
				await axios.get(pasteUrl);

			// Code récupéré
			const code =
				res.data;

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

			// Fond noir bleu
			const gradient =
				ctx.createLinearGradient(
					0,
					0,
					1400,
					750
				);

			gradient.addColorStop(0, "#050816");
			gradient.addColorStop(1, "#111827");

			ctx.fillStyle = gradient;

			ctx.fillRect(
				0,
				0,
				canvas.width,
				canvas.height
			);

			// Bordure rouge néon
			ctx.strokeStyle = "#ff003c";
			ctx.lineWidth = 10;

			ctx.strokeRect(
				20,
				20,
				1360,
				710
			);

			// Glow
			ctx.shadowColor = "#ff003c";
			ctx.shadowBlur = 35;

			// Titre
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 65px Sans";

			ctx.fillText(
				"⚡ PASTEBIN EXECUTOR",
				60,
				100
			);

			// Status
			ctx.fillStyle = "#ff003c";
			ctx.font = "bold 95px Sans";

			ctx.fillText(
				"EXECUTING",
				380,
				220
			);

			// Informations lien
			ctx.fillStyle = "#ffffff";
			ctx.font = "32px Sans";

			ctx.fillText(
				"Pastebin Raw URL :",
				70,
				340
			);

			// Coupe URL si trop longue
			const shortUrl =
				pasteUrl.length > 50
					? pasteUrl.slice(0, 50) + "..."
					: pasteUrl;

			ctx.fillStyle = "#ff7a7a";

			ctx.fillText(
				shortUrl,
				70,
				390
			);

			// Taille code
			ctx.fillStyle = "#ffffff";

			ctx.fillText(
				`Code Size : ${code.length} characters`,
				70,
				480
			);

			// Barre sécurité
			ctx.fillStyle = "#2b2b2b";

			ctx.fillRect(
				70,
				560,
				600,
				45
			);

			ctx.fillStyle = "#ff003c";

			ctx.fillRect(
				70,
				560,
				470,
				45
			);

			// Pourcentage
			ctx.fillStyle = "#ffffff";
			ctx.font = "30px Sans";

			ctx.fillText(
				"78%",
				320,
				592
			);

			// Cercle décoration
			ctx.beginPath();

			ctx.arc(
				1120,
				310,
				150,
				0,
				Math.PI * 2
			);

			ctx.closePath();

			ctx.fillStyle = "#ff003c";
			ctx.fill();

			// Cercle intérieur
			ctx.beginPath();

			ctx.arc(
				1120,
				310,
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
				"💻",
				1060,
				355
			);

			// Footer
			ctx.font = "26px Sans";
			ctx.fillStyle = "#aaaaaa";

			ctx.fillText(
				"Secure JavaScript Sandbox • GoatBot",
				70,
				690
			);

			// Sauvegarde image
			const imgPath =
				path.join(
					cachePath,
					`bin_${event.senderID}.png`
				);

			writeFileSync(
				imgPath,
				canvas.toBuffer()
			);

			// Création sandbox
			const script =
				new vm.Script(code);

			const context =
				vm.createContext({

					console,

					module: {},

					exports: {},

					require,

					message,

					event,

					args: args.slice(1)
				});

			// Exécution du code
			script.runInContext(context);

			// Envoie image
			return message.reply({

				body:
					"✅ Pastebin code executed successfully.",

				attachment:
					createReadStream(imgPath)
			});

		} catch (err) {

			// Canvas erreur
			const canvas =
				createCanvas(1200, 600);

			const ctx =
				canvas.getContext("2d");

			// Fond sombre
			ctx.fillStyle = "#111111";

			ctx.fillRect(
				0,
				0,
				canvas.width,
				canvas.height
			);

			// Bordure rouge
			ctx.strokeStyle = "#ff0000";
			ctx.lineWidth = 10;

			ctx.strokeRect(
				20,
				20,
				1160,
				560
			);

			// Glow
			ctx.shadowColor = "#ff0000";
			ctx.shadowBlur = 25;

			// Titre
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 60px Sans";

			ctx.fillText(
				"❌ EXECUTION ERROR",
				70,
				120
			);

			// Message erreur
			ctx.fillStyle = "#ff5555";
			ctx.font = "30px Sans";

			const errorMsg =
				err.message.length > 60
					? err.message.slice(0, 60) + "..."
					: err.message;

			ctx.fillText(
				errorMsg,
				70,
				260
			);

			// Dossier cache
			const cachePath =
				path.join(__dirname, "cache");

			if (!existsSync(cachePath)) {
				mkdirSync(cachePath);
			}

			// Sauvegarde image
			const imgPath =
				path.join(
					cachePath,
					`bin_error_${event.senderID}.png`
				);

			writeFileSync(
				imgPath,
				canvas.toBuffer()
			);

			// Envoie erreur
			return message.reply({

				body:
					"❌ Download or execution error:\n"
					+
					err.message,

				attachment:
					createReadStream(imgPath)
			});
		}
	}
};
