import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng';
import { TaskTemplate } from '../../model/taskTemplate';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { CaseServiceService } from 'src/app/service/case-service.service';
import { Result } from 'src/app/model/result';
import { OPERATE } from 'src/app/config/operate';

@Component({
  selector: 'app-task-template-dialog',
  templateUrl: './task-template-dialog.component.html',
  styleUrls: ['../case-edit/case-edit.component.scss'],
  providers: [MessageService],
})
export class TaskTemplateDialogComponent implements OnInit {
  zh: any;
  readonly TaskTypes = {
    bind: '1',
    new: '2'
  };
  rangeDates = '';
  taskType = this.TaskTypes.bind;
  taskTemps: TaskTemplate[] = [{ title: '1', dateType: 1 }];
  selectedTemp: {};
  dateTypes = [
    { label: '不设置', value: '1' },
    { label: '特定时间', value: '2' },
    { label: '固定时间', value: '3' }
  ];
  operate: string;

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public caseService: CaseServiceService,
    public config: DynamicDialogConfig) {
    this.operate = config.data.operate ?? OPERATE.C;
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
      startDays: new FormControl(0),
      endDays: new FormControl(0),
      start: new FormControl(''),
      end: new FormControl(''),
    });
    this.setFormValue();
    this.initCalendar();
    this.getTaskTemps();
  }

  getTaskTemps() {
    this.caseService.getTaskTemps().subscribe(res => {
      this.taskTemps = (res as unknown as Result)?.data as TaskTemplate[];
    });
  }

  setTaskType(e) {
    this.taskTemplate = e.value as TaskTemplate;
    this.setFormValue();
  }

  resetTaskType() {
    this.taskTemplate = this.config.data.taskTemplate ?? new TaskTemplate();
    this.templateForm.reset();
    if (this.taskType === this.TaskTypes.new) {
      this.selectedTemp = {};
      this.templateForm.enable();
    }
  }

  setFormValue() {
    this.templateForm.reset('');
    for (const field of Object.keys(this.taskTemplate)) {
      if (this.taskTemplate[field] && this.templateForm.get(field)) {
        let fidVal = this.taskTemplate[field];
        if ((field === 'start' || field === 'end') && typeof this.taskTemplate[field] === 'string') {
          fidVal = new Date(this.taskTemplate[field]);
        }
        this.templateForm.get(field).setValue(fidVal);
      }
    }
    if (this.taskType === this.TaskTypes.bind || this.operate === OPERATE.U) {
      this.templateForm.disable();
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
    if (this.taskType === this.TaskTypes.bind) {
      taskTemp.id = this.taskTemplate.id;
      this.ref.close(taskTemp);
    } else if (this.taskType === this.TaskTypes.new) {
      this.addTaskTemp(taskTemp);
    }
  }

  addTaskTemp(taskTemp: TaskTemplate) {
    this.caseService.addTaskTemp(taskTemp).subscribe(res => {
      taskTemp.id = (res as unknown as Result).data as string;
      this.ref.close(taskTemp);
    });
  }

  close() {
    this.ref.close(null);
  }

  cleanDateType() {
    if (!this.templateForm.disabled) {
      this.templateForm.get('startDays').reset(0);
      this.templateForm.get('endDays').reset(0);
      this.templateForm.get('start').reset('');
      this.templateForm.get('end').reset('');
      this.templateForm.clearValidators();
      const dateType = this.templateForm.get('dateType').value;
      if (dateType === 2) {
        this.templateForm.setValidators(identityRevealedValidator);
      }
    }
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
