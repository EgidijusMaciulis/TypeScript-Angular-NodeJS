import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ContextService} from './context.service';

@Injectable()
export class ActivatorService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.context.user)
      return true;
    else {
      this.router.navigate(['login']);
      return false;
    }
  }

  constructor(public context: ContextService, public router: Router) { }
}
