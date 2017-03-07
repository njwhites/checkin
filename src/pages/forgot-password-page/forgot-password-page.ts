import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public authService: AuthProvider, public userService: UserProvider) {
    this.showQuestion = false;
    this.question = "";
  }

  ionViewDidLoad() {
    console.log('Hello ForgotPasswordPagePage Page');
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
        console.log("Question not set");
      });
    }).catch((err) => {
      console.log(err);
      //user email doesnt exist
      //TOAST
    })
  }

  checkAnswer(answer){
    this.authService.checkPasswordQuestion(this.id, answer.value).then((result) => {
      if(result){
        console.log("Correct answer");
        this.sendToChangePage(this.email, this.id);
      }else{
        console.log("Incorrect answer");
      }
    }).catch(err => {
      console.log("No idea why but authorization service didn't work");
    })
  }

  sendToChangePage(userEmail, id){
    this.navCtrl.push(ResetTokenPage, {
      email: userEmail,
      id: id
    })
  }

}
