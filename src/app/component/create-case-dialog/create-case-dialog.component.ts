import { Component, OnInit } from '@angular/core';
import { Analyzer } from 'src/app/model/Analyzer';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng';

@Component({
  selector: 'app-create-case-dialog',
  templateUrl: './create-case-dialog.component.html',
  styleUrls: ['./create-case-dialog.component.scss']
})
export class CreateCaseDialogComponent implements OnInit {
  analyzer: Analyzer = new Analyzer();
  showTaskView = false;
  analyzerName: any;
  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.analyzer = new Analyzer();
  }

  addNewAnalyzer(analyzerName) {
    this.ref.close(true);
  }
}
