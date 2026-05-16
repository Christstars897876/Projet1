module.exports = {
	// Vous pouvez personnaliser la langue ici ou directement dans les fichiers de commandes
	autoUpdateThreadInfo: {},
	checkwarn: {
		text: {
			warn: "Le membre %1 a déjà reçu 3 avertissements et a été banni du groupe\n- Nom : %1\n- Uid : %2\n- Pour débannir, veuillez utiliser la commande \"%3warn unban <uid>\" (où uid est l'identifiant de la personne à débannir)",
			needPermission: "Le bot a besoin des droits d'administrateur pour exclure les membres bannis"
		}
	},
	leave: {
		text: {
			session1: "matin",
			session2: "midi",
			session3: "après-midi",
			session4: "soir",
			leaveType1: "a quitté le groupe",
			leaveType2: "a été expulsé du groupe"
		}
	},
	logsbot: {
		text: {
			title: "====== Logs du bot ======",
			added: "\n✅\nÉvénement : le bot a été ajouté à un nouveau groupe\n- Ajouté par : %1",
			kicked: "\n❌\nÉvénement : le bot a été expulsé\n- Expulsé par : %1",
			footer: "\n- ID Utilisateur : %1\n- Groupe : %2\n- ID Groupe : %3\n- Heure : %4"
		}
	},
	onEvent: {},
	welcome: {
		text: {
			session1: "matin",
			session2: "midi",
			session3: "après-midi",
			session4: "soir",
			welcomeMessage: "Merci de m'avoir invité dans le groupe !\nPréfixe du bot : %1\nPour voir la liste des commandes, saisissez : %1help",
			multiple1: "toi",
			multiple2: "vous tous"
		}
	}
};
