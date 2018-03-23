import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {ContextService} from '../../services/context.service';
import {Debt, DebtStatus} from '../../models/Debt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  debts: Debt[];

  DebtStatus = DebtStatus;

  constructor(public context: ContextService, public httpService: HttpService) {

    this.httpService.getUserDebts().subscribe({
      next: (response: any) => {
        this.debts = response;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
  }

  confirmDebt(debtId: number): void {
    this.httpService.updateDebt(debtId, 'pending').subscribe({
      next: (value: any) => {
        console.log('Pavyko patvirtinti skolą!');

        for (let debt of this.debts) {
          if (debt.id === debtId) {
            debt.status = 'pending';
            return;
          }
        }
      },
      error: (err: any) => {
        console.log(err.status);
      }
    });
  }

  returnDebt(debtId: number): void {
    this.httpService.updateDebt(debtId, 'done').subscribe({
      next: (value: any) => {
        console.log('Pavyko grąžinti skolą!');

        for (let debt of this.debts) {
          if (debt.id === debtId) {
            debt.status = 'done';
            return;
          }
        }
      },
      error: (err: any) => {
        console.log(err.status);
      }
    });
  }

  deleteDebt(debtId: number): void {
    this.httpService.deleteDebt(debtId).subscribe({
      next: (value: any) => {
        for (let i = 0; i < this.debts.length; i++) {
          if (this.debts[i].id === debtId) {
            this.debts.splice(i, 1);
          }
        }
      },
      error: (err: any) => {}
    });
  }
}
