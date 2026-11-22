import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePassword } from './change-password';

describe('ChangePassword', () => {
  let component: ChangePassword;
  let fixture: ComponentFixture<ChangePassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePassword],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('ChangePassword Form Validation', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ChangePassword>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePassword],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassword);
    await fixture.whenStable();
  });

  it('confirm password should signals errors when is not matching new password and not empty', async () => {
    const component = fixture.componentInstance;
    component.model.set({
      currentPassword: 'currentPassword',
      newPassword: 'newPassword123',
      confirmPassword: 'differentPassword',
    });
    await fixture.whenStable();

    const confirmKinds = component.passwordForm
      .confirmPassword()
      .errors()
      .map((error) => error.kind);
    expect(confirmKinds).toContain('mismatch');

    const newKinds = component.passwordForm.newPassword().errors().map((e) => e.kind);
    expect(newKinds).not.toContain('mismatch');
    expect(component.passwordForm().errors()).toEqual([]);

    component.model.set({
      currentPassword: 'currentPassword',
      newPassword: 'differentPassword',
      confirmPassword: 'differentPassword',
    });
    await fixture.whenStable();

    const confirmAfter = component.passwordForm
      .confirmPassword()
      .errors()
      .map((e) => e.kind);
    expect(confirmAfter).not.toContain('mismatch');
  });

  it('should have error when new password is less than 8 characters', async () => {
    const component = fixture.componentInstance;
    component.model.set({
      currentPassword: 'currentPassword',
      newPassword: 'short',
      confirmPassword: 'short',
    });
    await fixture.whenStable(); // ← added: wait for the form to settle

    const newPasswordKinds = component.passwordForm
      .newPassword()
      .errors()
      .map((error) => error.kind);
    expect(newPasswordKinds).toContain('minLength');
  });

  it('includes child errors in the form errors', async () => {
    const component = fixture.componentInstance;
    component.model.set({
      currentPassword: 'currentPassword',
      newPassword: 'short',
      confirmPassword: 'different1234',
    });
    await fixture.whenStable();
    fixture.detectChanges(); // Ensure the component reflects the latest state

    const formErrors = component.passwordForm().errors();
    const errorSummaries = component.passwordForm().errorSummary();
    const errorKinds = errorSummaries.flatMap((error) => error.kind);
    expect(formErrors.length).toBe(0);
    expect(errorKinds).toContain('minLength');
    expect(errorKinds).toContain('mismatch');
    expect(component.passwordForm().errorSummary().length).toBe(2);
    
  });
});