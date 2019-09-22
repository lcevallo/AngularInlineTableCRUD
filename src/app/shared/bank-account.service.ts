import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  constructor(private http: HttpClient) { }

  postBankAccount(formData) {
    return this.http.post(environment.apiBaseURI + '/bank_account', formData);
  }

  putBankAccount(formData) {
    return this.http.put(environment.apiBaseURI + '/bank_account/' + formData.bankAccountId, formData);
  }

  deleteBankAccount(id) {
    return this.http.delete(environment.apiBaseURI + '/bank_account/' + id);
  }


  getBankAccountList() {
   return  this.http.get(environment.apiBaseURI + '/bank_account');
  }
}
