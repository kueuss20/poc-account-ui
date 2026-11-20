import { Component, computed, signal, WritableSignal } from '@angular/core';
import { form, FormField, minLength, required, schema, validate, validateTree } from '@angular/forms/signals';

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  imports: [FormField],
  selector: 'app-change-password',
  styleUrl: './change-password.css',
  templateUrl: './change-password.html',
})
export class ChangePassword {
   readonly model:WritableSignal<PasswordChange> = signal<PasswordChange>({ currentPassword: '', newPassword: '', confirmPassword: '' });
   
   changeSchema = schema<PasswordChange>((path) => {
    required(path.currentPassword, { message: 'Current password is required' });
    required(path.newPassword, { message: 'New password is required' });
    minLength(path.newPassword, 8, { message: 'New password must be at least 8 characters long' });
    required(path.confirmPassword, { message: 'Confirm password is required' });

    validateTree(path.newPassword, ({ value, valueOf }) => {
      const current = valueOf(path.currentPassword);
      const newPwd = value();

      if (newPwd && newPwd === current) {
        return {
          kind: 'reused',
          message: 'New password cannot be the same as the current password',
        };
      }

      return null;
    });

    required(path.confirmPassword, { message: 'Confirm password is required' });

    validateTree(path.confirmPassword, ({ value, valueOf }) => {
      const newPassword = valueOf(path.newPassword);
      const confPwd = value();

      if (newPassword!=='' && confPwd !== newPassword) {
        return {
          kind: 'mismatch',
          message: 'Confirm password must match new password',
        };
      }

      return null;
    });
  });

   readonly passwordForm = form(this.model, this.changeSchema);

   errorCount=computed(() => {
    const errors = this.passwordForm.newPassword().errors().length+
    this.passwordForm.confirmPassword().errors().length+
    this.passwordForm.currentPassword().errors().length;
    return errors;
  });

   onSubmit(event: Event) {
    event.preventDefault();
  }  
}
