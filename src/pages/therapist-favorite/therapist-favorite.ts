import {Component, Input} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {StudentProvider} from '../../providers/student-provider';
import {CheckinProvider} from '../../providers/checkin-provider';
import {UserProvider} from '../../providers/user-provider';

@Component({
  selector: 'page-therapist-favorite',
  templateUrl: 'therapist-favorite.html'
})
export class TherapistFavoritePage {
  therapistStudents: Array<string>
  @Input() id: number;

  constructor(public studentService: StudentProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public checkinService: CheckinProvider,
              public userService: UserProvider) {
    this.id = navParams.data;
    console.log(this.id)
    this.userService.getTherapistFavoriteIDs(this.id.toString()).then((result:any) => {
      console.log(result);
      this.therapistStudents = result;
    }).catch((err) => {
      console.log(err);
    });
  }

}
