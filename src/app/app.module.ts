import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { IndexComponent } from './components/index/index.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { EmailValidationComponent } from './components/email-validation/email-validation.component';
import { PublicacionComponent } from './components/publicacion/publicacion.component';
import { NuevaPublicacionComponent } from './components/nueva-publicacion/nueva-publicacion.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { MisPublicacionesComponent } from './components/mis-publicaciones/mis-publicaciones.component';
import { EditarPublicacionComponent } from './components/editar-publicacion/editar-publicacion.component';
import { ChatComponent } from './components/chat/chat.component';
import { FilterPipe } from './pipes/filter.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon';
import { DateDisplayPipe } from './pipes/date-display.pipe';
import { DatePipe } from '@angular/common';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { SolicitarTrabajoComponent } from './components/solicitar-trabajo/solicitar-trabajo.component';
import { TrabajosComponent } from './components/trabajos/trabajos.component';
import { ContratacionesComponent } from './components/contrataciones/contrataciones.component';
import { RespSolicitudComponent } from './components/resp-solicitud/resp-solicitud.component';
import { RespTrabajoComponent } from './components/resp-trabajo/resp-trabajo.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MapaComponent } from './components/mapa/mapa.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';
import { PagoComponent } from './components/pago/pago.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { CrudAdminComponent } from './components/crud-admin/crud-admin.component';
import { GestPublicacionesComponent } from './components/gest-publicaciones/gest-publicaciones.component';
import { AdminEditPComponent } from './components/admin-edit-p/admin-edit-p.component';
import { CustomPromptComponent } from './components/custom-prompt/custom-prompt.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataTransferenciaComponent } from './components/data-transferencia/data-transferencia.component';
import { AboutServiceComponent } from './components/about-service/about-service.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    IndexComponent,
    ForgotPasswordComponent,
    EmailValidationComponent,
    PublicacionComponent,
    NuevaPublicacionComponent,
    BusquedaComponent,
    MisPublicacionesComponent,
    EditarPublicacionComponent,
    ChatComponent,
    FilterPipe,
    DateDisplayPipe,
    CalificacionComponent,
    SolicitarTrabajoComponent,
    TrabajosComponent,
    ContratacionesComponent,
    RespSolicitudComponent,
    RespTrabajoComponent,
    MapaComponent,
    PagoComponent,
    GestPublicacionesComponent,
    AdminEditPComponent,
    CrudAdminComponent,
    CustomPromptComponent,
    AboutUsComponent,
    DataTransferenciaComponent,
    AboutServiceComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgxPayPalModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    [HotToastModule.forRoot()],
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    ScreenTrackingService,UserTrackingService,DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
