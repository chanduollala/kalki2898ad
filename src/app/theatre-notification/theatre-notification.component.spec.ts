import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheatreNotificationComponent } from './theatre-notification.component';

describe('TheatreNotificationComponent', () => {
  let component: TheatreNotificationComponent;
  let fixture: ComponentFixture<TheatreNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheatreNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheatreNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
