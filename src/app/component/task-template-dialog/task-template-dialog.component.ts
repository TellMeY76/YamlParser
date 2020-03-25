import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng';
import { TaskTemplate } from '../../model/taskTemplate';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-task-template-dialog',
  templateUrl: './task-template-dialog.component.html',
  styleUrls: ['../case-edit/case-edit.component.scss'],
  providers: [MessageService],
})
export class TaskTemplateDialogComponent implements OnInit {
  zh: any;
  rangeDates = '';
  dateTypes = [
    { label: '不设置', value: '1' },
    { label: '特定时间', value: '2' },
    { label: '固定时间', value: '3' }
  ];
  templates: TaskTemplate[] = [
    { title: '不关联现有任务', dateType: 1 },
    { title: '任务模板1', dateType: 1 },
    { title: '任务模板2', dateType: 1 },
    { title: '任务模板2', dateType: 1 }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig) {
    this.taskTemplate = config.data.taskTemplate ?? new TaskTemplate();
  }

  taskTemplate: TaskTemplate;
  templateForm: FormGroup;

  static getYearMonth(dates: Date): string {
    const Year: any = dates.getFullYear() < 10 ? '000' + dates.getFullYear() : dates.getFullYear();
    const Months: any = (dates.getMonth() + 1) < 10 ? '0' + (dates.getMonth() + 1) : (dates.getMonth() + 1);
    const Day: any = dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate();
    return `${Year}-${Months}-${Day}`;
  }

  ngOnInit() {
    this.templateForm = this.fb.group({
      title: new FormControl('', Validators.required),
      abstract: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      dateType: new FormControl('', Validators.required),
      startDays: new FormControl(''),
      endDays: new FormControl(''),
      start: new FormControl(''),
      end: new FormControl(''),
    });
    this.setFormValue();
    this.initCalendar();
  }

  setFormValue() {
    this.templateForm.reset('');
    for (const field of Object.keys(this.taskTemplate)) {
      if (this.taskTemplate[field]) {
        this.templateForm.get(field).setValue(this.taskTemplate[field]);
      }
    }
  }

  initCalendar() {
    this.zh = {
      firstDayOfWeek: 0,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Today',
      clear: 'Clear',
      dateFormat: 'mm/dd/yy',
      weekHeader: 'Wk'
    };
  }

  save() {
    const taskTemp = this.templateForm.value;
    if (taskTemp.dateType === 3) {
      taskTemp.start = TaskTemplateDialogComponent.getYearMonth(taskTemp.start);
      taskTemp.end = TaskTemplateDialogComponent.getYearMonth(taskTemp.end);
    }
    this.ref.close(taskTemp);
  }

  close() {
    this.ref.close(null);
  }

  cleanDateType(e) {
    this.templateForm.get('startDays').reset('');
    this.templateForm.get('endDays').reset('');
    this.templateForm.get('start').reset('');
    this.templateForm.get('end').reset('');
    this.templateForm.clearValidators();
    const dateType = this.templateForm.get('dateType').value;

    if (dateType === 2) {
      this.templateForm.setValidators(identityRevealedValidator);
    }
  }

  selectRangeDate(e) {
    console.log('selectRangeDate', this.rangeDates)
  }
}

export const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const startDays = control.get('startDays');
  const endDays = control.get('endDays');

  if (startDays && startDays.value === '' || endDays && endDays.value === '') {
    return { dateRequired: true };
  }

  if (startDays && endDays && startDays.value > endDays.value) {
    return { dateError: true };
  }
  return null;
};
