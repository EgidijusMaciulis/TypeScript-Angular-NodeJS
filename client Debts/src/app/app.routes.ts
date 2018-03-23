import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ActivatorService} from './services/activator.service';
import {LoginComponent} from './components/login/login.component';
import {Routes} from '@angular/router';
import {NotesComponent} from './components/notes/notes.component';
import {RegisterComponent} from './components/register/register.component';
import {DebtComponent} from './components/debt/debt.component';
import {FriendsComponent} from './components/friends/friends.component';

export const routes: Routes = [
  {path: 'notes', component: NotesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [ActivatorService]},
  {path: 'debt', component: DebtComponent, canActivate: [ActivatorService]},
  {path: 'friends', component: FriendsComponent, canActivate: [ActivatorService]},
  {path: 'debt/:id', component: DebtComponent, canActivate: [ActivatorService]},
  {path: '**', component: DashboardComponent}
];
