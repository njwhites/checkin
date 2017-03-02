import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider'

@Component({
  selector: 'page-admin-change-password',
  templateUrl: 'admin-change-password.html'
})
export class AdminChangePasswordPage {
  id: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider, public toastCtrl: ToastController) {
    this.id = navParams.get("userID") + "";
  }

  ionViewDidLoad() {
  }

  updatePassword(password, newPassword, reNewPassword){
    if(newPassword !== reNewPassword || !newPassword){
      let toast = this.toastCtrl.create({
        message: 'Password and Re-enter password fields do not match.',
        duration: 3000,
        position: 'bottom'
      });
      toast.present(toast);
    }else{
    	this.authService.checkPassword(this.id, password).then((success) => {
    		if(success){
    			this.authService.setPassword(this.id, newPassword);
          this.navCtrl.pop();
          let toast = this.toastCtrl.create({
            message: 'Your password has been successfully changed.',
            duration: 3000,
            position: 'bottom'
          });
          toast.present(toast);
    		}else {
          let toast = this.toastCtrl.create({
            message: 'Incorrect Password: Please enter your current password in the top field.',
            duration: 3000,
            position: 'bottom'
          });
          toast.present(toast);
        }
  	  })
    }
  }
}
