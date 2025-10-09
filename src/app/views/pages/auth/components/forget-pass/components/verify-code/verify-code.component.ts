import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MousePressDirective, ButtonPromiseDirective } from '@app/shared/directives';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';
import { Subscription, finalize } from 'rxjs';
import { ForgetPasswordService } from '../../services/forget-password.service';
import { CountdownComponent } from '@app/shared/components/countdown/countdown.component';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputImportsModule,
    MatButtonModule,
    MousePressDirective,
    ButtonPromiseDirective,
    CountdownComponent
  ],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent implements OnInit, OnDestroy {

  // Subscription
  subscriptions: Subscription;

  // FormGroup
  form: FormGroup;

  // number 
  expiredTime: number;

  // boolean
  isSubmitLoading: boolean;
  isLoadingResendCode: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private forgetPasswordService: ForgetPasswordService
  ) {
    this.initLoginForm();
  }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  //#endregion

  //==================================
  // #region PUBLIC 
  //==================================
  resendCode(): void {
    this.sendCode();
  }

  //#endregion

  //==================================
  // #region PRIVATE 
  //==================================
  private sendCode(): void {
    const controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.isSubmitLoading = true;

    this.subscriptions = this.forgetPasswordService.sendCode(this.form).pipe(
      finalize(() => {
        this.isSubmitLoading = false;
      })
    ).subscribe(
      data => {
        // this.router.navigateByUrl(this.returnUrl);
      },
      error => {
      }
    )

  }
  //#endregion
  //==================================
  // #region FORM
  //==================================
  get f(): any {
    return this.form.controls;
  }

  initLoginForm(): void {
    this.form = this.formBuilder.group({
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      code: ['', Validators.required],
    });
  }

  onSubmit(): void {
    const controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.isSubmitLoading = true;

    this.subscriptions = this.forgetPasswordService.verifyCode(this.form).pipe(
      finalize(() => {
        this.isSubmitLoading = false;
      })
    ).subscribe(
      data => {
        // this.router.navigateByUrl(this.returnUrl);
      },
      error => {
      }
    )

  }

  //#endregion
}
