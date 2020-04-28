import {
  ChangeDetectorRef, Component, OnInit, Output, EventEmitter, Input, OnChanges,
  ViewEncapsulation, ViewChildren, QueryList, AfterViewInit
} from '@angular/core';
import { ConfirmationService, Message, MessageService, SelectItem } from 'primeng/api';
import { CaseServiceService } from 'src/app/service/case-service.service';
import { DialogService, OverlayPanel } from 'primeng';
import { Analyzer, AnalyzerInput, TableItem, AnalyzerSelect, AnalyzerShow } from '../../model/Analyzer';
import { Result } from '../../model/result';
import { numReg, noSpecial } from '../../config/regex';
import { taxTypes, SelectTaxTypes } from 'src/app/config/taxType';
import { SPECIAL_DATES } from 'src/app/config/dateFormat';
import { AnalyzerStatus, ConditionSymbols } from 'src/app/config/analyzer';

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService],
  encapsulation: ViewEncapsulation.None
})
export class CaseEditComponent implements OnInit, OnChanges, AfterViewInit {

  readonly numReg = numReg;
  readonly noSpecial = noSpecial;
  tabIdx: number;
  types: SelectItem[];
  month: SelectItem[];
  symbols: SelectItem[];
  status: SelectItem[];
  KnowledgeIds: SelectItem[];
  @Input() analyzer: Analyzer;
  conditions: AnalyzerInput[];
  analyzerShow: SelectItem[];
  conditionsRequired: SelectItem[];
  messages: Message[];
  TaxTypes = taxTypes;
  readonly selectTaxTypes: SelectItem[] = SelectTaxTypes;

  @Output() setTasks = new EventEmitter<Analyzer>();
  specialDates = SPECIAL_DATES;
  public dates: Date[] = [];
  @ViewChildren(Date)
  public dateChildren: QueryList<Date>;
  selectedTabIdx = 0;
  selectedValue = '1';
  constructor(
    public caseService: CaseServiceService,
    public dialogService: DialogService,
    private messageService: MessageService,
    public confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.initVariable();
  }

  ngAfterViewInit() {
    this.dateChildren.changes.subscribe(() => {
      this.selectedTabIdx = this.analyzer.tree.length - 1;
      this.changeDetectorRef.detectChanges();
    });
  }

  setConditionInput(conditionData: AnalyzerInput[]) {
    this.setConditionsRequired();
    return conditionData.map(item => {
      return {
        id: item.id,
        label: item.title,
        title: item.value,
        value: null,
        inputType: item.inputType
      };
    });
  }

  setConditionsRequired() {
    const analyzerInputs = JSON.parse(JSON.stringify(this.analyzer.analyzerInputs)) as AnalyzerInput[];
    this.conditionsRequired = analyzerInputs ? analyzerInputs.map(item => {
      return { label: item.label, value: item.title };
    }) : [];
  }

  changeCondRequire(e) {
    const selectedCond = e.value as AnalyzerSelect[];
    this.conditionsRequired = selectedCond.map(item => {
      return { label: item.label, value: item.title };
    });
  }

  initVariable() {
    this.tabIdx = 0;
    this.month = [];
    this.messages = [];
    this.status = AnalyzerStatus;
    this.symbols = ConditionSymbols;
  }

  ngOnInit(): void {
    this.getConditionInput();
    this.getAnalyzerShow();
  }

  ngOnChanges() {
    this.setConditionsRequired();
  }

  initRunMonthList() {
    this.month = [...Array(12).keys()].map(item => {
      return { label: `${item + 1}月`, value: item + 1 + '' };
    });
  }

  getConditionInput() {
    this.caseService.getCondition().subscribe(res => {
      this.conditions = this.setConditionInput((res as unknown as Result).data ?? []);
    });
  }

  getAnalyzerShow() {
    this.caseService.getAnalyzerSHow().subscribe(res => {
      this.analyzerShow = this.setAnalyzerShow((res as unknown as Result).data ?? []);
    });
  }

  setAnalyzerShow(analyzerData: AnalyzerShow[]) {
    return analyzerData.map(item => {
      return {
        label: item.title,
        value: item
      };
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
        newTab.id = '';
        this.analyzer.tree = this.analyzer.tree.concat([newTab]);
      },
      reject: () => {
        newTab = {
          cond: [{ input: { title: '', symbol: '', value: '' } }]
        };
        this.analyzer.tree = this.analyzer.tree.concat([newTab]);
      }
    });
  }

  addCondition(treeItem) {
    treeItem.cond.push({
      input: { title: '', symbol: '', value: '', connection: true }
    });
  }

  addApplyOn(applyOnList) {
    applyOnList.push({ input: { title: '', value: '' } });
  }

  removeApplyOn(input: TableItem) {
    const index = (this.analyzer.applyOn as TableItem[]).indexOf(input);
    this.analyzer.applyOn = (this.analyzer.applyOn as TableItem[]).filter((val, i) => i !== index);
  }

  checkTabAfterClose(e) {
    const targetIndex = e.index;
    this.analyzer.tree = this.analyzer.tree.filter((val, i) => i !== targetIndex);
    if (this.tabIdx === targetIndex) {
      this.tabIdx = 0;
    }
  }

  removeCondition(cond: TableItem) {
    if ((this.analyzer.tree[this.tabIdx].cond as TableItem[]).length === 1) {
      this.messages = [];
      this.messages.push({ severity: 'warn', summary: '警告', detail: 'condition 不为空' });
      return;
    }
    const index = (this.analyzer.tree[this.tabIdx].cond as TableItem[]).indexOf(cond);
    this.analyzer.tree[this.tabIdx].cond = (this.analyzer.tree[this.tabIdx].cond as TableItem[]).filter((val, i) => i !== index);
  }

  setPathTasks() {
    this.setTasks.emit(this.analyzer);
  }

  showTCMsg(overlaypanel: OverlayPanel) {
    overlaypanel.hide();
    this.messageService.clear();
    this.messageService.add({ key: 'tc', severity: 'success', summary: '复制成功！', detail: '复制的内容可直接粘贴到输入框中使用' });
  }
}
