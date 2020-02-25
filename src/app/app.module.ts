import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect'
import {DropdownModule} from 'primeng/dropdown';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CaseEditComponent } from './component/case-edit/case-edit.component';

@NgModule({
  declarations: [
    CaseEditComponent,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    DropdownModule,
    TableModule,
    CardModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
