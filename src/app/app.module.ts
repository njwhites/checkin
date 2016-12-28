import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {StudentDetailsPage} from "../pages/student-details/student-details";
import {LoginPage} from "../pages/login/login";
import {ListPage} from "../pages/list/list";
import {StudentCheckinPage} from "../pages/student-checkin/student-checkin";
import {StudentCheckinConfirmPage} from "../pages/student-checkin-confirm/student-checkin-confirm";
import {ClassroomPage} from "../pages/classroom/classroom";
import {NapPage} from "../pages/nap/nap";
import {PresentStudentsPage} from "../pages/present-students/present-students";
import {StudentInfoButtonPage} from "../pages/student-info-button/student-info-button";
import {NapButtonsPage} from "../pages/nap-buttons/nap-buttons";
import {TherapyPage} from "../pages/therapy/therapy";
import {ClassroomIdPage} from "../pages/classroom-id/classroom-id";
import {ActionButtonPage} from "../pages/action-button/action-button";
import {NursePage} from "../pages/nurse/nurse";
import {SignoutPage} from "../pages/signout/signout";
import {SigninPage} from "../pages/signin/signin";
import {StudentProvider} from "../providers/student-provider";

@NgModule({
  declarations: [
    MyApp,
    StudentDetailsPage,
    LoginPage,
    ListPage,
    StudentCheckinPage,
    StudentCheckinConfirmPage,
    ClassroomPage,
    NapPage,
    PresentStudentsPage,
    StudentInfoButtonPage,
    NapButtonsPage,
    TherapyPage,
    ClassroomIdPage,
    ActionButtonPage,
    NursePage,
    SignoutPage,
    SigninPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StudentDetailsPage,
    LoginPage,
    ListPage,
    StudentCheckinPage,
    StudentCheckinConfirmPage,
    ClassroomPage,
    NapPage,
    PresentStudentsPage,
    StudentInfoButtonPage,
    NapButtonsPage,
    TherapyPage,
    ClassroomIdPage,
    ActionButtonPage,
    NursePage,
    SignoutPage,
    SigninPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, StudentProvider]
})
export class AppModule {}
