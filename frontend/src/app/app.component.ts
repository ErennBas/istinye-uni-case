import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDrawerContainer } from '@angular/material/sidenav';

import { AnnouncementService } from '@services/announcement.service';
import { LanguageService } from '@services/language.service';
import { ILanguage } from '@models/language.model';
import { IAnnouncement, Translation } from '@models/announcement.model';

import Swal from 'sweetalert2';

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
					Swal.fire("Saved!", "", "success");
					this.announcements.push(res);
					this.onCancel();
				}, err => {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "Something went wrong!",
					});
				});
			}
			else {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Content is required",
				});
			}
		}
		else {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Required fields cannot be left blank",
			});
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
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Error loaing announcements",
			});
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
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Error loaing languages",
			});
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
		Swal.fire({
			title: "Do you want to delete this announcement?",
			showDenyButton: true,
			showCancelButton: true,
			confirmButtonText: "Delete",
		}).then((result) => {
			if (result.isConfirmed) {
				this.announcementService.delete(announcement.id).subscribe(res => {
					this.announcements.splice(this.announcements.findIndex(a => a.id === announcement.id), 1);
					Swal.fire("Saved!", "", "success");
				});
			}
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
			Swal.fire("Saved!", "", "success");
			this.getAnnouncements();
			this.editSidebar.close();
		}, err => {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Something went wrong!",
			});
		});
	}
}
