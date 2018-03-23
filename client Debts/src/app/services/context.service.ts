import { Injectable } from '@angular/core';
import {User} from '../models/User';

@Injectable()
export class ContextService {
  private _user: User;

  get user(): User {
    return this._user;
  }

  set user(value: User) {
    localStorage.setItem('user', JSON.stringify(value));
    this._user = value;
  }

  constructor() {
    let user = localStorage.getItem('user');

    if (user)
      this._user = JSON.parse(user);
  }
}
