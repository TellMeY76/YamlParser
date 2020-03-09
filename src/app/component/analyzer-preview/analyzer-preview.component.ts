import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicDialog';

@Component({
  selector: 'app-analyzer-preview',
  templateUrl: './analyzer-preview.component.html',
  styleUrls: ['./analyzer-preview.component.scss']
})
export class AnalyzerPreviewComponent implements OnInit {
  StatusList = {
    0: '不满足',
    1: '满足',
    2: '不足',
  }
  analyzer: any;

  constructor(public ref: DynamicDialogRef, public dialogConfig: DynamicDialogConfig) {
    console.log(dialogConfig)
    this.analyzer = dialogConfig.data['analyzer']
  }

  ngOnInit(): void {
  }

}
