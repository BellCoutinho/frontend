import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.form.get('email')!;
  }

  getEmailError(): string {
    if (this.email.touched && this.email.invalid) {
      if (this.email.errors?.['required']) return 'E-mail é obrigatório.';
      if (this.email.errors?.['email']) return 'Informe um e-mail válido.';
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
    this.authService.forgotPassword(this.email.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage =
          'Se este e-mail estiver cadastrado, você receberá as instruções em breve.';
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.detail ?? 'Erro ao processar. Tente novamente.';
      },
    });
  }
}
