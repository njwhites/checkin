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
  private napTimes = [
    {text: "60", value: 60 },
    {text: "45", value: 45 },
    {text: "30", value: 30 },
    {text: "15", value: 15 },
    {text: "0", value: 0 }
  ]

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello NapButtonsPage Page');
  }

  updateNap(time){
    this.napTime.emit(time);
  }

}
