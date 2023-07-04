import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormUserComponent } from './components/form-user/form-user.component';
import { TableUserComponent } from './components/table-user/table-user.component';


@NgModule({
  declarations: [
    FormUserComponent,
    TableUserComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports:[
    FormUserComponent,
    TableUserComponent
  ]
})
export class SharedModule { }
