import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { TfgComponentsModule } from 'tfg-components';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { JobsModule } from './jobs/jobs.module';
import { MessagesModule } from './messages/messages.module';
import { SurveysModule } from './surveys/surveys.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JobsService } from './jobs/job.service';
import { SurveysService } from './surveys/survey.service';
import { SettingsModule } from './settings/settings.module';
import { MessagesService } from './messages/message.service';
import { GoogleChartsModule } from 'angular-google-charts';
import { HttpConfigInterceptor } from './http-intercept.service';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SettingsModule,
    TfgComponentsModule,
    DashboardModule,
    JobsModule,
    MessagesModule,
    SurveysModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    JobsService,
    SurveysService,
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

