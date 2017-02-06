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
import {NapSliderPage} from "../pages/nap-slider/nap-slider";
import {TherapyPage} from "../pages/therapy/therapy";
import {ClassroomIdPage} from "../pages/classroom-id/classroom-id";
import {ActionButtonPage} from "../pages/action-button/action-button";
import {GenericPage} from "../pages/generic/generic";
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
import {AdminClassroomTabPage} from "../pages/admin-classroom-tab/admin-classroom-tab";
import {AdminStudentModalPage} from "../pages/admin-student-modal/admin-student-modal";
import {AdminUserModalPage} from "../pages/admin-user-modal/admin-user-modal";
import {AdminClassroomModalPage} from "../pages/admin-classroom-modal/admin-classroom-modal";
import {ClassroomAddModalPage} from "../pages/classroom-add-modal/classroom-add-modal";
import {UserAddModalPage} from "../pages/user-add-modal/user-add-modal";
import {MapValuesPipe} from "../pipes/map-values";
import {PresentCountPipe} from "../pipes/present-count";
import {ImpureMapValuesPipe} from "../pipes/impure-map-values";
import {FirstUpperPipe} from "../pipes/first-upper";
import {StudentFilterPipe} from "../pipes/student-filter";
import {UserRoleFilterPipe} from "../pipes/user-role-filter";
import {ParentReadablePipe} from "../pipes/parent-readable";
import {FilterParentsPipe} from "../pipes/filter-parents";
import {KitchenPipe} from "../pipes/kitchen-map";
import {TherapistAddPage} from "../pages/therapist-add/therapist-add";
import {TherapistStudentDetailsPage} from "../pages/therapist-student-details/therapist-student-details";
import {TherapistCheckinConfirmModalPage} from "../pages/therapist-checkin-confirm-modal/therapist-checkin-confirm-modal";
import {UserLoginPage} from "../pages/user-login/user-login";

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
    NapSliderPage,
    TherapyPage,
    ClassroomIdPage,
    ActionButtonPage,
    GenericPage,
    SignoutPage,
    SigninPage,
    KitchenPage,
    TherapistPage,
    HomeButtonPage,
    AdminPage,
    MapValuesPipe,
    ImpureMapValuesPipe,
    PresentCountPipe,
    FirstUpperPipe,
    StudentFilterPipe,
    UserRoleFilterPipe,
    ParentReadablePipe,
    KitchenPipe,
    FilterParentsPipe,
    AdminStudentTabPage,
    AdminUserTabPage,
    AdminDebugTabPage,
    AdminClassroomTabPage,
    AdminStudentModalPage,
    AdminUserModalPage,
    AdminClassroomModalPage,
    ClassroomAddModalPage,
    UserAddModalPage,
    TherapistAddPage,
    TherapistStudentDetailsPage,
    TherapistCheckinConfirmModalPage,
    UserLoginPage

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
    NapSliderPage,
    TherapyPage,
    ClassroomIdPage,
    ActionButtonPage,
    GenericPage,
    SignoutPage,
    SigninPage,
    KitchenPage,
    TherapistPage,
    AdminPage,
    AdminStudentTabPage,
    AdminUserTabPage,
    AdminDebugTabPage,
    AdminClassroomTabPage,
    AdminStudentModalPage,
    AdminUserModalPage,
    AdminClassroomModalPage,
    ClassroomAddModalPage,
    UserAddModalPage,
    TherapistAddPage,
    TherapistStudentDetailsPage,
    TherapistCheckinConfirmModalPage,
    UserLoginPage

  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, StudentProvider, UserProvider, ClassRoomProvider, CheckinProvider, UtilityProvider]
})
export class AppModule {}
