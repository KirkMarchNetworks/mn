import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementMenuComponent } from './user-management-menu.component';

describe('ProjectOneClientFeaturesImagesComponent', () => {
  let component: UserManagementMenuComponent;
  let fixture: ComponentFixture<UserManagementMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserManagementMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
