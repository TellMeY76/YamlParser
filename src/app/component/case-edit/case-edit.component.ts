import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MenuItem } from 'primeng/api';

interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss']
})
export class CaseEditComponent implements OnInit {
  stepItems: MenuItem[] = [
    { label: '新建分析器' },
    { label: '添加任务' },
    { label: '完成' }
  ];

  cities1: SelectItem[];

  cities2: City[];

  selectedCities1: City[];

  selectedCities2: City[];

  constructor() {
    this.cities1 = [
      { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
      { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
      { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
      { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
      { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    ];

    //An array of cities
    this.cities2 = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }

  ngOnInit(): void {
    const yaml = require('js-yaml');
    const jsonObj = { type: '1', arr: [{ user: 'ww', age: 18, firiends: [{ name: 'we', age: 111 }, { name: 'we', age: 111 }, { name: 'we', age: 111 }] }, { user: 'wtj', age: 24 }] }
    try {
      const yamldata = yaml.safeDump(jsonObj)
      console.log(yamldata);
    } catch (e) {
      console.error(e)
    }
  }
  addCondition() {
    console.log('click')
  }
}
