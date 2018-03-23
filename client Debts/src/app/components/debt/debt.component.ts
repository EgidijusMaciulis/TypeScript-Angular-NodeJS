import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {HttpService} from '../../services/http.service';
import {User} from '../../models/User';
import {Debt} from '../../models/Debt';
import {ContextService} from '../../services/context.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-debt',
  templateUrl: './debt.component.html'
})
export class DebtComponent implements OnInit {
  valueInput: FormControl;
  debtorInput: FormControl;
  lenderInput: FormControl;

  possibleLenders: User[];
  possibleDebtors: User[];

  debt: Debt;

  constructor(public httpService: HttpService,
              public context: ContextService,
              public router: Router,
              public route: ActivatedRoute) {
    this.possibleLenders = [];
    this.possibleDebtors = [];
    this.debt = new Debt();

    this.route.params.subscribe({
      next: (params: any) => {
        if (params['id']) {
          console.log('Updating debt with ID ' + params['id']);
        }
      }
    });

    this.valueInput = new FormControl(10,
      [Validators.required, Validators.min(1)]);

    this.debtorInput = new FormControl('', [Validators.required]);
    this.lenderInput = new FormControl('', [Validators.required]);

    this.lenderInput.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value: any) => {
        this.httpService.searchUsers(this.lenderInput.value).subscribe({
          next: (userList: any) => {
            this.possibleLenders = userList;
          },
          error: (err: any) => {
          }
        });
      }
    });

    this.debtorInput.valueChanges.pipe(debounceTime(300)).subscribe({
      next: (value: any) => {
        this.httpService.searchUsers(this.debtorInput.value).subscribe({
          next: (userList: any) => {
            this.possibleDebtors = userList;
          },
          error: (err: any) => {
          }
        });
      }
    });
  }

  addLender(lender: User): void {
    this.debt.lender = lender.id;
    this.possibleLenders = [];
    this.lenderInput.setValue(lender.name, {
      emitEvent: false
    });
  }

  addDebtor(debtor: User): void {
    this.debt.debtor = debtor.id;
    this.possibleDebtors = [];
    this.debtorInput.setValue(debtor.name, {
      emitEvent: false
    });
  }

  ngOnInit() {
  }

  canSave(): boolean {
    if (this.debt.lender &&
      this.debt.debtor &&
      this.valueInput.value &&
      (this.debt.debtor === this.context.user.id || this.debt.lender === this.context.user.id) &&
      this.debt.debtor !== this.debt.lender) {
      return true;
    }

    return false;
  }

  addDebt(): void {
    if (this.canSave()) {
      this.debt.amount = this.valueInput.value;
      this.debt.dueDate = '2018-03-31';

      this.httpService.addDebt(this.debt).subscribe({
        next: (value: any) => {
          console.log('Pavyko pridėti skolą.');
          this.router.navigate(['dashboard']);
        },
        error: (err: any) => {
          console.log('Įvyko klaida pridedant skolą.');
        }
      });
    }
  }

}
