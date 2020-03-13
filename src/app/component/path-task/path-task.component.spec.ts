import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathTaskComponent } from './path-task.component';

describe('PathTaskComponent', () => {
  let component: PathTaskComponent;
  let fixture: ComponentFixture<PathTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
