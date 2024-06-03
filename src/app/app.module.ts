import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeaturesModule } from "./components/features/features.module";
import { HttpClientModule } from "@angular/common/http";
import { FeaturesRoutingModule } from "./components/features/fetures-routing.module";
import { authInterceptor } from './interceptors/auth.interceptor';
import { CoreModule } from './components/core/core.module';
import { LoginComponent } from './components/auth/login/login.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './components/auth/register/register.component';
import { environment } from './environments/dev-environments';
import { SharedModule } from './components/shared/shared.module';

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { AuthService } from './services/auth.service';

function appInitiate(authService: AuthService) {
  authService.initiateUser();
  return new Promise<void>((resolve) => {
    const unsubscripe = authService.isLoaded.subscribe(state => {
      if (state === true) {
        unsubscripe.unsubscribe();
        resolve();
      }
    })
  })
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    FeaturesModule,
    FeaturesRoutingModule,
    FormsModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    authInterceptor,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => appInitiate(authService),
      multi: true,
      deps: [AuthService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
