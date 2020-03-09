import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { CaseServiceService } from 'src/app/service/case-service.service';

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {

  constructor(public caseService: CaseServiceService) { }
  analyzers: MenuItem[];
  ngOnInit(): void {
    // this.getAnalyzerList();
    this.analyzers = [{
      label: '分析器列表',
      items: [
        { label: '分析器 1' },
        { label: '分析器 2' }
      ]
    }];
  }

  getAnalyzerList() {
    this.caseService.getAnalyzerList().subscribe(res => {
      if (res['data'])
        this.analyzers = res['data'];
    })
  }
}
