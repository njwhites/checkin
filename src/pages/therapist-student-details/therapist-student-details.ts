import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from "../../providers/checkin-provider";
import {UserProvider} from "../../providers/user-provider";
import {TherapistCheckinConfirmModalPage} from "../therapist-checkin-confirm-modal/therapist-checkin-confirm-modal"

@Component({
  selector: 'page-therapist-student-details',
  templateUrl: 'therapist-student-details.html'
})
export class TherapistStudentDetailsPage {
  selectedStudent: string;
  id: number;

  constructor(public modalCtrl: ModalController, public userService: UserProvider, public studentService: StudentProvider, public checkinService: CheckinProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedStudent = navParams.get('student');
    this.id = navParams.get('id');

  }

  checkoutStudent() {
    this.userService.getTherapistTypeByID(this.id.toString()).then((type:string) => {
      this.checkinService.therapistCheckout(this.selectedStudent, this.id.toString(), type);
    });
    this.navCtrl.pop();
  }

  checkinStudent() {
    this.checkinService.therapistCheckin(this.selectedStudent, String(this.id)).then((TransactionTherapyObject:any) => {
      let modal = this.modalCtrl.create(TherapistCheckinConfirmModalPage, {
        start_time: TransactionTherapyObject.start_time,
        length: TransactionTherapyObject.length,
        by_id: TransactionTherapyObject.by_id,
        student: this.selectedStudent
      }, {enableBackdropDismiss: false});
      modal.present(modal)
    });
  }


}
