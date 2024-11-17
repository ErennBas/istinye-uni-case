const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

let data = {
	languages: [
		{
			id: '2bf97f90-d5ee-493b-9120-e49a276fec7a',
			name: 'Türkçe',
			isoCode: 'tr'
		},
		{
			id: 'b599eec6-fe7a-489f-88b3-54cb74b231ed',
			name: 'English',
			isoCode: 'en'
		},
		{
			id: 'fa7921ef-6592-44f0-aea8-d7a9bc3803b2',
			name: 'Deutsch',
			isoCode: 'de'
		},
		{
			id: 'ad1b621e-d9b2-4b57-9807-cd634ae80c4f',
			name: 'Français',
			isoCode: 'fr'
		},
	],
	announcements: [
		{
			id: "2bf97f90-d5ee-493b-9120-e49a276fec7a",
			priority: 1,
			type: "Maintenance",
			publishingDate: new Date(),
			isActive: true,
			translations: [
				{
					languageld: "2bf97f90-d5ee-493b-9120-e49a276fec7a",
					content: "Sistem bakımda olacak, lütfen bekleyiniz.",
					redirectUrI: "https://example.com/maintenance"
				},
				{
					languageld: "b599eec6-fe7a-489f-88b3-54cb74b231ed",
					content: "The system will be under maintenance, please wait.",
					redirectUrI: "https://example.com/maintenance"
				}
			]
		},
		{
			id: "b599eec6-fe7a-489f-88b3-54cb74b231ed",
			priority: 2,
			type: "New Feature",
			publishingDate: new Date(),
			isActive: true,
			translations: [
				{
					languageld: "b599eec6-fe7a-489f-88b3-54cb74b231ed",
					content: "We have introduced a new feature! Check it out.",
					redirectUrI: "https://example.com/new-feature"
				},
				{
					languageld: "fa7921ef-6592-44f0-aea8-d7a9bc3803b2",
					content: "Wir haben eine neue Funktion eingeführt! Schau es dir an.",
					redirectUrI: "https://example.com/new-feature"
				}
			]
		},
		{
			id: "fa7921ef-6592-44f0-aea8-d7a9bc3803b2",
			priority: 3,
			type: "Update",
			publishingDate: new Date(),
			isActive: false,
			translations: [
				{
					languageld: "fa7921ef-6592-44f0-aea8-d7a9bc3803b2",
					content: "Es gibt ein neues Update für die App.",
					redirectUrI: "https://example.com/update"
				},
				{
					languageld: "ad1b621e-d9b2-4b57-9807-cd634ae80c4f",
					content: "Il y a une nouvelle mise à jour pour l'application.",
					redirectUrI: "https://example.com/update"
				}
			]
		},
		{
			id: "ad1b621e-d9b2-4b57-9807-cd634ae80c4f",
			priority: 1,
			type: "Security Alert",
			publishingDate: new Date(),
			isActive: true,
			translations: [
				{
					languageld: "ad1b621e-d9b2-4b57-9807-cd634ae80c4f",
					content: "Alerte de sécurité: Veuillez changer votre mot de passe.",
					redirectUrI: "https://example.com/security"
				},
				{
					languageld: "2bf97f90-d5ee-493b-9120-e49a276fec7a",
					content: "Güvenlik uyarısı: Lütfen şifrenizi değiştirin.",
					redirectUrI: "https://example.com/security"
				}
			]
		},
		{
			id: "2bf97f90-d5ee-493b-9120-e49a276fec7a",
			priority: 2,
			type: "Holiday Notice",
			publishingDate: new Date(),
			isActive: true,
			translations: [
				{
					languageld: "2bf97f90-d5ee-493b-9120-e49a276fec7a",
					content: "Tatil duyurusu: Ofisimiz 1 hafta kapalı olacak.",
					redirectUrI: "https://example.com/holiday"
				},
				{
					languageld: "fa7921ef-6592-44f0-aea8-d7a9bc3803b2",
					content: "Urlaubsankündigung: Unser Büro wird eine Woche geschlossen sein.",
					redirectUrI: "https://example.com/holiday"
				},
				{
					languageld: "b599eec6-fe7a-489f-88b3-54cb74b231ed",
					content: "Holiday notice: Our office will be closed for 1 week.",
					redirectUrI: "https://example.com/holiday"
				}
			]
		},
	]
};


// languages
app.get('/languages', (req, res) => {
	res.status(200).json(data.languages);
});


// announcements
app.get('/announcements', (req, res) => {
	res.status(200).json(data.announcements);
});

app.post('/announcements', (req, res) => {
	const { priority, type, publishingDate, isActive, translations } = req.body;

	console.log(priority, type, publishingDate, isActive, translations);

	if (!priority || !type || !publishingDate || typeof isActive !== 'boolean' || !translations || !Array.isArray(translations)) {
		return res.status(400).json({ message: 'Required fields cannot be left blank.' });
	}

	const newAnnouncement = {
		id: uuidv4(),
		priority,
		type,
		publishingDate: new Date(publishingDate),
		isActive,
		translations
	};

	data.announcements.push(newAnnouncement);
	res.status(201).json(newAnnouncement);
});

app.put('/announcements/:id', (req, res) => {
	const { id } = req.params;
	const { priority, type, publishingDate, isActive, translations } = req.body;

	const announcement = data.announcements.find(ann => ann.id === id);

	if (!announcement) {
		return res.status(404).json({ message: 'Announcement not found.' });
	}

	if (priority !== undefined) announcement.priority = priority;
	if (type) announcement.type = type;
	if (publishingDate) announcement.publishingDate = publishingDate;
	if (isActive !== undefined) announcement.isActive = isActive;
	if (translations) announcement.translations = translations;

	res.status(200).json(announcement);
});

app.delete('/announcements/:id', (req, res) => {
	const { id } = req.params;

	const announcementIndex = data.announcements.findIndex(a => a.id === id);

	if (announcementIndex === -1) {
		return res.status(404).json({ message: 'Announcement not found.' });
	}

	data.announcements.splice(announcementIndex, 1);
	res.status(200).json({ message: `Announcement with ID ${id} has been deleted.` });
});


app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
