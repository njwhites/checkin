import {Component} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from '../../providers/checkin-provider';
import {UserProvider} from '../../providers/user-provider';


@Component({
  selector: 'page-driver',
  templateUrl: 'driver.html'
})
export class DriverPage {
  id: any;
  driverStudents: Array<string>;
  studentList: any;

  constructor(public studentService: StudentProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public checkinService: CheckinProvider,
              public userService: UserProvider) {
      this.id = navParams.data;
      this.studentList = this.studentService.data;
  }

  ionViewDidLoad() {
    console.log(this.studentService.data);
  }
  getDriverName(_id: String) {
    return this.userService.data.get(String(_id)).fName + " " + this.userService.data.get(String(_id)).lName;
  }

}
