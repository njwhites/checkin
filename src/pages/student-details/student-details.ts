import {Component, Input} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import {CheckinProvider} from '../../providers/checkin-provider';
import {StudentProvider} from '../../providers/student-provider';
import {UserProvider} from '../../providers/user-provider';

@Component({
  selector: 'page-student-details',
  templateUrl: 'student-details.html'
})
export class StudentDetailsPage {
  @Input() selectedStudent: any;
  transactions: Array<any> = new Array<any>();
  name: string;

  interval: any;
  timeSinceLastInteraction: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public checkinService: CheckinProvider, public studentService: StudentProvider, public userService: UserProvider) {
    // If we navigated to this page, we will have a student available as a nav param
    this.selectedStudent = navParams.get('student');
    this.loadTransactions();
  }

  loadTransactions(){
    this.checkinService.getTransactionsById(this.selectedStudent, null).then((result: Array<any>) => {
        this.transactions = result;
    }).catch(err => {
      console.log(err);
    });
  }

  getUserName(id: string){
    
    return this.userService.data.get(id).fName + " " + this.userService.data.get(id).lName;
  }

  resetInterval(){
    this.timeSinceLastInteraction = 0;
  }

  ionViewWillEnter(){
    this.timeSinceLastInteraction = 0;
    if(this.interval){
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if(++this.timeSinceLastInteraction >= 30){
        clearInterval(this.interval);
        // switch back from this page, nuke it, kill it with fire
        this.navCtrl.popToRoot();
      }
    }, 1000)
  }

  ionViewWillLeave(){
    this.timeSinceLastInteraction = 25;
  }

  ionViewWillUnload(){
    clearInterval(this.interval);
  }
}
