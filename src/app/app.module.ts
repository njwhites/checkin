import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {StudentDetailsPage} from "../pages/student-details/student-details";
import {LoginPage} from "../pages/login/login";
import {ListPage} from "../pages/list/list";
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
import {UserProvider} from "../providers/user-provider";
import {ClassRoomProvider} from "../providers/class-room-provider";
import {CheckinProvider} from "../providers/checkin-provider";
import {KitchenPage} from "../pages/kitchen/kitchen";
import {TherapistPage} from "../pages/therapist/therapist";
import {AdminPage} from "../pages/admin/admin";
import {MapValuesPipe} from "../pipes/map-values";
import {FirstUpperPipe} from "../pipes/first-upper";

@NgModule({
  declarations: [
    MyApp,
    StudentDetailsPage,
    LoginPage,
    ListPage,
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
    SigninPage,
    KitchenPage,
    TherapistPage,
    AdminPage,
    MapValuesPipe,
    FirstUpperPipe
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
    SigninPage,
    KitchenPage,
    TherapistPage,
    AdminPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, StudentProvider, UserProvider, ClassRoomProvider, CheckinProvider]
})
export class AppModule {}
