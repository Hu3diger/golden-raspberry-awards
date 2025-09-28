import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessage } from './error-message.component';

describe('ErrorMessage', () => {
  let component: ErrorMessage;
  let fixture: ComponentFixture<ErrorMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessage]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message when no message input is provided', () => {
    fixture.detectChanges();

    const messageElement = fixture.debugElement.nativeElement.querySelector('.error-message');
    expect(messageElement.textContent.trim()).toBe('An error occurred while loading data.');
  });

  it('should display custom message when message input is provided', () => {
    const customMessage = 'Failed to load data from server.';
    component.message = customMessage;
    fixture.detectChanges();

    const messageElement = fixture.debugElement.nativeElement.querySelector('.error-message');
    expect(messageElement.textContent.trim()).toBe(customMessage);
  });

  it('should have error icon element', () => {
    fixture.detectChanges();

    const iconElement = fixture.debugElement.nativeElement.querySelector('.error-icon');
    expect(iconElement).toBeTruthy();
    expect(iconElement.textContent.trim()).toBe('⚠️');
  });

  it('should have retry button', () => {
    component.showRetry = true;
    fixture.detectChanges();

    const retryButton = fixture.debugElement.nativeElement.querySelector('.retry-button');
    expect(retryButton).toBeTruthy();
    expect(retryButton.textContent.trim()).toBe(component.retryText);
  });

  it('should emit retry event when retry button is clicked', () => {
    spyOn(component.retry, 'emit');
    component.showRetry = true;
    fixture.detectChanges();

    const retryButton = fixture.debugElement.nativeElement.querySelector('.retry-button');
    retryButton.click();

    expect(component.retry.emit).toHaveBeenCalled();
  });

  it('should call onRetry method when retry button is clicked', () => {
    spyOn(component, 'onRetry');
    component.showRetry = true;
    fixture.detectChanges();

    const retryButton = fixture.debugElement.nativeElement.querySelector('.retry-button');
    retryButton.click();

    expect(component.onRetry).toHaveBeenCalled();
  });

  it('should have proper CSS classes for styling', () => {
    component.showRetry = true;
    fixture.detectChanges();

    const containerElement = fixture.debugElement.nativeElement.querySelector('.error-container');
    expect(containerElement).toBeTruthy();

    const iconElement = fixture.debugElement.nativeElement.querySelector('.error-icon');
    expect(iconElement).toBeTruthy();

    const messageElement = fixture.debugElement.nativeElement.querySelector('.error-message');
    expect(messageElement).toBeTruthy();

    const buttonElement = fixture.debugElement.nativeElement.querySelector('.retry-button');
    expect(buttonElement).toBeTruthy();
  });

  it('should be accessible with proper attributes', () => {
    fixture.detectChanges();

    const containerElement = fixture.debugElement.nativeElement.querySelector('.error-container');
    expect(containerElement.getAttribute('role')).toBe('alert');
    expect(containerElement.getAttribute('aria-live')).toBe('polite');
  });
});
