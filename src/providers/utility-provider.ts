import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { CheckinProvider } from './checkin-provider'
import { StudentProvider } from './student-provider'

/*
  Generated class for the UtilityProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilityProvider {

  constructor(public http: Http, public checkinService: CheckinProvider, public studentService: StudentProvider) {
    console.log('Hello UtilityProvider Provider');
  }

  resetToday(){
      this.studentService.checkoutAllStudents();
      this.checkinService.clearTransactionsForDate(null);
  }

}
