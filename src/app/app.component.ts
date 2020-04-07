import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Analyzer, AnalyzerInput } from './model/Analyzer';
import { AnalyzerPreviewComponent } from './component/analyzer-preview/analyzer-preview.component';
import { CaseServiceService } from './service/case-service.service';
import { DialogService } from 'primeng';
import { TaskBind } from './model/taskBind';
import { Result } from './model/result';
import { OPERATE } from './config/operate';
import { CaseListComponent } from './component/case-list/case-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService]

})
export class AppComponent implements OnInit {
  breadMenuItems: MenuItem[];
  conditionsRequired: AnalyzerInput[];
  menuHome: MenuItem;
  analyzer: Analyzer;
  showTaskView = false;
  treeIds: string[] = [];
  operate: string;
  @ViewChild(CaseListComponent)
  private caseListComponent: CaseListComponent;

  constructor(public caseService: CaseServiceService,
              public dialogService: DialogService) {
  }

  ngOnInit() {
    this.analyzer = new Analyzer();
  }

  showTasks(analyzer: Analyzer) {
    this.showTaskView = true;
    this.analyzer = analyzer;
  }

  setAnalyzer(analyzer: Analyzer) {
    this.analyzer = analyzer;
    this.operate = OPERATE.U;
  }

  hideTasks(showTask: boolean) {
    this.showTaskView = showTask;
  }

  deleteAnalyzer(analyzerId: string) {
    console.log('delete Analyzer');
    this.operate = '';
    this.caseListComponent.getAnalyzerList();
  }
}
