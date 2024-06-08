import { JsonPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  private readonly maxNameLength = 16;
  private readonly fb = inject(FormBuilder);
  private router = inject(Router);

  signupForm = this.fb.group({
    firstName: [
      '',
      [
        Validators.required,
        Validators.maxLength(this.maxNameLength),
        this.badNameValidator('bidzina'),
      ],
    ],
    lastName: [
      '',
      [Validators.required, Validators.maxLength(this.maxNameLength)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  get controls() {
    return this.signupForm.controls;
  }

  ngOnInit(): void {
    // ერთი ვარიანტი - მხოლოდ კონტროლს ვალიდაცია...
    // this.controls.confirmPassword.setValidators(
    //   this.confirmPasswordValidator(this.controls.password),
    // );
    // this.controls.password.valueChanges.subscribe(() => {
    //   this.controls.confirmPassword.updateValueAndValidity();
    // });
    // მეორე ვარიანტი - მთელი ფორმის ჯგუფის ვალიდაცია
  }

  onAutofill() {
    // ცალკე კონტროლებზე
    // this.controls.firstName.setValue("John");
    // this.controls.lastName.setValue("Doe");

    // FormGroup-ით
    this.signupForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@mail.com',
    });
  }

  onSubmit() {
    this.signupForm.addValidators(this.passwordsMatchValidator());

    this.signupForm.valueChanges.subscribe((value) => {
      this.router.navigate(['/auth/sign-up'], {
        queryParams: value,
      });
    });
  }

  badNameValidator(pattern: string): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      return control.value.includes(pattern)
        ? { badName: `pattern "${pattern}" is prohibited!` }
        : null;
    };
  }

  // confirmPasswordValidator(compareTo: FormControl<string | null>): ValidatorFn {
  //   return (control: AbstractControl<string>): ValidationErrors | null => {
  //     return control.value === compareTo.value
  //       ? null
  //       : { confirmPassword: 'Passwords do not match!' };
  //   };
  // }
  //

  passwordsMatchValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.password === control.value.confirmPassword
        ? null
        : {
            passwordsMatch: 'Passwords do not match!',
          };
    };
  }
}
