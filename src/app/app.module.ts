import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FormUserComponent } from './shared/components/form-user/form-user.component';
import { TableUserComponent } from './shared/components/table-user/table-user.component';


@NgModule({
  declarations: [
    AppComponent,
    FormUserComponent,
    TableUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
