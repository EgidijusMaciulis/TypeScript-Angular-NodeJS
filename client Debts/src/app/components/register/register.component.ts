import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  nameInputControl: FormControl;
  emailInputControl: FormControl;
  passwordInputControl: FormControl;
  registerError: number;

  constructor(public http: HttpService, public router: Router) {
    this.nameInputControl = new FormControl('',
      [Validators.minLength(5), Validators.required]);

    this.emailInputControl = new FormControl('',
      [Validators.required, Validators.email]);

    this.passwordInputControl = new FormControl('',
      [Validators.required, Validators.minLength(5)]);
  }

  ngOnInit() {
  }

  register(): void {
    console.log(this.nameInputControl.getError('minlength'));
    if (this.passwordInputControl.valid &&
      this.emailInputControl.valid &&
      this.nameInputControl.valid) {

        let body = {
          email: this.emailInputControl.value,
          password: this.passwordInputControl.value,
          name: this.nameInputControl.value
        }

        this.http.postUser(body).subscribe({
          next: (value: any) => {
            this.router.navigate(['login']);
          },
          error: (err: any) => {
            this.registerError = err.status;
          }
        });
    }
  }

}
