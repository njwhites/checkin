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
import {UtilityProvider} from "../providers/utility-provider";
import {KitchenPage} from "../pages/kitchen/kitchen";
import {TherapistPage} from "../pages/therapist/therapist";
import {HomeButtonPage} from "../pages/home-button/home-button";
import {AdminPage} from "../pages/admin/admin";
import {AdminStudentTabPage} from "../pages/admin-student-tab/admin-student-tab";
import {AdminUserTabPage} from "../pages/admin-user-tab/admin-user-tab";
import {AdminDebugTabPage} from "../pages/admin-debug-tab/admin-debug-tab";
import {AdminStudentModalPage} from "../pages/admin-student-modal/admin-student-modal";
import {AdminUserModalPage} from "../pages/admin-user-modal/admin-user-modal";
import {MapValuesPipe} from "../pipes/map-values";
import {ImpureMapValuesPipe} from "../pipes/impure-map-values";
import {FirstUpperPipe} from "../pipes/first-upper";
import {ParentReadablePipe} from "../pipes/parent-readable";
import {TherapistFavoritePage} from "../pages/therapist-favorite/therapist-favorite";
import {TherapistAddPage} from "../pages/therapist-add/therapist-add";
import {TherapistStudentDetailsPage} from "../pages/therapist-student-details/therapist-student-details"

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
    HomeButtonPage,
    AdminPage,
    MapValuesPipe,
    ImpureMapValuesPipe,
    FirstUpperPipe,
    ParentReadablePipe,
    AdminStudentTabPage,
    AdminUserTabPage,
    AdminDebugTabPage,
    AdminStudentModalPage,
    AdminUserModalPage,
    TherapistFavoritePage,
    TherapistAddPage,
    TherapistStudentDetailsPage

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
    AdminPage,
    AdminStudentTabPage,
    AdminUserTabPage,
    AdminDebugTabPage,
    AdminStudentModalPage,
    AdminUserModalPage,
    TherapistAddPage,
    TherapistStudentDetailsPage

  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, StudentProvider, UserProvider, ClassRoomProvider, CheckinProvider, UtilityProvider]
})
export class AppModule {}
