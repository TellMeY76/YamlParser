import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, Message, MessageService, SelectItem } from 'primeng/api';
import { CaseServiceService } from 'src/app/service/case-service.service';
import { AnalyzerPreviewComponent } from '../analyzer-preview/analyzer-preview.component';
import { DialogService } from 'primeng';
import { Analyzer, AnalyzerInput, TableItem } from '../../model/Analyzer';
import { Result } from '../../model/result';
import { numReg, noSpecial } from '../../config/regex';
import { TaskTemplate } from '../../model/taskTemplate';
import { TaskTemplateDialogComponent } from '../task-template-dialog/task-template-dialog.component';

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService]
})
export class CaseEditComponent implements OnInit {

  readonly numReg = numReg;
  readonly noSpecial = noSpecial;
  tabIdx: number;
  types: SelectItem[];
  month: SelectItem[];
  symbols: SelectItem[];
  status: SelectItem[];
  KnowledgeIds: SelectItem[];
  analyzer: Analyzer;
  conditions: AnalyzerInput[];
  conditionsRequired: AnalyzerInput[];
  messages: Message[];

  constructor(
    public caseService: CaseServiceService,
    public dialogService: DialogService,
    public confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.initVariable();
  }

  static setConditionInput(conditionData: AnalyzerInput[]) {
    return conditionData.map(item => {
      return {
        label: item.title,
        title: item.value,
        value: null,
        inputType: item.inputType
      };
    });
  }

  initVariable() {
    this.tabIdx = 0;
    this.month = [];
    this.messages = [];
    this.analyzer = new Analyzer();
    this.status = [
      { label: '不满足', value: 0 },
      { label: '满足', value: 1 },
      { label: '条件不足', value: 2 }
    ];
    this.KnowledgeIds = [
      { label: '税收筹划', value: '2' },
      { label: '项目申报', value: '3' },
      { label: '高企申报', value: '4' },
      { label: '机器查账', value: '5' }
    ];
    this.types = [
      { label: '税收筹划', value: '税收筹划' },
      { label: '项目申报', value: '项目申报' },
      { label: '创业补贴', value: '创业补贴' },
      { label: '融资贷款', value: '融资贷款' },
      { label: '高企申报', value: '高企申报' },
      { label: '机器查账', value: '机器查账' },
      { label: '软件企业', value: '软件企业' }
    ];
    this.symbols = [
      { label: '=', value: '=' },
      { label: '>', value: '>' },
      { label: '<', value: '<' },
      { label: '>=', value: '>=' },
      { label: '<=', value: '<=' },
      { label: '!=', value: '!=' }
    ];
  }

  ngOnInit(): void {
    this.getConditionInput();
    this.initRunMonthList();
  }

  initRunMonthList() {
    for (let i = 1; i <= 12; i++) {
      this.month.push({ label: `${i}月`, value: i + '' });
      this.analyzer.runMonth.push(i + '');
    }
  }

  getConditionInput() {
    this.caseService.getCondition().subscribe(res => {
      this.conditions = CaseEditComponent.setConditionInput((res as unknown as Result).data ?? []);
    });
  }

  tabChange(e) {
    this.tabIdx = e.index;
  }

  addConditionTab() {
    let newTab;
    this.confirmationService.confirm({
      message: '是否复制当前分析项的内容?',
      accept: () => {
        newTab = JSON.parse(JSON.stringify(this.analyzer.tree[this.tabIdx]));
        this.analyzer.tree.push(newTab);
      },
      reject: () => {
        newTab = {
          condition: [{ input: { title: '', symbol: '', value: '' } }]
        };
        this.analyzer.tree.push(newTab);
      }
    });
  }

  addCondition(treeItem) {
    treeItem.condition.push({
      input: { title: '', symbol: '', value: '', connection: true }
    });
  }

  addApplyOn(applyOnList) {
    applyOnList.push({ input: { title: '', value: '' } });
  }

