import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzerResultComponent } from './analyzer-result.component';

describe('AnalyzerResultComponent', () => {
  let component: AnalyzerResultComponent;
  let fixture: ComponentFixture<AnalyzerResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzerResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzerResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
