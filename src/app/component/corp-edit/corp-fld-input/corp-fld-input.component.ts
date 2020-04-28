import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CORP_INPUT_TYPE_VAL } from 'src/app/config/corpInfo';

@Component({
  selector: 'app-fld-input',
  templateUrl: './corp-fld-input.component.html',
  styleUrls: ['./corp-fld-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CorpFldInputComponent implements OnInit {
  @Input() corpFldName: string;
  @Input() formCtrlName: string;
  @Input() corpForm: FormGroup;
  @Input() formFldType: number;
  inputType = CORP_INPUT_TYPE_VAL;
  zh = {
    firstDayOfWeek: 0,
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'yy-mm-dd',
    weekHeader: 'Wk'
  };
  dateFormat: 'yy-mm-dd';
  get isValid() { return this.corpForm.controls[this.formCtrlName].valid; }
  constructor() { }

  ngOnInit(): void {
  }

}
