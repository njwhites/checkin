import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from "../../providers/checkin-provider";
import {UserProvider} from "../../providers/user-provider";
import {TransactionTherapy} from "../../models/db-models"
import {TherapistCheckinConfirmModalPage} from "../therapist-checkin-confirm-modal/therapist-checkin-confirm-modal"

@Component({
  selector: 'page-therapist-student-details',
  templateUrl: 'therapist-student-details.html'
})
export class TherapistStudentDetailsPage {
  selectedStudent: string;
  location: string;
  id: number;
  transactions: Array<any> = new Array<any>();

  constructor(public modalCtrl: ModalController, public userService: UserProvider, public studentService: StudentProvider, public checkinService: CheckinProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudent = navParams.get('student');
    this.location = navParams.get('status');
    this.id = navParams.get('id');
    this.checkinService.getAllTherapies(this.selectedStudent).then((result: Array<TransactionTherapy>) => {
        this.transactions = result.map(t=>{
          return{
            start_time: Number(t.start_time),
            by_id: t.by_id,
            length: t.length
          }
        }).sort((a, b)=>{
          return a.start_time - b.start_time;
        });
    });
  }

  checkoutStudent() {
    this.userService.getTherapistTypeByID(this.id.toString()).then((type:string) => {
      this.checkinService.therapistCheckout(this.selectedStudent, this.id.toString(), type);
    });
    this.navCtrl.pop();
  }

  getUserName(id: string){
    let me = this.userService.data.get(id);
    return me.therapy_type + " with " + me.fName + " " + me.lName;
  }

  checkinStudent() {
    this.checkinService.therapistCheckin(this.selectedStudent, String(this.id)).then((TransactionTherapyObject:any) => {
      let modal = this.modalCtrl.create(TherapistCheckinConfirmModalPage, {
        start_time: TransactionTherapyObject.start_time,
        length: (Math.round(Number(Date.now() - TransactionTherapyObject.start_time) / 900000) * 900000)/60000,
        by_id: TransactionTherapyObject.by_id,
        student: this.selectedStudent
      }, {enableBackdropDismiss: false});
      modal.onDidDismiss(data => {
        this.navCtrl.pop();
      });
      modal.present(modal);
    });
  }
}
