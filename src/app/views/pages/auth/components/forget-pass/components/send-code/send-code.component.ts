import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MousePressDirective, ButtonPromiseDirective } from '@app/shared/directives';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';
import { finalize, Subscription } from 'rxjs';
import { ForgetPasswordService } from '../../services/forget-password.service';
import { IResultForMoveStepsModel } from '../../models/result-move-step.model';
import { AlertService } from '@app/core/services';

@Component({
  selector: 'app-send-code',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputImportsModule,
    MatButtonModule,
    MousePressDirective,
    ButtonPromiseDirective
  ],
  templateUrl: './send-code.component.html',
  styleUrl: './send-code.component.scss'
})
export class SendCodeComponent implements OnInit, OnDestroy {

  // Subscription
  subscriptions: Subscription;

  // FormGroup
  form: FormGroup;

  // boolean
  isSubmitLoading: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
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
      phoneNumber: ['', Validators.required],
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

    this.subscriptions = this.forgetPasswordService.sendCode(this.form.value).pipe(
      finalize(() => this.isSubmitLoading = false)
    ).subscribe(
      data => {
        let resultForNextStep: IResultForMoveStepsModel = {
          phoneNumber: this.form.value['phoneNumber'],
          expiredMinuteTime: data.expiredMinuteTime
        }
        this.forgetPasswordService.updateResultSendCode(resultForNextStep);
        this.form.reset();
        this.router.navigate(['/auth/forget-password/verify-code']);
      },
      error => {
      }
    )

  }

  //#endregion
}