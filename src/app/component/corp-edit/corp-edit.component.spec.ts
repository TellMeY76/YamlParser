import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpEditComponent } from './corp-edit.component';

describe('CorpEditComponent', () => {
  let component: CorpEditComponent;
  let fixture: ComponentFixture<CorpEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
