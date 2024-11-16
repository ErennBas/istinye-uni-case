import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@src/environments/environment';
import { IAnnouncement } from '@models/announcement.model';

@Injectable({
	providedIn: 'root'
})
export class AnnouncementService {
	private readonly apiUrl = `${environment.apiBaseUrl}/announcements`;

	constructor(private http: HttpClient) { }

	/**
	 * Gets all announcements
	 * @returns Observable<IAnnouncement[]>
	 */
	find(): Observable<IAnnouncement[]> {
		return this.http.get<IAnnouncement[]>(this.apiUrl);
	}

	/**
	 * Retriewes an announcement by id
	 * @param id Announcement Id
	 * @returns Observable<IAnnouncement>
	 */
	findById(id: string): Observable<IAnnouncement> {
		return this.http.get<IAnnouncement>(`${this.apiUrl}/${id}`);
	}

	/**
	 * Creates a new announcement
	 * @param announcement Announcement Object
	 * @returns Observable<IAnnouncement>
	 */
	create(announcement: IAnnouncement): Observable<IAnnouncement> {
		return this.http.post<IAnnouncement>(this.apiUrl, announcement);
	}

	/**
	 * Updates announcement
	 * @param id Announcement Id
	 * @param announcement Updated Announcement Object
	 * @returns Observable<IAnnouncement>
	 */
	update(id: string, announcement: IAnnouncement): Observable<IAnnouncement> {
		return this.http.put<IAnnouncement>(`${this.apiUrl}/${id}`, announcement);
	}

	/**
	 * Deletes announcement
	 * @param id Announcement Id
	 * @returns Observable<void>
	 */
	delete(id: string): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}
