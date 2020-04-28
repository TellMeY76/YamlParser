import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, ConfirmationService } from 'primeng';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn, Validators } from '@angular/forms';
import { CaseServiceService } from '../../service/case-service.service';

import { Corp, CorpFld, CorpAnalyzerData } from 'src/app/model/corp';
import { UNEDITABLE_FLD, FLD_CH_EN, CORP_INPUT_TYPE_VAL } from 'src/app/config/corpInfo';
import { numReg } from 'src/app/config/regex';

@Component({
  selector: 'app-corp-edit',
  templateUrl: './corp-edit.component.html',
  styleUrls: ['./corp-edit.component.scss', '../../style/dialog.scss'],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class CorpEditComponent implements OnInit {
  corpForm: FormGroup;
  corpAnalyzerData: CorpAnalyzerData[];
  corpFlds: CorpFld[];
  editableFlds;
  FLD_CH_EN = FLD_CH_EN;
  get isValid() { return this.corpForm.controls.cd.valid; }
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private corpService: CaseServiceService,
    private confirmationService: ConfirmationService) {
    this.corpAnalyzerData = config.data.corpAnalyzerData;
  }
  static getYearMonth(dates: Date): string {
    const Year: any = dates.getFullYear() < 10 ? '000' + dates.getFullYear() : dates.getFullYear();
    const Months: any = (dates.getMonth() + 1) < 10 ? '0' + (dates.getMonth() + 1) : (dates.getMonth() + 1);
    const Day: any = dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate();
    return `${Year}-${Months}-${Day}`;
  }

  ngOnInit() {
    this.buildCorpForm(this.corpAnalyzerData);
  }

  saveThenAnalyze() {
    if (!this.corpForm.invalid) {
      this.confirmationService.confirm({
        message: '确认保存当前信息，并分析?',
        header: '温馨提示',
        acceptLabel: '确认',
        rejectLabel: '取消',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const formVal = this.corpForm.value;
          const corpData: CorpAnalyzerData[] = this.corpAnalyzerData.map(item => {
            const fldVal = formVal[item.analyzerShowID];
            if (item.type === CORP_INPUT_TYPE_VAL.date && fldVal && item.value !== fldVal) {
              item.value = CorpEditComponent.getYearMonth(fldVal);
            } else {
              item.value = fldVal;
            }
            return item;
          });
          this.updateCorp(corpData);
        }
      });
    }
  }

  updateCorp(corp: CorpAnalyzerData[]) {
    this.ref.close(true);
    this.corpService.updateCorpAnalyzerData(corp).subscribe(res => {
      if (res.data) {
        this.ref.close(true);
      }
    });
  }

  buildCorpForm(corpAnalyzerData: CorpAnalyzerData[]) {
    const formGroup = {};
    for (let i = 0, len = corpAnalyzerData.length; i < len; i++) {
      const formFld = corpAnalyzerData[i];
      const validators = formFld.type === CORP_INPUT_TYPE_VAL.num
        ? [Validators.pattern(/^[0-9]*$/)]
        : [];
      formGroup[formFld.analyzerShowID] = new FormControl(formFld.value, validators);
    }

    this.corpForm = new FormGroup(formGroup);
  }
}
