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
		}
	],
	announcements: []
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
