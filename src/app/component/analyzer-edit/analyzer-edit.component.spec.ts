import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzerEditComponent } from './analyzer-edit.component';

describe('AnalyzerEditComponent', () => {
  let component: AnalyzerEditComponent;
  let fixture: ComponentFixture<AnalyzerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
