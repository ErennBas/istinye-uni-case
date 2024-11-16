import { Component, OnInit } from '@angular/core';

import { AnnouncementService } from '@services/announcement.service';
import { LanguageService } from '@services/language.service';
import { ILanguage } from '@models/language.model';
import { IAnnouncement } from '@models/announcement.model';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
	languages: ILanguage[] = [];
	announcements: IAnnouncement[] = [];
	title = 'frontend';
	showFiller = false;

	constructor(private announcementService: AnnouncementService, private languageService: LanguageService) {

	}

	ngOnInit(): void {
		this.getLanguages();
		this.getAnnouncements();
	}

	getAnnouncements(): void {
		this.announcementService.find().subscribe(res => {
			this.announcements = res;
		}, err => {
			// TODO sweetalert gibi bir şey ekle
			console.error("Error loaing languages", err)
		});
	}

	getLanguages(): void {
		this.languageService.find().subscribe(res => {
			this.languages = res;
		}, err => {
			// TODO sweetalert gibi bir şey ekle
			console.error("Error loaing languages", err)
		});
	}
}
