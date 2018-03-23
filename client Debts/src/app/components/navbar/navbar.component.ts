import {Component, OnInit} from '@angular/core';
import {ContextService} from '../../services/context.service';
import {Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  constructor(public context: ContextService, public router: Router) {
  }

  ngOnInit() {
  }

  logout(): void {
    this.router.navigate(['login']).then((value: any) => {
      this.context.user = null;
    }).catch((err: any) => {
      console.log(err);
    });
  }
}
