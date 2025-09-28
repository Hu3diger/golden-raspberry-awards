import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message when no message input is provided', () => {
    fixture.detectChanges();

    const messageElement = fixture.debugElement.nativeElement.querySelector('.loading-text');
    expect(messageElement.textContent.trim()).toBe('Loading...');
  });

  it('should display custom message when message input is provided', () => {
    const customMessage = 'Loading data, please wait...';
    component.message = customMessage;
    fixture.detectChanges();

    const messageElement = fixture.debugElement.nativeElement.querySelector('.loading-text');
    expect(messageElement.textContent.trim()).toBe(customMessage);
  });

  it('should have loading spinner element', () => {
    fixture.detectChanges();

    const spinnerElement = fixture.debugElement.nativeElement.querySelector('.css-spinner');
    expect(spinnerElement).toBeTruthy();
  });

  it('should have proper CSS classes for styling', () => {
    fixture.detectChanges();

    const containerElement = fixture.debugElement.nativeElement.querySelector('.loading-container');
    expect(containerElement).toBeTruthy();

    const spinnerElement = fixture.debugElement.nativeElement.querySelector('.css-spinner');
    expect(spinnerElement).toBeTruthy();

    const textElement = fixture.debugElement.nativeElement.querySelector('.loading-text');
    expect(textElement).toBeTruthy();
  });
});
