import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DialogService } from 'primeng';
import { TaskTemplateDialogComponent } from '../task-template-dialog/task-template-dialog.component';
import { TaskTemplate } from 'src/app/model/taskTemplate';
import { Analyzer } from 'src/app/model/Analyzer';
import { OPERATE } from 'src/app/config/operate';

@Component({
  selector: 'app-path-task',
  templateUrl: './path-task.component.html',
  styleUrls: ['./path-task.component.scss'],
  providers: [DialogService]
})
export class PathTaskComponent implements OnInit {
  @Input() analyzer: Analyzer;
  @Output() setTasks = new EventEmitter<boolean>();

  constructor(public dialogService: DialogService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  checkTaskTemplate(operate: string, tabIdx: number, temp?: TaskTemplate, index?: number) {
    const ref = this.dialogService.open(TaskTemplateDialogComponent, {
      header: `${operate === OPERATE.C ? '创建任务模板' : '更新任务模板'}`,
      width: '850px',
      data: {
        taskTemplate: temp ? temp : new TaskTemplate(),
        operate
      },
      contentStyle: { height: '560px', overflow: 'auto' },
      closable: false
    });

    ref.onClose.subscribe((res: TaskTemplate) => {
      if (res) {
        if (operate === OPERATE.C) {
          this.analyzer.tree[tabIdx].taskTemplates.push(res);
        } else {
          this.analyzer.tree[tabIdx].taskTemplates.splice(index, 1, res);
        }
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  hideTasks() {
    this.setTasks.emit(false);
  }

  removeTaskTemplate(tabIdx: number, index: number) {
    this.analyzer.tree[tabIdx].taskTemplates.splice(index, 1);
  }
}
