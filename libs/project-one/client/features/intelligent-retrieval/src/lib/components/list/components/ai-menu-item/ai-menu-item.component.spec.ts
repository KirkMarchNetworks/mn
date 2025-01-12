import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AiMenuItemComponent } from './ai-menu-item.component';

describe('ProjectOneClientFeaturesImagesComponent', () => {
  let component: AiMenuItemComponent;
  let fixture: ComponentFixture<AiMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AiMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
