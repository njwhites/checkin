import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { LoginPage } from '../pages/login/login';
import { TeacherListPage } from '../pages/teacher-list/teacher-list';
import { StudentCheckinPage } from '../pages/student-checkin/student-checkin';

@NgModule({
  declarations: [
    MyApp,
    ItemDetailsPage,
    LoginPage,
    TeacherListPage,
    StudentCheckinPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ItemDetailsPage,
    LoginPage,
    TeacherListPage,
    StudentCheckinPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
