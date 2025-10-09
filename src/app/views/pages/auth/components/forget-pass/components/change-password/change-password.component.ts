import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { ForgetPasswordService } from '../../services/forget-password.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MousePressDirective, ButtonPromiseDirective } from '@app/shared/directives';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputImportsModule,
    MatButtonModule,
    MousePressDirective,
    ButtonPromiseDirective
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  // Subscription
  subscriptions: Subscription;

  // FormGroup
  form: FormGroup;

  // boolean
  isSubmitLoading: boolean;

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
  // #region FORM
  //==================================
  get f(): any {
    return this.form.controls;
  }

  initLoginForm(): void {
    this.form = this.formBuilder.group({
      mobile: ['', Validators.required],
      hash: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
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