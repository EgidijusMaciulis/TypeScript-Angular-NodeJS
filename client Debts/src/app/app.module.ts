import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NotesComponent } from './components/notes/notes.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import {HttpService} from './services/http.service';
import {HttpClientModule} from '@angular/common/http';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ContextService} from './services/context.service';
import {ActivatorService} from './services/activator.service';
import { RegisterComponent } from './components/register/register.component';
import {routes} from './app.routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DebtComponent } from './components/debt/debt.component';
import { FriendsComponent } from './components/friends/friends.component';

@NgModule({
  declarations: [
    AppComponent,
    NotesComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    NavbarComponent,
    DebtComponent,
    FriendsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [HttpService, HttpClientModule, ContextService, ActivatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
