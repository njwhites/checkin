import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AdminReportingPage} from "../admin-reporting/admin-reporting";
import {AdminStudentTabPage} from "../admin-student-tab/admin-student-tab";
import {AdminUserTabPage} from "../admin-user-tab/admin-user-tab";
import {AdminDebugTabPage} from "../admin-debug-tab/admin-debug-tab";
import {AdminDrillTabPage} from "../admin-drill-tab/admin-drill-tab";
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

  adminDebugTab = AdminDebugTabPage;
  admingDebugTabParams = {

  };

  adminClassroomTab = AdminClassroomTabPage;
  admingClassroomTabParams = {

  };

  adminDrillTab = AdminDrillTabPage;
  admingDrillTabParams = {
    id: this.id
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.id = navParams.data;
  }



}
