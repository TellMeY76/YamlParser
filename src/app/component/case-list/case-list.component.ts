import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { CaseServiceService } from 'src/app/service/case-service.service';
import { Result } from '../../model/result';
import { Analyzer, AnalyzerInput, AnalyzerName } from 'src/app/model/Analyzer';
import { DialogService } from 'primeng';
import { CreateCaseDialogComponent } from '../create-case-dialog/create-case-dialog.component';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {

  analyzers: MenuItem[];
  stableMenuItem: MenuItem[] = [{
    label: '操作',
    items: [
      {
        label: '新建分析器',
        icon: 'pi pi-fw pi-plus',
        command: () => {
          this.openAddDialog();
        }
      }
    ]
  }];
  @Output() setAnalyzer = new EventEmitter<Analyzer>();

  constructor(public caseService: CaseServiceService, public dialogService: DialogService) {
  }

  ngOnInit(): void {

    this.getAnalyzerList();

  }

  openAddDialog() {
    const ref = this.dialogService.open(CreateCaseDialogComponent, {
      header: '新建分析器',
      width: '1000px',
      data: {},
      contentStyle: { height: '820px', overflow: 'auto' },
      closable: true
    });

    ref.onClose.subscribe(res => {
      this.getAnalyzerList();
      // const labelItems = this.analyzers.find(item => item.label === res.type);
      // const items: MenuItem[] = [{
      //   label: res.name, command: () => {
      //     this.getAnalyzerById(res.id);
      //   }
      // }];
      // if (labelItems) {
      //   labelItems.items.concat(items);
      // } else {
      //   const label = res.type;
      //   this.analyzers.concat([{ label, items }] ?? []);
      // }

    });

  }

  getAnalyzerList() {
    this.caseService.getAnalyzerList().subscribe(res => {
      if (res) {
        const labels = (res as unknown as Result).data.map(item => {
          const label = item.analyzerType;
          const items = (item.analyzerNames as AnalyzerName[]).map(analyzerName => {
            const command = () => {
              this.getAnalyzerById(analyzerName.id);
            };
            return { label: analyzerName.name, command };
          });
          return { label, items };
        });
        this.analyzers = this.stableMenuItem.concat(labels ?? []);
      }
    });
  }

  getAnalyzerById(analyzerId: string) {
    this.caseService.getAnalyzerById(analyzerId).subscribe(res => {
      const resData = (res as unknown as Result).data;
      this.setAnalyzer.emit(this.setAnalyzerConditions(resData));
    });
  }

  setAnalyzerConditions(analyzer: Analyzer) {
    const newAnalyzer = JSON.parse(JSON.stringify(analyzer)) as Analyzer;
    if (typeof newAnalyzer.applyOn === 'string') {
      newAnalyzer.applyOn = this.splitBySymbol(newAnalyzer.applyOn);
    }

    newAnalyzer.tree = newAnalyzer.tree.map(treeItem => {
      if (typeof treeItem.cond === 'string') {
        treeItem.cond = this.splitBySymbol(treeItem.cond);
      }
      return treeItem;
    });
    if (newAnalyzer.analyzerInputs && newAnalyzer.analyzerInputs.length) {
      newAnalyzer.analyzerInputs = this.setConditionInput(newAnalyzer.analyzerInputs as AnalyzerInput[]);
    }
    return newAnalyzer;
  }

  private setConditionInput(conditionData: AnalyzerInput[]) {
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

  splitBySymbol(str) {
    if (str) {
      const arr = str.split('AND');
      const symbolReg = /[~!><=]/g;
      return arr.map(item => {
        let title: string;
        let symbol: string;
        let value: string;
        const symbolArr = item.match(symbolReg);
        if (symbolArr) {
          symbol = item.match(symbolReg).join('');
          const keyValue = item.split(symbol);
          title = keyValue[0].trim();
          value = keyValue[1].trim();
        }
        return { input: { title, symbol, value } };
      });
    } else {
      return [{ input: { title: '', symbol: '', value: '' } }];
    }
  }
}
