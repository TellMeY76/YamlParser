import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { Dialog } from 'primeng';
import { Analyzer } from 'src/app/model/Analyzer';
import { taxTypeNames } from 'src/app/config/taxType';

@Component({
  selector: 'app-analyzer-preview',
  templateUrl: './analyzer-preview.component.html',
  styleUrls: ['./analyzer-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyzerPreviewComponent implements OnInit {
  StatusList = {
    0: '不满足',
    1: '满足',
    2: '不足',
  };
  analyzer: Analyzer;
  TaxTypeNames = taxTypeNames;

  constructor(public ref: DynamicDialogRef, public dialogConfig: DynamicDialogConfig) {
    this.analyzer = dialogConfig.data.analyzer;
    this.analyzer.tree = this.analyzer.tree.map(item => {
      const showHideObj = { showAllAd: false, showTask: true, showAllTask: false };
      item = { ...item, ...showHideObj };
      return item;
    });
  }

  ngOnInit(): void {
  }

  showDialogMaximized(event, dialog: Dialog) {
    setTimeout(() => {
      dialog.maximize();
    }, 0);
  }

  showAdvice(index: number) {
    this.analyzer.tree[index].showAllAd = this.analyzer.tree[index].showAllAd ? !this.analyzer.tree[index].showAllAd : true;
  }

  showTask(index: number) {
    this.analyzer.tree[index].showTask = this.analyzer.tree[index].showTask ? !this.analyzer.tree[index].showTask : true;
  }

  showAllTask(index: number) {
    this.analyzer.tree[index].showAllTask = this.analyzer.tree[index].showAllTask ? !this.analyzer.tree[index].showAllTask : true;
  }
}
