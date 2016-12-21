import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {StudentDetailsPage} from "../pages/student-details/student-details";
import {LoginPage} from "../pages/login/login";
import {TeacherListPage} from "../pages/teacher-list/teacher-list";
import {StudentCheckinPage} from "../pages/student-checkin/student-checkin";
import {StudentCheckinConfirmPage} from "../pages/student-checkin-confirm/student-checkin-confirm";
import {ClassroomPage} from "../pages/classroom/classroom";
import {NapPage} from "../pages/nap/nap";


@NgModule({
  declarations: [
    MyApp,
    StudentDetailsPage,
    LoginPage,
    TeacherListPage,
    StudentCheckinPage,
    StudentCheckinConfirmPage,
    ClassroomPage,
    NapPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StudentDetailsPage,
    LoginPage,
    TeacherListPage,
    StudentCheckinPage,
    StudentCheckinConfirmPage,
    ClassroomPage,
    NapPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
