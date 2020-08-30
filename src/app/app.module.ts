import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule,routingComponents } from './app-routing.module';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { FourZeroFourComponent } from './four-zero-four/four-zero-four.component';
import { RegisterComponent } from './register/register.component';
import { NgWizardModule, NgWizardConfig, THEME } from 'ng-wizard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';


const ngWizardConfig: NgWizardConfig = {
  theme: THEME.default
};
import { NZ_I18N, en_US } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
   
    AcceuilComponent,
   
    FourZeroFourComponent,
   
    RegisterComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgWizardModule.forRoot(ngWizardConfig),
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    ToastrModule.forRoot(), // ToastrModule added
    /*MatGoogleMapsAutocompleteModule,
    AgmCoreModule.forRoot(),*/
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAKJq40ZYZOR0UtH4Aosj4-nhnuhIrtFiU',
      libraries: ['places']
    }),
    MatGoogleMapsAutocompleteModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    DragDropModule,
    HttpClientModule,
    MatIconModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
