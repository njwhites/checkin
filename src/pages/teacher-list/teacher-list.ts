import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

@Component({
  selector: 'page-teacher-list',
  templateUrl: 'teacher-list.html'
})
export class TeacherListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    this.items.push({
      title: 'Matthew',
      note: 'checked in at 8:15am',
      icon: 'man'
    });
    this.items.push({
      title: 'Mark',
      note: 'checked in at 8:05am',
      icon: 'man'
    });
    this.items.push({
      title: 'Sarah',
      note: 'checked in at 8:05am',
      icon: 'woman'
    });
    this.items.push({
      title: 'Laurel',
      note: 'checked in at 7:55am',
      icon: 'woman'
    });
    this.items.push({
      title: 'Luke',
      note: 'checked in at 8:10am',
      icon: 'man'
    });
    this.items.push({
      title: 'Katie',
      note: 'checked in at 8:00am',
      icon: 'woman'
    });
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
