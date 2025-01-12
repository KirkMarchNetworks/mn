import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TusUploaderComponent } from './tus-uploader.component';

describe('ProjectOneClientComponentsTusUploaderComponent', () => {
  let component: TusUploaderComponent;
  let fixture: ComponentFixture<TusUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TusUploaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      TusUploaderComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
