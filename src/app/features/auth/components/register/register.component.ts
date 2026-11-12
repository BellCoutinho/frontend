import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pwd = control.get('password');
  const confirm = control.get('confirmPassword');
  if (pwd && confirm && pwd.value !== confirm.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  currentStep = 1;
  totalSteps = 2;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        // Step 1 – Dados Pessoais
        first_name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        // Step 2 – Dados do Espaço
        space_name: ['', [Validators.required, Validators.minLength(2)]],
        space_address: ['', [Validators.required]],
        utility_unit_number: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  /* ---- Field helpers ---- */
  f(name: string) { return this.form.get(name)!; }

  getError(name: string): string {
    const ctrl = this.f(name);
    if (!ctrl || !ctrl.touched || ctrl.valid) return '';

    if (ctrl.errors?.['required']) return 'Campo obrigatório.';
    if (ctrl.errors?.['minlength']) {
      return `Mínimo de ${ctrl.errors['minlength'].requiredLength} caracteres.`;
    }
    if (ctrl.errors?.['email']) return 'Informe um e-mail válido.';
    return '';
  }

  getConfirmPasswordError(): string {
    const ctrl = this.f('confirmPassword');
    if (!ctrl || !ctrl.touched) return '';
    if (ctrl.errors?.['required']) return 'Confirmação obrigatória.';
    if (this.form.errors?.['passwordMismatch']) return 'As senhas não coincidem.';
    return '';
  }

  /* ---- Step 1 valid? ---- */
  get step1Valid(): boolean {
    const fields = ['first_name', 'last_name', 'email', 'password', 'confirmPassword'];
    return fields.every(f => this.f(f).valid) && !this.form.errors?.['passwordMismatch'];
  }

  nextStep(): void {
    if (!this.step1Valid) {
      ['first_name', 'last_name', 'email', 'password', 'confirmPassword'].forEach(f =>
        this.f(f).markAsTouched()
      );
      return;
    }
    this.currentStep = 2;
  }

  prevStep(): void {
    this.currentStep = 1;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    const { confirmPassword, ...payload } = this.form.value;

    this.authService.register(payload).subscribe({
      next: (user) => {
        this.loading = false;
        const fullUser = {
          ...payload,
          id: user?.user_id,
          user_id: user?.user_id,
          space_id: user?.space_id,
        };
        this.authService.storeUser(fullUser);
        this.successMessage = 'Conta criada com sucesso! Redirecionando...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.detail ?? 'Erro ao criar conta. Tente novamente.';
      },
    });
  }
}