  removeApplyOn(input: TableItem) {
    if ((this.analyzer.applyOn as TableItem[]).length === 1) {
      this.messages = [];
      this.messages.push({ severity: 'warn', summary: '警告', detail: 'applyOn 不为空' });
      return;
    }
    const index = (this.analyzer.applyOn as TableItem[]).indexOf(input);
    this.analyzer.applyOn = (this.analyzer.applyOn as TableItem[]).filter((val, i) => i !== index);
  }

  showPreDialog() {
    console.log(this.conditionsRequired);
    const analyzerJson = this.setYamlData();
    this.dialogService.open(AnalyzerPreviewComponent, {
      data: {
        analyzer: analyzerJson
      },
      header: '预览分析器',
      width: '90%',
      height: '700px',
      closable: false
    });
  }

  private setYamlData() {
    const analyzerJson = JSON.parse(JSON.stringify(this.analyzer));
    analyzerJson.tree.forEach(item => {
      if (typeof item.condition !== 'string') {
        item.condition = item.condition.reduce((total, current, index) => {
          const condLabel = this.conditionsRequired ?
            (this.conditionsRequired.filter(input => input.title === current.input.title)[0] as AnalyzerInput).label : '';
          const val = current.input.title
            ? (index > 0 ? ' AND ' : '') +
            `${condLabel} ${
            current.input.symbol ? current.input.symbol : '='
            } ${current.input.value}`
            : '';
          return total + val;
        }, '');
      }
    });
    if (typeof analyzerJson.applyOn !== 'string') {
      analyzerJson.applyOn = analyzerJson.applyOn.reduce((total, current, index) => {
        const appLabel = this.conditionsRequired ?
          (this.conditionsRequired.filter(input => input.title === current.input.title)[0] as AnalyzerInput).label : '';
        const val = current.input.title
          ? (index > 0 ? ' AND ' : '') +
          `${appLabel} = ${current.input.value}`
          : '';
        return total + val;
      }, '');
    }
    return analyzerJson;
  }

  checkTabAfterClose(e) {
    const targetIndex = e.index;
    this.analyzer.tree = this.analyzer.tree.filter((val, i) => i !== targetIndex);
    if (this.tabIdx === targetIndex) {
      this.tabIdx = 0;
    }
  }

  removeCondition(condition: TableItem) {
    if ((this.analyzer.tree[this.tabIdx].condition as TableItem[]).length === 1) {
      this.messages = [];
      this.messages.push({ severity: 'warn', summary: '警告', detail: 'condition 不为空' });
      return;
    }
    const index = (this.analyzer.tree[this.tabIdx].condition as TableItem[]).indexOf(condition);
    this.analyzer.tree[this.tabIdx].condition = (this.analyzer.tree[this.tabIdx].condition as TableItem[]).filter((val, i) => i !== index);
  }

  checkTaskTemplate(operate: string, temp?: TaskTemplate, index?: number) {
    const ref = this.dialogService.open(TaskTemplateDialogComponent, {
      header: `${operate === 'create' ? '创建任务模板' : '更新任务模板'}`,
      width: '850px',
      data: {
        taskTemplate: temp ? temp : new TaskTemplate(),
      },
      contentStyle: { height: '560px', overflow: 'auto' },
      closable: false
    });

    ref.onClose.subscribe((res: TaskTemplate) => {
      if (res) {
        if (operate === 'create') {
          this.analyzer.tree[this.tabIdx].taskTemplates.push(res);
        } else {
          this.analyzer.tree[this.tabIdx].taskTemplates.splice(index, 1, res);
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  removeTaskTemplate(index: number) {
    this.analyzer.tree[this.tabIdx].taskTemplates.splice(index, 1);
  }

  upperCaseName() {
    const pathName = this.analyzer.tree[this.tabIdx].name;
    if (pathName) {
      this.analyzer.tree[this.tabIdx].name = pathName.toUpperCase();
    }
  }
}