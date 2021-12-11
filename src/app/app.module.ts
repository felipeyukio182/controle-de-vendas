import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { ComponentsModule } from './components/components.module';
import { TemplatesModule } from './templates/templates.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

registerLocaleData(localePt)

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    TemplatesModule,
    NgbModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
