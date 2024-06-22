import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {importProvidersFrom} from "@angular/core";
import {
  faCheckCircle,
  faClock,
  faDumbbell,
  faEdit,
  faHeartbeat,
  faRedo,
  faStopwatch,
  faSync,
  faTimesCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    importProvidersFrom(FontAwesomeModule),
    ...appConfig.providers
  ]
}).catch(err => console.error(err));

const library = new FaIconLibrary();
library.addIcons(faClock, faHeartbeat, faDumbbell, faSync, faRedo, faStopwatch, faCheckCircle, faTimesCircle, faTrash, faEdit);
