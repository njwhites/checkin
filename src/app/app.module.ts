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
import {CheckoutIdPage} from "../pages/checkout-id/checkout-id";
import {CheckoutTherapyButtonPage} from "../pages/checkout-therapy-button/checkout-therapy-button"


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
    CheckoutIdPage,
    CheckoutTherapyButtonPage
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
    CheckoutIdPage,
    CheckoutTherapyButtonPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
