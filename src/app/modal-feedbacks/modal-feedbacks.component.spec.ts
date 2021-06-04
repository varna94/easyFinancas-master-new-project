import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFeedbacksComponent } from './modal-feedbacks.component';

describe('ModalFeedbacksComponent', () => {
  let component: ModalFeedbacksComponent;
  let fixture: ComponentFixture<ModalFeedbacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFeedbacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFeedbacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
