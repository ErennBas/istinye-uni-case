import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@src/environments/environment';
import { ILanguage } from '@models/language.model';

@Injectable({
	providedIn: 'root'
})
export class LanguageService {
	private readonly apiUrl = `${environment.apiBaseUrl}/languages`;

	constructor(private http: HttpClient) { }

	/**
	 * Gets languages.
	 * @returns Observable<ILanguage[]> All languages.
	 */
	find(): Observable<ILanguage[]> {
		return this.http.get<ILanguage[]>(this.apiUrl);
	}
}
