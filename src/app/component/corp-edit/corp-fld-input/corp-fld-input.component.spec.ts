import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpFldInputComponent } from './corp-fld-input.component';

describe('CorpFldInputComponent', () => {
  let component: CorpFldInputComponent;
  let fixture: ComponentFixture<CorpFldInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpFldInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpFldInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
