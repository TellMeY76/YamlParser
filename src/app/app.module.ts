// ng
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// primeng
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';
import { PickListModule } from 'primeng/picklist';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SidebarModule } from 'primeng/sidebar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CaseEditComponent } from './component/case-edit/case-edit.component';
import { CaseListComponent } from './component/case-list/case-list.component';
import { AnalyzerPreviewComponent } from './component/analyzer-preview/analyzer-preview.component';
import { TaskCreateComponent } from './component/task-create/task-create.component';
import { PathTaskComponent } from './component/path-task/path-task.component';
import { DataViewModule, MessageModule, MessagesModule, VirtualScrollerModule } from 'primeng';
import { TaskTemplateDialogComponent } from './component/task-template-dialog/task-template-dialog.component';

@NgModule({
  declarations: [
    CaseEditComponent,
    AppComponent,
    CaseListComponent,
    AnalyzerPreviewComponent,
    TaskCreateComponent,
    PathTaskComponent,
    TaskTemplateDialogComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    DropdownModule,
    TableModule,
    CardModule,
    PanelModule,
    StepsModule,
    TabViewModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    MessageModule,
    InputSwitchModule,
    DynamicDialogModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    MenuModule,
    KeyFilterModule,
    InputTextareaModule,
    CalendarModule,
    ToggleButtonModule,
    PickListModule,
    RadioButtonModule,
    BreadcrumbModule,
    AppRoutingModule,
    MessagesModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    SelectButtonModule,
    ScrollPanelModule,
    SidebarModule,
    DataViewModule,
  ],
  providers: [],
  entryComponents: [AnalyzerPreviewComponent, TaskCreateComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
