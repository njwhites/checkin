import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConstantsProvider} from '../../providers/constants-provider';

@Component({
  selector: 'page-admin-edit-globals',
  templateUrl: 'admin-edit-globals.html'
})
export class AdminEditGlobalsPage {

  globalsForm: FormGroup = new FormGroup({rate: new FormControl()});
  rate: number;

  constructor(public navCtrl: NavController,
              public constantsService: ConstantsProvider,
              public formBuilder: FormBuilder,
              public toastController: ToastController) {
    this.rate = 0;
    this.globalsForm = formBuilder.group({
      rate: [this.rate, Validators.compose([
        Validators.required
      ])]
    })
    constantsService.returnRate().then((doc: any)=>{
      console.log('succeeded initial returnRate()');
      this.globalsForm.controls['rate'].setValue(doc.rate);
    }).catch((err)=>{
      console.log("return rate failed");
      console.log(err);
    });

  }

  ionViewDidLoad() {
  }

  updateGlobals(){
    if(this.globalsForm.controls['rate'].value !== this.rate){
      this.constantsService.setRate(this.globalsForm.controls['rate'].value).then((result)=>{
        this.constantsService.returnRate().then((value: any)=>{
          this.toastController.create({
            message: `Billing rate has been updated to $${value.rate}/hour.`,
            duration: 3000,
            position: "bottom"
          }).present();
          this.navCtrl.pop();
          console.log('\trate from getRate:\t'+value);
        }).catch((err)=>{
          console.log(err);
        })
      }).catch((err)=>{
        console.log(err);
      });
    }
  }

}
