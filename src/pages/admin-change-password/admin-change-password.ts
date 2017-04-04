import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth-provider';
import { UserProvider } from '../../providers/user-provider';
@Component({
  selector: 'page-admin-change-password',
  templateUrl: 'admin-change-password.html'
})
export class AdminChangePasswordPage {
  id: string;
  user: any;
  passForm: FormGroup ;



  /*------------------------------------------------------------------------------------------
                        MAKE this a form control!!!!!1
  --------------------------------------------------------------------------------------------*/
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthProvider,
              public userService: UserProvider,
              public toastCtrl: ToastController,
              public formBuilder: FormBuilder) {
    this.id = navParams.get("userID") + "";
    this.user = this.userService.data.get(this.id);
    this.passForm = new FormGroup({});

    //password form is for the new password
    this.passForm = this.formBuilder.group({
      password: ['', Validators.compose([
        (control: FormControl)=>{
            return (control.value === "") ? {required: true} : null;
        },
        (control: FormControl)=>{
            return ((control.value || '').length < 8) ? {lengthLessEight: true} : null;
        },
        (control: FormControl)=>{
            let result = control.value.match(RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$'));
            return (result === null) ? {pattern: true} : null;
        }
      ])],
      confirmPassword: ['', (control: FormControl)=>{
          return (control.value === "") ? {required: true} : null;
      }],
    }, {validator: Validators.compose([
      this.notMatchingValidator('password','confirmPassword'),
    ])
  });
  }

  notMatchingValidator(field1: string, field2: string){
    return (group: FormGroup): {[key: string]: any} => {
      let field1Control = group.controls[field1];
      let field2Control = group.controls[field2];
      return (field1Control.value !== field2Control.value) ?
        {notMatching: true} : null;
    }
  }


  ionViewDidLoad() {
  }

  updatePassword(password){
  	this.authService.checkPassword(this.id, password).then((success) => {
  		if(success){
  			this.authService.setPassword(this.id, this.passForm.controls['password'].value);
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
