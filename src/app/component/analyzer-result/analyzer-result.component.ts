import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { CaseServiceService } from '../../service/case-service.service';

import { Corp } from 'src/app/model/corp';
import { getCurrentDate } from 'src/app/util/date';
import { DELAY_TIME } from 'src/app/config/delay';
import { AnalysisResult } from 'src/app/model/Analyzer';
import { ANALYSIS_TYPE } from 'src/app/config/corpInfo';
interface HideLoadingParams {
  success: () => void;
}
@Component({
  selector: 'app-analyzer-result',
  templateUrl: './analyzer-result.component.html',
  styleUrls: ['./analyzer-result.component.scss', '../../style/dialog.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnalyzerResultComponent implements OnInit, OnDestroy {
  analysisResult: AnalysisResult;
  loading: boolean;
  analyzerId: string;
  analysisType = ANALYSIS_TYPE;
  timeId;
  allAdviceShow = false;
  constructor(
    public caseService: CaseServiceService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private corpService: CaseServiceService) {
    this.analysisResult = this.config.data.analysisResult;
    this.loading = this.config.data.needLoading;
    this.analyzerId = this.config.data.analyzerId;
  }

  ngOnInit() {
    this.hideLoadingSpinner();
  }

  ngOnDestroy() {
    clearTimeout(this.timeId);
  }

  hideLoadingSpinner(params?: HideLoadingParams) {
    if (this.timeId) { clearTimeout(this.timeId); }
    this.timeId = setTimeout(() => {
      this.loading = false;
      if (params) {
        params.success();
      }
    }, DELAY_TIME.LOADING);
  }

  reAnalyse() {
    this.ref.close(true);
  }

  runAnalyse() {
    this.caseService.getAnalyzerResultById(this.analyzerId).subscribe(res => {
      this.config.header = `模拟分析 -- 分析结果 `;
      this.analysisResult = res?.data as AnalysisResult;
    });
  }

  showAllAdvice() {
    this.allAdviceShow = !this.allAdviceShow;
  }
}
