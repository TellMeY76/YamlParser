import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MenuItem, ConfirmationService, Message, MessageService } from 'primeng/api';
import { Analyzer, AnalyzerInput, AnalyzerSelect, AnalysisResult } from '../../model/Analyzer';
import { AnalyzerPreviewComponent } from '../../component/analyzer-preview/analyzer-preview.component';
import { CaseServiceService } from '../../service/case-service.service';
import { DialogService } from 'primeng';
import { TaskBind } from '../../model/taskBind';
import { Result } from '../../model/result';
import { OPERATE } from '../../config/operate';
import { safeDump } from 'js-yaml';
import { CorpEditComponent } from '../corp-edit/corp-edit.component';
import { CorpAnalyzerData } from 'src/app/model/corp';
import { DELAY_TIME } from 'src/app/config/delay';
import { AnalyzerResultComponent } from '../analyzer-result/analyzer-result.component';
import { setSpecialVal, isSpecialVal } from 'src/app/util/specialVal';
import { ERR_CODE } from 'src/app/config/errCode';

@Component({
  selector: 'app-analyzer-edit',
  templateUrl: './analyzer-edit.component.html',
  styleUrls: ['./analyzer-edit.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class AnalyzerEditComponent implements OnInit, OnChanges {
  @Input() analyzer: Analyzer;
  showTaskView = false;
  @Input() operate: string;
  conditionsRequired: AnalyzerInput[];
  menuHome: MenuItem;
  treeIds: string[] = [];
  @Output() addNewAnalyzer = new EventEmitter<any>();
  @Output() analyzerDeleted = new EventEmitter<any>();
  timeId;

  constructor(public caseService: CaseServiceService,
              public dialogService: DialogService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.analyzer.id) {
      this.getTreeTaskTemps();
    }
  }

  setAnalyzer(analyzer: Analyzer) {
    this.analyzer = analyzer;
    this.operate = OPERATE.U;
  }

  hideTasks(showTask: boolean) {
    this.showTaskView = showTask;
  }

  clickSave() {
    if (this.showTaskView) {
      this.bindTaskTemp();
    } else {
      this.saveAnalyzer();
    }
  }

  saveAnalyzer() {
    if (this.checkRequire()) {
      if (this.analyzer.id) {
        this.updateAnalyzer();
      } else {
        this.addAnalyzer();
      }
    }
  }

  checkRequire() {
    let errWord = '';
    if (!this.analyzer.name) {
      errWord = '分析器名称';
    } else if (this.analyzer.type === '--') {
      errWord = '分析器类型';
    }
    if (errWord) {
      this.showErr(`${errWord}不能为空`);
      return false;
    }
    return true;
  }

  updateAnalyzer() {
    const analyzer = this.setYamlData();
    this.caseService.updateAnalyzer(analyzer).subscribe(res => {
      const result = (res as unknown as Result);
      if (result.errCode === ERR_CODE.DUPLICATES) {
        this.showErr('存在条件重复的分析项，请检查并修改后再次保存');
      } else {
        const resData = result.data;
        this.analyzer.tree = this.updateAnalyzerTree(resData);
        this.showSuccess('分析器更新成功！');
      }
    });
  }

  addAnalyzer() {
    const analyzer = this.setYamlData();
    this.caseService.addAnalyzer(analyzer).subscribe(res => {
      const resData = (res as unknown as Result).data;
      this.treeIds = resData.treeIds;
      this.analyzer.id = resData.analyzerId;
      this.analyzer.tree = this.updateAnalyzerTree(resData.treeIds);
      this.showSuccess('分析器保存成功！');
      this.setTaskConfirm();
    });
  }

  updateAnalyzerTree(treeIds: string[]) {
    this.treeIds = treeIds;
    return this.analyzer.tree.map((item, idx) => {
      item.id = this.treeIds[idx];
      return item;
    });
  }

  setTaskConfirm() {
    let message = '是否前往配置任务?';
    let needSave = false;
    if (this.analyzer.id) {
      needSave = this.analyzer.tree.some(item => !item.id);
      message = needSave ? '保存当前分析器内容，并前往任务配置?' : '是否前往配置任务?';
    }
    this.confirmationService.confirm({
      message,
      header: '温馨提示',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (needSave) {
          this.updateAnalyzer();
        }
        setTimeout(() => {
          this.setPathTasks();
        }, 1000);
      },
      reject: () => {
        if (!this.analyzer.id) {
          this.addNewAnalyzer.emit({ id: this.analyzer.id, name: this.analyzer.name, type: this.analyzer.type });
        }
      }
    });
  }

  bindTaskTemp() {
    const taskBindForm = this.setTaskTempIds();
    if (taskBindForm) {
      this.caseService.bindTaskTemp(taskBindForm).subscribe(res => {
        this.addNewAnalyzer.emit({ id: this.analyzer.id, name: this.analyzer.name });
      });
    }
  }

  setPathTasks() {
    this.getTreeTaskTemps();
    this.showTaskView = true;
  }

  getTreeTaskTemps() {
    const analyzerId = this.analyzer.id;
    this.caseService.getTempByIds(analyzerId).subscribe(res => {
      const temps = (res as unknown as Result).data;
      this.analyzer.tree = this.analyzer.tree.map(item => {
        temps.map(temp => {
          if (temp.treeId === item.id) {
            item.taskTemplates = temp.taskTemplates;
          }
        });
        return item;
      });
    });
  }

  deleteAnalyzer() {
    const warning = this.analyzer.online
      ? '删除已上线的分析器会影响到CFBOT服务平台的分析结果，是否继续?'
      : '确认删除该分析器？';
    this.confirmationService.confirm({
      message: warning,
      header: '温馨提示',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const analyzerId = this.analyzer.id;
        this.caseService.deleteAnalyzerById(analyzerId).subscribe(() => {
          this.analyzerDeleted.emit(this.analyzer.id);
        });
      }
    });
  }

  showPreDialog() {
    const analyzerJson = this.setYamlData();
    this.dialogService.open(AnalyzerPreviewComponent, {
      data: {
        analyzer: analyzerJson
      },
      header: '预览分析器',
      width: '90%',
      closable: true
    });
  }


  clickMockAnalyzer() {
    const message = '是否需要先保存当前分析器内容?';
    this.confirmationService.confirm({
      message,
      header: '温馨提示',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateAnalyzer();
        setTimeout(() => {
          this.getCorpAnalyzerData(this.analyzer.id);
        }, 1000);
      },
      reject: () => {
        if (this.analyzer.id) {
          this.getCorpAnalyzerData(this.analyzer.id);
        }
      }
    });
  }

  getCorpAnalyzerData(analyzerId) {
    this.caseService.getCorpAnalyzerDataById(analyzerId).subscribe(res => {
      const corpAnalyzerData: CorpAnalyzerData[] = res.data ?? {};
      const ref = this.dialogService.open(CorpEditComponent, {
        header: `模拟分析 -- 编辑公司信息`,
        width: '70%',
        data: { corpAnalyzerData }
      });

      ref.onClose.subscribe((needAnalyze: boolean) => {
        if (needAnalyze) {
          if (this.timeId) { clearTimeout(this.timeId); }
          this.timeId = setTimeout(() => { this.reAnalyze(corpAnalyzerData, analyzerId); }, DELAY_TIME.DIALOG_REOPEN);
        }
      });
    });
  }

  reAnalyze(corpData: CorpAnalyzerData[], analyzerId: string) {
    this.caseService.getAnalyzerResultById(analyzerId).subscribe(res => {
      const analysisResult = res?.data as AnalysisResult;
      this.showAnalyzerResDialog(analysisResult, true);
    });
  }

  showAnalyzerResDialog(analysisResult: AnalysisResult, needLoading?: boolean) {
    const analyzerId = this.analyzer.id;
    const ref = this.dialogService.open(AnalyzerResultComponent, {
      header: `模拟分析 -- 分析结果`,
      width: '80%',
      data: { analysisResult, needLoading, analyzerId }
    });
    ref.onClose.subscribe((needAnalyze: boolean) => {
      if (needAnalyze) {
        if (this.timeId) { clearTimeout(this.timeId); }
        this.timeId = setTimeout(() => { this.getCorpAnalyzerData(analyzerId); }, DELAY_TIME.DIALOG_REOPEN);
      }
    });
  }

  private setYamlData() {
    const analyzerJson: Analyzer = JSON.parse(JSON.stringify(this.analyzer));
    const conditionsRequired: AnalyzerSelect[] = analyzerJson.analyzerInputs;
    analyzerJson.tree = this.setCond(analyzerJson, conditionsRequired);
    analyzerJson.applyOn = this.setApplyOn(analyzerJson, conditionsRequired);
    analyzerJson.analyzerInputs = this.setCondSelectToInput(analyzerJson.analyzerInputs as AnalyzerSelect[]);
    return analyzerJson;
  }

  private setApplyOn(analyzerJson: Analyzer, conditionsRequired) {
    let applyOn;
    if (typeof analyzerJson.applyOn !== 'string') {
      applyOn = analyzerJson.applyOn.reduce((total, current, index) => {
        let val = '';
        let inputVal = current.input.value;
        const inputTitle = current.input.title;
        const specialKeyVal = isSpecialVal(inputVal);
        if (specialKeyVal) {
          inputVal = setSpecialVal(specialKeyVal.key, inputVal, specialKeyVal.val, 'en');
        }
        if (inputTitle?.trim()) {
          const appLabel = conditionsRequired ?
            (conditionsRequired.filter(item => item.title === inputTitle)[0] as AnalyzerInput)?.title : '';
          val = inputTitle
            ? (index > 0 ? ' AND ' : '') +
            `${appLabel} ${(inputVal && inputVal !== 'NULL') ? `= ${inputVal}` : 'IS NULL'}`
            : '';
        }
        return total + val;
      }, '');
    }
    return applyOn;
  }

  private setCond(analyzerJson: Analyzer, conditionsRequired) {
    let tree;
    tree = analyzerJson.tree.map(item => {
      if (typeof item.cond !== 'string') {
        item.cond = item.cond.reduce((total, current, index) => {
          let val = '';
          let inputVal = current.input.value;
          const inputTitle = current.input.title;
          const specialKeyVal = isSpecialVal(inputVal);
          if (specialKeyVal) {
            inputVal = setSpecialVal(specialKeyVal.key, inputVal, specialKeyVal.val, 'en');
          }
          if (inputTitle?.trim()) {
            const condLabel = conditionsRequired ?
              (conditionsRequired.filter(input => input.title === inputTitle)[0] as AnalyzerInput)?.title : '';
            val = inputVal
              ? (index > 0 ? ' AND ' : '') + `${condLabel}
              ${(inputVal && inputVal !== 'NULL')
                ? `${current.input.symbol ? current.input.symbol : '='} ${inputVal}`
                : 'IS NULL'
              }`
              : '';
          }
          return total + val;
        }, '');
      }
      return item;
    });
    return tree;
  }

  private setTaskTempIds() {
    const analyzerJson = JSON.parse(JSON.stringify(this.analyzer));
    const bindTaskForm: TaskBind = analyzerJson.tree.map((item, idx) => {
      const treeId = item?.id;
      if (treeId) {
        const taskTemplateIds = item.taskTemplates.map(temp => temp.id).join(',');
        return { treeId, taskTemplateIds };
      }
    });
    return bindTaskForm;
  }

  private setCondSelectToInput(conditionData: AnalyzerSelect[]) {
    return conditionData.map(item => {
      return {
        id: item.id,
        title: item.label,
        value: item.title,
        inputType: item.inputType
      };
    });
  }

  showSuccess(detail: string) {
    this.messageService.clear();
    this.messageService.add({ severity: 'success', summary: '恭喜！', detail });
  }

  showErr(detail: string) {
    this.messageService.clear();
    this.messageService.add({ severity: 'error', summary: '警告：', detail });
  }

}
