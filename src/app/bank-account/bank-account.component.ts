import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BankService} from '../shared/bank.service';
import {BankAccountService} from '../shared/bank-account.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit {

  bankAccountForms: FormArray = this.fb.array([]);
  bankList = [];
  notification = null;

  constructor(private fb: FormBuilder,
              private bankService: BankService,
              private bankAccountService: BankAccountService) { }

  ngOnInit() {
     this.bankService.getBankList().subscribe(res => this.bankList = res as []);

     this.bankAccountService.getBankAccountList().subscribe(
       res => {
         if ( res === []) {
           this.addBankAccountForm();
         } else {
            console.log(res['content']);
            console.log(res['pageable']);
            //generate form array as per data received from BankAccount table
           (res['content'] as []).forEach(
             (bankAccount: any) => {
               this.bankAccountForms.push(this.fb.group({
                   bankAccountId : [bankAccount.bankAccountId],
                   accountNumber : [bankAccount.accountNumber, Validators.required],
                   accountHolder : [bankAccount.accountHolder, Validators.required],
                   bankId : [bankAccount.bankId, Validators.min(1)],
                   ifsc : [bankAccount.ifsc, Validators.required]
                 }
                 )
               );
             }
           );
         }
       }

     );
  }

  addBankAccountForm() {
    this.bankAccountForms.push(this.fb.group({
                                                         bankAccountId : [0],
                                                         accountNumber : ['', Validators.required],
                                                         accountHolder : ['', Validators.required],
                                                         bankId : [0, Validators.min(1)],
                                                         ifsc : ['', Validators.required]
                                                         }
                                            )

                              );
  }

  recordSubmit(fg: FormGroup ) {
    if (fg.value.bankAccountId === 0) {
      this.bankAccountService.postBankAccount(fg.value)
      .subscribe(
        (res: any) => {
                            fg.patchValue( {bankAccountId : res.bankAccountId});
                            this.showNotification('insert');
                          }
      );
    } else {
      this.bankAccountService.putBankAccount(fg.value)
      .subscribe(
        (res: any) => {
          this.showNotification('update');
        }
      );
    }

  }

  onDelete(bankAccountId, i) {
    if (bankAccountId === 0) {
      this.bankAccountForms.removeAt(i);
    } else if (confirm('Are you sure to delete this record ? ')) {

      this.bankAccountService.deleteBankAccount(bankAccountId).subscribe(
         res => {
                      this.bankAccountForms.removeAt(i);
                      this.showNotification('delete');
                     }
        );
    }
  }


  showNotification(category) {
    switch (category) {
      case 'insert':
         this.notification = {class: 'text-success', message: 'saved!'};
         break;
      case 'update':
        this.notification = {class: 'text-primary', message: 'updated!'};
        break;
      case 'delete':
        this.notification = {class: 'text-danger', message: 'deleted!'};
        break;
      default:
        break;
    }
    setTimeout(() => { this.notification = null;},3000);
  }
}
