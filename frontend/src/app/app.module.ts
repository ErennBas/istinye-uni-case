import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		MatSidenavModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatNativeDateModule,
		MatDatepickerModule,
		MatTabsModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		MatSelectModule
	],
	providers: [
		provideAnimationsAsync(),
		provideHttpClient(),
		provideNativeDateAdapter(),
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
