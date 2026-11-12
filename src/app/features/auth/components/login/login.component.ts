import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.getToken()) {
      this.router.navigate(['/products']);
      return;
    }
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  getEmailError(): string {
    if (this.email.touched && this.email.invalid) {
      if (this.email.errors?.['required']) return 'E-mail é obrigatório.';
      if (this.email.errors?.['email']) return 'Informe um e-mail válido.';
    }
    return '';
  }

  getPasswordError(): string {
    if (this.password.touched && this.password.invalid) {
      if (this.password.errors?.['required']) return 'Senha é obrigatória.';
      if (this.password.errors?.['minlength']) return 'Mínimo de 6 caracteres.';
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.email.value, this.password.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.detail ?? 'Email ou senha inválidos.';
      },
    });
  }
}
