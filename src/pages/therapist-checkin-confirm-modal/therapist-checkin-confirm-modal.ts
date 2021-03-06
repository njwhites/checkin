import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {CheckinProvider} from '../../providers/checkin-provider';

@Component({
  selector: 'page-therapist-checkin-confirm-modal',
  templateUrl: 'therapist-checkin-confirm-modal.html'
})
export class TherapistCheckinConfirmModalPage {
  start: string = "0";
  original_start_time: Date;
  displayDate: string;
  mfifteen: string;
  mten: string;
  mfive: string;
  pfive: string;
  pten: string;
  pfifteen: string;
  length: Number;
  by_id: String;
  student: String;
  nap_subtract: Number;

  constructor(public navCtrl: NavController, private viewCtrl: ViewController, public navParams: NavParams, public checkinService: CheckinProvider) {
    this.original_start_time =  new Date(Math.round(Number(this.navParams.get('start_time')) / 300000) * 300000);
    this.mfifteen = this.checkinService.createReadableTime((Math.round(Number(this.navParams.get('start_time')) / 300000) * 300000) - 900000);
    this.mten = this.checkinService.createReadableTime((Math.round(Number(this.navParams.get('start_time')) / 300000) * 300000) - 600000);
    this.mfive =this.checkinService.createReadableTime((Math.round(Number(this.navParams.get('start_time')) / 300000) * 300000) - 300000);
    this.displayDate = this.checkinService.createReadableTime(this.original_start_time.getTime())
    this.pfive = this.checkinService.createReadableTime((Math.round(Number(this.navParams.get('start_time')) / 300000) * 300000) + 300000);
    this.pten = this.checkinService.createReadableTime((Math.round(Number(this.navParams.get('start_time')) / 300000) * 300000) + 600000);
    this.pfifteen = this.checkinService.createReadableTime((Math.round(Number(this.navParams.get('start_time')) / 300000) * 300000) + 900000);
    this.length = this.navParams.get('length');
    if(this.length > 60) {
      this.length = 60;
    }
    this.by_id = this.navParams.get('by_id');
    this.student = this.navParams.get('student');
    this.nap_subtract = 0;
  }


/*******************************************************************************
 * submit
 *
 * takes values from modal and passes them to the therapistCheckinFollowUp
 * function; specifically updating the start time and the length
 *
 */
  submit() {
    var start_time = '';
    switch(this.start) {
      case "-15":
        start_time = this.mfifteen;
        break;
      case "-10":
        start_time = this.mten;
        break;
      case "-5":
        start_time = this.mfive;
        break;
      case "0":
        start_time = this.displayDate;
        break;
      case "+5":
        start_time = this.pfive;
        break;
      case "+10":
        start_time = this.pten;
        break;
      case "+15":
        start_time = this.pfifteen;
        break;
      default:
        console.log("error");
        break;
    }
    this.checkinService.therapistCheckinFollowUp(this.student.toString(), this.by_id.toString(), this.checkinService.parseReadableTime(start_time).toString(), this.length, this.nap_subtract);
    let data = { 'returnValue': true };
    this.viewCtrl.dismiss(data);
  }

  ionViewDidLoad() {
    console.log('length ' + this.length);
  }

}
