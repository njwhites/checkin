import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UtilityProvider} from '../../providers/utility-provider';
import {AdminStudentTabPage} from "../admin-student-tab/admin-student-tab";
import {AdminUserTabPage} from "../admin-user-tab/admin-user-tab";
import {AdminDebugTabPage} from "../admin-debug-tab/admin-debug-tab";

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  adminStudentTab = AdminStudentTabPage;
  adminStudentTabParams = {

  };

  adminUserTab = AdminUserTabPage;
  adminUserTabParams = {

  };

  adminDebugTab = AdminDebugTabPage;
  admingDebugTabParams = {

  };

  constructor(public navCtrl: NavController, public utilityService: UtilityProvider) {}



}
