import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicDialog';
import { Dialog } from 'primeng';

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
  };
  analyzer: any;

  constructor(public ref: DynamicDialogRef, public dialogConfig: DynamicDialogConfig) {
    this.analyzer = dialogConfig.data.analyzer;
  }

  ngOnInit(): void {
  }

  showDialogMaximized(event, dialog: Dialog) {
    setTimeout(() => {
      dialog.maximize();
    }, 0);
  }

  showAdvice(index: number) {
    this.analyzer.tree[index]['showAllAd'] = this.analyzer.tree[index]['showAllAd'] ? !this.analyzer.tree[index]['showAllAd'] : true;
  }
}