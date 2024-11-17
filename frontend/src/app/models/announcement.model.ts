export interface IAnnouncement {
	id: string;
	priority: number;
	type: string;
	publishingDate: Date;
	isActive: boolean;
	// TODO any durumunu düzelt, olmaması gerekiyor.
	translations: Translation[] | Record<string, any>[] | any;
}

export interface Translation {
	languageld: string;
	content: string;
	redirectUrI?: string;
}
