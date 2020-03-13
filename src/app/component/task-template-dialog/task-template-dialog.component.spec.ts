import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTemplateDialogComponent } from './task-template-dialog.component';

describe('TaskTemplateDialogComponent', () => {
  let component: TaskTemplateDialogComponent;
  let fixture: ComponentFixture<TaskTemplateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskTemplateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
