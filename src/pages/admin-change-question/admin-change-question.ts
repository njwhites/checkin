import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth-provider';



@Component({
  selector: 'page-admin-change-question',
  templateUrl: 'admin-change-question.html'
})
export class AdminChangeQuestionPage {

  questionForm: FormGroup;
  id: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public authService: AuthProvider) {

    this.id = navParams.get('userID');
    let question:string = '';
    this.authService.getPasswordQuestion(this.id+"").then((result: any)=>{
      question = result.question;
    }).catch((error)=>{
      console.log(error);
      question = '';
    })
    console.log(question);
    this.questionForm = formBuilder.group({
      question: [
        question,
        Validators.compose([
          Validators.required,
          (control: FormControl)=>{
            return ((control.value || '').length >= 40) ?
              {fortyCharacters: true} : null;
          }
          //this is to check that the question is not their password but I'm not certain on how to return this
          // (control: FormControl):{[key: string]: any}=>{
          //   this.authService.checkPassword(this.id, control.value).then((result)=>{
          //     return result ? {matching: true} : null;
          //   });
          //}
        ])
      ],
      answer: [
        '',
        Validators.required
      ],
    });

  }

  updateQuestion(){
    console.log("you should change the question here");
    console.log(this.questionForm.controls['question'].value);
    console.log(this.questionForm.controls['answer'].value);
    console.log(this.id);
    this.authService.setPasswordQuestion(this.id+"",this.questionForm.controls['question'].value,this.questionForm.controls['answer'].value).then((result)=>{
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
  }

}
