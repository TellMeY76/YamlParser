import { Component, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { CaseServiceService } from 'src/app/service/case-service.service';
import { ConfirmationService } from 'primeng/api';
import { AnalyzerPreviewComponent } from '../analyzer-preview/analyzer-preview.component';
import { DialogService } from 'primeng/dynamicDialog';
import { EventEmitter } from 'protractor';

interface Tree {
  name?: string,
  title?: string,
  condition: string | tableItem[],
  description?: string,
  summary?: string,
  advice?: string,
  status?: number,
  condConns?: boolean[],
  knowledgeIds?: string[]
}

interface AnalyzerInput {
  id?: string,
  title: string,
  value: string,
  symbol?: any;
  inputType?: number;
  connection?: boolean;
}

interface Analyzer {
  name: string,
  type: string,
  online: boolean,
  runMonth: string[],
  applyOn: string | tableItem[],
  tree: Tree[]
}

class tableItem {
  input: AnalyzerInput
}

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss'],
  providers: [ConfirmationService, DialogService]
})
export class CaseEditComponent implements OnInit {
  noSpecial: RegExp = /^[^<>*!]+$/
  numReg: RegExp = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/
  @Output() addTaskInPath = new EventEmitter()
  stepItems: MenuItem[] = [
    { label: '新建分析器' },
    { label: '添加任务' },
    { label: '完成' }
  ];
  StatusList = {
    0: '不满足',
    1: '满足',
    2: '不足',
  }
  dialogShow = false;
  tabIdx = 0;
  types: SelectItem[];
  month: SelectItem[] = [];
  conditions: AnalyzerInput[];
  conditionsRequired: AnalyzerInput[];
  symbols: SelectItem[];
  status: SelectItem[];
  KnowledgeIds: SelectItem[];
  preContent: string = '';
  hidefliter = false;
  yamldata: string;
  analyzer: Analyzer = {
    name: '',
    type: '--',
    online: false,
    runMonth: [],
    applyOn: [
      { input: { title: '', value: '' } }
    ],
    tree: [{
      condConns: [],
      condition: [
        { input: { title: '', symbol: '', value: '' } }
      ]
    }]
  };

  constructor(public caseService: CaseServiceService, public dialogService: DialogService, public confirmationService: ConfirmationService) {
    this.status = [{ label: '————', value: '' },
    { label: '不满足', value: 0 }, { label: '满足', value: 1 },
    { label: '条件不足', value: 2 }];
    this.KnowledgeIds = [
      { label: '————', value: '1' },
      { label: '税收筹划', value: '2' },
      { label: '项目申报', value: '3' },
      { label: '高企申报', value: '4' },
      { label: '机器查账', value: '5' }
    ]
    this.types = [
      { label: '————', value: '' },
      { label: '税收筹划', value: '税收筹划' },
      { label: '项目申报', value: '项目申报' },
      { label: '高企申报', value: '高企申报' },
      { label: '机器查账', value: '机器查账' }
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
    for (let i = 1; i <= 12; i++) {
      this.month.push({ label: `${i}月`, value: i + '' })
      this.analyzer.runMonth.push(i + '')
    }
  }

  getConditionInput() {
    this.caseService.getCondition().subscribe(res => {
      this.conditions = this.setConditionInput(res['data']);
    })
  }

  setConditionInput(conditionData) {
    const conditions = conditionData.map(item => {
      return {
        label: item.title,
        title: item.value,
        value: null,
        inputType: item.inputType
      }
    })
    return conditions;
  }

  tabChange(e) {
    this.tabIdx = e.index;
  }

  addConditionTab() {
    let newTab;
    this.confirmationService.confirm({
      message: '是否复制当前分析项的内容?',
      accept: () => {
        const _temp = JSON.stringify(this.analyzer.tree[this.tabIdx])
        newTab = JSON.parse(_temp);
        this.analyzer.tree.push(newTab)
      },
      reject: () => {
        newTab = {
          condition: [
            { input: { title: '', symbol: '', value: '', } }
          ]
        }
        this.analyzer.tree.push(newTab)
      }
    });
  }

  addCondition(treeItem) {
    treeItem.condition.push(
      { input: { title: '', symbol: '', value: '', connection: true } }
    );
  }

  conditionFldChange(e, condition, idx) {
    this.analyzer.tree = { ...condition, ...e.value }
  }

  addApplyOn(aplyOnList) {
    aplyOnList.push({ input: { title: '', value: '' } })
  }

  showPreDialog() {
    const analyzerJson = this.setYamldata()
    // const yaml = require('js-yaml');
    // try {
    //   this.yamldata = yaml.safeDump(analyzerJson);
    //   this.preContent = this.yamldata;
    //   console.log(this.yamldata);
    // } catch (e) {
    //   console.error(e)
    // }
    this.dialogService.open(AnalyzerPreviewComponent, {
      data: {
        analyzer: analyzerJson
      },
      header: "预览分析器",
      width: '50%'
    });
  }

  private setYamldata() {
    const _tmp = JSON.stringify(this.analyzer);
    const analyzerJson = JSON.parse(_tmp);
    analyzerJson.tree.forEach(item => {
      if (typeof item.condition !== 'string') {
        const cdt = item.condition.reduce((total, current, index) => {
          const val = current.input.title
            ? (index > 0 ? ' AND ' : '') + `${current.input.title} ${current.input.symbol ? current.input.symbol : '='} ${current.input.value}`
            : '';
          return total + val
        }, '')
        item.condition = cdt;
      }
    })
    if (typeof analyzerJson.applyOn !== 'string') {
      const apOn = analyzerJson.applyOn.reduce((total, current, index) => {

        const val = current.input.title
          ? (index > 0 ? ' AND ' : '') + `${current.input.title} = ${current.input.value}`
          : ''
        return total + val
      }, '')
      analyzerJson.applyOn = apOn;
    }
    return analyzerJson
  }

  toAddTask() {
    const analyzer = this.setYamldata()
    this.addTaskInPath.emit(analyzer)
  }
}
