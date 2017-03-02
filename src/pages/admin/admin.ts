import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AdminReportingPage} from "../admin-reporting/admin-reporting";
import {AdminStudentTabPage} from "../admin-student-tab/admin-student-tab";
import {AdminUserTabPage} from "../admin-user-tab/admin-user-tab";
import {AdminDrillTabPage} from "../admin-drill-tab/admin-drill-tab";
import {AdminSettingsTabPage} from "../admin-settings-tab/admin-settings-tab";
import {AdminClassroomTabPage} from "../admin-classroom-tab/admin-classroom-tab";

@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  id: number;
  adminReportingTab = AdminReportingPage;
  adminReportingTabParams = {

  }

  adminStudentTab = AdminStudentTabPage;
  adminStudentTabParams = {

  };

  adminUserTab = AdminUserTabPage;
  adminUserTabParams = {

  };

  adminClassroomTab = AdminClassroomTabPage;
  adminClassroomTabParams = {

  };

  adminDrillTab = AdminDrillTabPage;
  adminDrillTabParams = {
    id: this.id
  };

  adminSettingsTab = AdminSettingsTabPage;
  adminSettingsParams = {

  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.data;
  }



}
