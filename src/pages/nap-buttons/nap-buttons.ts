import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-nap-buttons',
  templateUrl: 'nap-buttons.html'
})
export class NapButtonsPage {
  time: string = "60";
  @Input() thisStudent: any;
  @Output() napTime: EventEmitter<string> = new EventEmitter<string>();

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NapButtonsPage Page');
  }

  updateNap(time){
    this.napTime.emit(time);
  }

}
