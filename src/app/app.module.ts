import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {MyApp} from "./app.component";
import {InitialPage} from "../pages/initial/initial";
import {StudentDetailsPage} from "../pages/student-details/student-details";
import {LoginPage} from "../pages/login/login";
import {ListPage} from "../pages/list/list";
import {NapPage} from "../pages/nap/nap";
import {DriverPage} from "../pages/driver/driver";
import {ClassroomPage} from "../pages/classroom/classroom";
import {PresentStudentsPage} from "../pages/present-students/present-students";
import {StudentInfoButtonPage} from "../pages/student-info-button/student-info-button";
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
import {ConstantsProvider} from "../providers/constants-provider";
import {AuthProvider} from "../providers/auth-provider";
import {LoggingProvider} from "../providers/logging-provider";
import {KitchenPage} from "../pages/kitchen/kitchen";
import {TherapistPage} from "../pages/therapist/therapist";
import {HomeButtonPage} from "../pages/home-button/home-button";
import {AdminPage} from "../pages/admin/admin";
import {AdminReportingPage} from "../pages/admin-reporting/admin-reporting";
import {AdminReportingDetailsPage} from "../pages/admin-reporting-details/admin-reporting-details";
import {AdminStudentTabPage} from "../pages/admin-student-tab/admin-student-tab";
import {AdminUserTabPage} from "../pages/admin-user-tab/admin-user-tab";
import {AdminClassroomTabPage} from "../pages/admin-classroom-tab/admin-classroom-tab";
import {AdminSettingsTabPage} from "../pages/admin-settings-tab/admin-settings-tab";
import {AdminDrillTabPage} from "../pages/admin-drill-tab/admin-drill-tab";
import {AdminStudentModalPage} from "../pages/admin-student-modal/admin-student-modal";
import {AdminUserModalPage} from "../pages/admin-user-modal/admin-user-modal";
import {AdminClassroomModalPage} from "../pages/admin-classroom-modal/admin-classroom-modal";
import {ClassroomAddModalPage} from "../pages/classroom-add-modal/classroom-add-modal";
import {ForgotPasswordPage} from '../pages/forgot-password-page/forgot-password-page';
import {AdminChangePasswordPage} from '../pages/admin-change-password/admin-change-password';
import {AdminChangeQuestionPage} from '../pages/admin-change-question/admin-change-question';
import {AdminEditGlobalsPage} from '../pages/admin-edit-globals/admin-edit-globals';
import {ResetTokenPage} from '../pages/reset-token/reset-token';
import {UserAddModalPage} from "../pages/user-add-modal/user-add-modal";
import {MapValuesPipe} from "../pipes/map-values";
import {PresentCountPipe} from "../pipes/present-count";
import {ImpureMapValuesPipe} from "../pipes/impure-map-values";
import {FirstUpperPipe} from "../pipes/first-upper";
import {StudentFilterPipe} from "../pipes/student-filter";
import {UserRoleFilterPipe} from "../pipes/user-role-filter";
import {ParentReadablePipe} from "../pipes/parent-readable";
import {FilterParentsPipe} from "../pipes/filter-parents";
import {FilterBillablePipe} from "../pipes/filter-billable-rooms";
import {KitchenPipe} from "../pipes/kitchen-map";
import {TherapistAddPage} from "../pages/therapist-add/therapist-add";
import {TherapistStudentDetailsPage} from "../pages/therapist-student-details/therapist-student-details";
import {TherapistCheckinConfirmModalPage} from "../pages/therapist-checkin-confirm-modal/therapist-checkin-confirm-modal";
import {UserLoginPage} from "../pages/user-login/user-login";
import {GenericCheckinConfirmModalPage} from "../pages/generic-checkin-confirm-modal/generic-checkin-confirm-modal";
import {ClassroomSelectionModalPage} from "../pages/classroom-selection-modal/classroom-selection-modal";

@NgModule({
  declarations: [
    MyApp,
    InitialPage,
    StudentDetailsPage,
    LoginPage,
    ListPage,
    NapPage,
    ClassroomPage,
    PresentStudentsPage,
    StudentInfoButtonPage,
    TherapyPage,
    ClassroomIdPage,
    ActionButtonPage,
    GenericPage,
    SignoutPage,
    SigninPage,
    KitchenPage,
    DriverPage,
    TherapistPage,
    HomeButtonPage,
    AdminPage,
    ForgotPasswordPage,
    AdminChangePasswordPage,
    AdminChangeQuestionPage,
    AdminEditGlobalsPage,
    ResetTokenPage,
    MapValuesPipe,
    ImpureMapValuesPipe,
    PresentCountPipe,
    FirstUpperPipe,
    StudentFilterPipe,
    UserRoleFilterPipe,
    ParentReadablePipe,
    KitchenPipe,
    FilterParentsPipe,
    FilterBillablePipe,
    AdminReportingPage,
    AdminReportingDetailsPage,
    AdminStudentTabPage,
    AdminUserTabPage,
    AdminClassroomTabPage,
    AdminDrillTabPage,
    AdminSettingsTabPage,
    AdminStudentModalPage,
    AdminUserModalPage,
    AdminClassroomModalPage,
    ClassroomAddModalPage,
    UserAddModalPage,
    TherapistAddPage,
    TherapistStudentDetailsPage,
    TherapistCheckinConfirmModalPage,
    UserLoginPage,
    GenericCheckinConfirmModalPage,
    ClassroomSelectionModalPage

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InitialPage,
    StudentDetailsPage,
    LoginPage,
    ListPage,
    NapPage,
    DriverPage,
    ClassroomPage,
    PresentStudentsPage,
    StudentInfoButtonPage,
    TherapyPage,
    ClassroomIdPage,
    ActionButtonPage,
    GenericPage,
    SignoutPage,
    SigninPage,
    KitchenPage,
    TherapistPage,
    AdminPage,
    AdminReportingPage,
    AdminReportingDetailsPage,
    AdminStudentTabPage,
    AdminUserTabPage,
    AdminDrillTabPage,
    AdminClassroomTabPage,
    AdminSettingsTabPage,
    AdminStudentModalPage,
    AdminUserModalPage,
    AdminClassroomModalPage,
    ClassroomAddModalPage,
    UserAddModalPage,
    TherapistAddPage,
    ForgotPasswordPage,
    AdminChangePasswordPage,
    AdminChangeQuestionPage,
    AdminEditGlobalsPage,
    ResetTokenPage,
    TherapistStudentDetailsPage,
    TherapistCheckinConfirmModalPage,
    UserLoginPage,
    GenericCheckinConfirmModalPage,
    ClassroomSelectionModalPage

  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, StudentProvider, UserProvider, ClassRoomProvider, CheckinProvider, UtilityProvider, AuthProvider, ConstantsProvider, LoggingProvider]
})
export class AppModule {}
