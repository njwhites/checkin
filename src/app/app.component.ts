import {Component, ViewChild} from "@angular/core";
import {Platform, MenuController, Nav} from "ionic-angular";
import {StatusBar, Splashscreen} from "ionic-native";
import {LoginPage} from "../pages/login/login";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Lobby', component: LoginPage },
      { title: 'Classroom', component: LoginPage },
      { title: 'Cafeteria', component: LoginPage },
      { title: 'Therapy', component: LoginPage },
      { title: 'Admin', component: LoginPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component, {room: page.title});
  }
}
