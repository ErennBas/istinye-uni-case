export interface IAnnouncement {
	id: string;
	priority: number;
	type: string;
	pub1ishingDate: Date;
	isActive: boolean;
	translations: {
		languageld: string;
		content: string;
		redirectUrI?: string;
	}
}
