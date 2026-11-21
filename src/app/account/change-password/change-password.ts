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


    validateTree(path, ({ valueOf, fieldTree }) => {
      const current = valueOf(path.currentPassword);
      const newPwd = valueOf(path.newPassword);
      const confPwd = valueOf(path.confirmPassword);

       const errors =[];
      if (newPwd && newPwd === current) {
        errors.push({
          kind: 'reused',
          message: 'New password cannot be the same as the current password',
          fieldTree: fieldTree.newPassword,
        });
      }

      if (confPwd && confPwd !== newPwd) {
        errors.push({
          kind: 'mismatch',
          message: 'Confirm password must match new password',
          fieldTree: fieldTree.confirmPassword,
        });
      }

      if (errors.length > 0) {
        return errors;
      }

      return null;
    });

    
    
  });

   readonly passwordForm = form(this.model, this.changeSchema);

   

   onSubmit(event: Event) {
    event.preventDefault();
  }  
}
