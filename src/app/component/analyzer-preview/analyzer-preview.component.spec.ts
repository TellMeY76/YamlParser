import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzerPreviewComponent } from './analyzer-preview.component';

describe('AnalyzerPreviewComponent', () => {
  let component: AnalyzerPreviewComponent;
  let fixture: ComponentFixture<AnalyzerPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzerPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzerPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
