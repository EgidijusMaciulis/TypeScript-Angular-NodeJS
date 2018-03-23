import { Component, OnInit } from '@angular/core';
import {User} from '../../models/User';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {HttpService} from '../../services/http.service';
import {Friend} from '../../models/Friend';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
})
export class FriendsComponent implements OnInit {
  possibleFriends: User[];
  friendInput: FormControl;
  friends: Friend[];

  constructor(public httpService: HttpService) {
    this.friendInput = new FormControl();
    this.possibleFriends = [];
    this.friends = [];

    this.friendInput.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value: any) => {
        this.httpService.searchUsers(this.friendInput.value).subscribe({
          next: (userList: any) => {
            this.possibleFriends = userList;
          },
          error: (err: any) => {
          }
        });
      }
    });
  }

  ngOnInit() {
  }

  addFriend(userId: number): void {
    this.httpService.addFriend(userId).subscribe({
      next: (res: any) => {
        console.log('Pavyko pridėti draugą', res);
        this.friends.push(res);
        console.log(this.friends);
      },
      error: (err: any) => {
        console.log('Pridedant draugą įvyko klaida!');
      }
    });
  }
}
