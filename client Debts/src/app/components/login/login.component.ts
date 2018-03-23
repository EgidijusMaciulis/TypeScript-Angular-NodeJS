import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ContextService} from '../../services/context.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  emailValue: string;
  passwordValue: string;
  error: string;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(public httpService: HttpService, public context: ContextService, public router: Router) {
    this.emailValue = 'user@example.com';
    this.passwordValue = '';
  }

  login(): void {
    this.error = '';
    // Validuojame duomenis
    if (!this.emailRegex.exec(this.emailValue)) {
      this.error = 'Blogas el. pašto adresas';
      return;
    }

    if (this.passwordValue.length <= 5) {
      this.error = 'Slaptažodis per trumpas';
      return;
    }

    // Darome užklausą
    this.httpService.login(this.emailValue, this.passwordValue).subscribe({
      next: (response: any) => {
        console.log('Pavyko prisijungti');
        console.log(response);
        this.context.user = response;
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.log('Nepavyko prisijungti', err);

        switch (err.status) {
          case 500:
            this.error = 'Serverio klaida';
            break;
          case 401:
            this.error = 'Blogas el. paštas arba slaptažodis';
            break;
          case 400:
            this.error = 'Nenurodytas el. paštas arba slaptažodis';
            break;
          default:
            this.error = 'Įvyko klaida!';
            break;
        }
      }
    });
  }

  ngOnInit() {
  }

}
