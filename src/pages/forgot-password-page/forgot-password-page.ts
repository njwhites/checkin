import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {ResetTokenPage} from '../reset-token/reset-token';
import { AuthProvider } from '../../providers/auth-provider';
import { UserProvider } from '../../providers/user-provider';

@Component({
  selector: 'page-forgot-password-page',
  templateUrl: 'forgot-password-page.html'
})
export class ForgotPasswordPage {

  question: string;
  showQuestion: boolean;
  id: string;
  email:string;

  constructor(public navCtrl: NavController, public authService: AuthProvider, public userService: UserProvider, public toastCtrl: ToastController) {
    this.showQuestion = false;
    this.question = "";
  }

  ionViewDidLoad() {
  }

  checkEmail(email){
    this.userService.getUserByEmail(email.value).then((result: any) => {
      //look up question.then()
      //flip ui to show
      this.authService.getPasswordQuestion(result.id).then((question: string) => {
        this.question = question;
        if(this.question.charAt(this.question.length - 1) !== '?'){
          this.question += '?';
        }
        this.id = result.id;
        this.email = email.value;
        this.showQuestion = true;
      }).catch((err) => {
        //password question not set
        let toast = this.toastCtrl.create({
          message: 'Your Security Question Is Not Set',
          duration: 3000,
          position: 'bottom'
        });
        toast.present(toast);
      });
    }).catch((err) => {
      //user email doesnt exist
      let toast = this.toastCtrl.create({
        message: 'Invalid Email Entered',
        duration: 3000,
        position: 'bottom'
      });
      toast.present(toast);
    })
  }

  checkAnswer(answer){
    this.authService.checkPasswordQuestion(this.id, answer.value).then((result) => {
      if(result){
        this.sendToChangePage(this.email, this.id);
      }else{
        let toast = this.toastCtrl.create({
          message: 'Incorrect Answer.',
          duration: 3000,
          position: 'bottom'
        });
        toast.present(toast);      }
    }).catch(err => {
      let toast = this.toastCtrl.create({
        message: 'Database Connection Error. Try Restarting The Application',
        duration: 3000,
        position: 'bottom'
      });
      toast.present(toast);    })
  }

  sendToChangePage(userEmail, id){
    this.navCtrl.push(ResetTokenPage, {
      email: userEmail,
      id: id
    })
  }

}
