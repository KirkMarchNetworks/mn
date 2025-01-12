import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleMessageComponent } from './simple-message.component';

describe('ProjectOneClientComponentsSimpleMessageComponent', () => {
  let component: SimpleMessageComponent;
  let fixture: ComponentFixture<SimpleMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      SimpleMessageComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
