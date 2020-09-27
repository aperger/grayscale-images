import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        // AppRoutingModule, -> Need if we use routing... later
        BrowserAnimationsModule,

        // FormsModule, -> nedd if we use ngModel
        ReactiveFormsModule,
        MatToolbarModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
