export interface IAnnouncement {
	id: string;
	priority: number;
	type: string;
	publishingDate: Date;
	isActive: boolean;
	translations: {
		languageld: string;
		content: string;
		redirectUrI?: string;
	}
}
