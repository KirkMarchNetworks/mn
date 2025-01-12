import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IntelligentRetrievalComponent } from './intelligent-retrieval.component';

describe('ProjectOneClientFeaturesImagesComponent', () => {
  let component: IntelligentRetrievalComponent;
  let fixture: ComponentFixture<IntelligentRetrievalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntelligentRetrievalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IntelligentRetrievalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
