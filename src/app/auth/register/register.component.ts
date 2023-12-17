import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(180),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      { validators: this.checkPasswords }
    );
  }

  async register() {
    if (this.registerForm.invalid) return;

    if (
      await this.authService.register({
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
      })
    ) {
      this.router.navigate(['/search']);
    }
  }

  private checkPasswords(control: FormGroup) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password?.value !== confirmPassword?.value
      ? { missMatch: true }
      : null;
  }

  get getErrorLabel() {
    if (this.registerForm.errors?.['required']) return ['Fields are required'];

    if (!!this.registerForm.controls?.['password']?.errors?.['minlength'])
      return [
        `Minimal length is ${this.registerForm.controls?.['password']?.errors?.['minlength']?.requiredLength}`,
      ];

    if (this.registerForm.errors?.['missMatch'])
      return ['Passwords do not match'];

    return this.authService.errors?.errors.map((error) => error.message);
  }
}
