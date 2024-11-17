import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDrawerContainer } from '@angular/material/sidenav';

import { AnnouncementService } from '@services/announcement.service';
import { LanguageService } from '@services/language.service';
import { ILanguage } from '@models/language.model';
import { IAnnouncement, Translation } from '@models/announcement.model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	@ViewChild("editSidebar") editSidebar!: MatDrawerContainer;
	@ViewChild("addSidebar") addSidebar!: MatDrawerContainer;

	languages: ILanguage[] = [];
	announcements: IAnnouncement[] = [];

	selectedAnnouncement?: IAnnouncement;
	announcementForm = new FormGroup({
		priority: new FormControl(Validators.required),
		type: new FormControl(Validators.required),
		isActive: new FormControl(Validators.required),
		publishingDate: new FormControl(Validators.required)
	});
	announcement: Omit<IAnnouncement, 'id'> = {
		priority: 1,
		type: 'primary',
		isActive: true,
		publishingDate: new Date(),
		translations: []
	};

	today = new Date();

	constructor(private announcementService: AnnouncementService, private languageService: LanguageService, private fb: FormBuilder) {
		this.getLanguages();
		this.getAnnouncements();
	}

	onSubmit(): void {
		if (this.announcementForm.valid) {
			let status = false;

			this.announcement.translations.forEach((an: Translation) => {
				if (an.content) {
					status = true;
				}
			});
			if (status) {
				const announcement: any = { ...this.announcement, ...this.announcementForm.value };
				this.announcementService.create(announcement).subscribe(res => {
					this.announcements.push(res);
				}, err => {
					console.error(err);
				});
			}
			else {
				// TODO form error ekle
				alert("Content is required");
			}
		}
		else {
			// TODO form error ekle
			alert("Required fields cannot be left blank");
		}
	}

	onCancel(): void {
		this.announcementForm.reset();
		this.addSidebar.close();
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
			this.languages.forEach(el => {
				this.announcement.translations.push({
					languageld: el.id,
					content: '',
					redirectUrl: ''
				});
			});
		}, err => {
			// TODO sweetalert gibi bir şey ekle
			console.error("Error loaing languages", err)
		});
	}

	openAddSidebar() {
		this.addSidebar.open();
	}

	openEditSidebar(announcement: IAnnouncement) {
		this.selectedAnnouncement = { ...announcement };
		this.editSidebar.open();
	}

	deleteAnnouncement(announcement: IAnnouncement) {
		// TODO Planlı yavaşlatma ekle
		this.announcementService.delete(announcement.id).subscribe(res => {
			this.announcements.splice(this.announcements.findIndex(a => a.id === announcement.id), 1);
		});
	}

	getTranslationContent(langId: string): string {
		const translation = this.selectedAnnouncement?.translations.find(
			(e: any) => e.languageld === langId
		);
		return translation ? translation.content : '';
	}

	getTranslationRedirectUrl(langId: string): string {
		const translation = this.selectedAnnouncement?.translations.find(
			(e: any) => e.languageld === langId
		);
		return translation ? translation.redirectUrI || '' : '';
	}

	updateTranslationContent(langId: string, newContent: string): void {
		let translation = this.selectedAnnouncement?.translations.find(
			(e: any) => e.languageld === langId
		);
		if (translation) {
			translation.content = newContent;
		} else {
			this.selectedAnnouncement?.translations.push({ languageld: langId, content: newContent });
		}
	}

	updateTranslationRedirectUrl(langId: string, newUrl: string): void {
		let translation = this.selectedAnnouncement?.translations.find(
			(e: any) => e.languageld === langId
		);
		if (translation) {
			translation.redirectUrI = newUrl;
		} else {
			this.selectedAnnouncement?.translations.push({ languageld: langId, content: '', redirectUrI: newUrl });
		}
	}

	updateAnnouncement() {
		this.announcementService.update(this.selectedAnnouncement!.id, this.selectedAnnouncement!).subscribe(res => {
			this.getAnnouncements();
			this.editSidebar.close();
		}, err => {
			console.error(err)
		});
	}
}
