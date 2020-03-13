import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  breadMenuItems: MenuItem[];
  menuHome: MenuItem;

  ngOnInit() {
    this.breadMenuItems = [
      {label: '首页'},
      {label: '分析器列表'},
      {label: '高企申报'}
    ];

    this.menuHome = {icon: 'pi pi-home'};
  }
}
