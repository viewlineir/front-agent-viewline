import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/auth/services';
import { Credentials } from '@app/core/auth/services/models/credentials';
import { ButtonPromiseDirective, MousePressDirective } from '@app/shared/directives';
import { InputImportsModule } from '@app/shared/modules/input-imports.module';
import { environment } from 'environments';
import { InvisibleReCaptchaComponent, NgxCaptchaModule } from 'ngx-captcha';
import { Observable, Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputImportsModule,
    MatButtonModule,
    MousePressDirective,
    NgxCaptchaModule,
    ButtonPromiseDirective,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('captchaElem') captchaElem: InvisibleReCaptchaComponent;
  // Public params
  subscriptions: Subscription;
  loginForm: FormGroup;
  isLoggedIn$: Observable<boolean>;
  errors: any = [];

  // captcha
  siteKey: string;
  captchaIsLoaded: boolean;
  captchaSuccess: boolean;
  captchaIsExpired: boolean;
  captchaResponse?: string;
  captchaIsReady: boolean;
  isSubmitLoading: boolean;
  activeRecaptcha: boolean;
  public recaptcha: any = null;

  private returnUrl: any;

  constructor(
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.siteKey = environment.siteKey;
    this.activeRecaptcha = environment.activeRecaptcha;
  }

  //==================================
  // #region LIFE CYCLE HOOK 
  //==================================
  ngOnInit(): void {
    this.initLoginForm();
    // redirect back to the returnUrl before login
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  ngAfterViewInit(): void {
    this.captchaIsLoaded = true;
    this.cdr.detectChanges();
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
    return this.loginForm.controls;
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
        ])
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ],
      captchaCode: ['']
    });
  }

  submit(): void {
    const controls = this.loginForm.controls;
    if (this.loginForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.reset();
      return;
    }
    this.isSubmitLoading = true;

    let captchaCode;
    if (!this.activeRecaptcha) {
      captchaCode = "isDeactive"
    } else {
      captchaCode = this.captchaElem.getCurrentResponse()
    }

    const authData: Credentials = {
      userName: controls['userName'].value,
      password: controls['password'].value,
      captchaCode: captchaCode,
      rememberMe: true
    };

    this.subscriptions = this.auth.login(authData).pipe(
      finalize(() => {
        this.isSubmitLoading = false;
        // this.cdr.markForCheck();
        this.reset();
      })
    ).subscribe(
      data => {
        // if (data) {
        //   this.router.navigate(['/auth/confirm-code', data]);
        // } else {
        this.router.navigateByUrl(this.returnUrl);
        // }
      },
      error => {
        this.reset();
      }
    )

  }


  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control) {
      return false;
    }

    const result =
      control.hasError(validationType) &&
      (control.dirty || control.touched);
    return result;
  }
  //#endregion
  //==================================
  // #region Recaptcha
  //==================================
  onExecuteSubmit() {
    if (!this.activeRecaptcha) {
      this.submit();
      return;
    }
    this.execute();
  }

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
  }
  execute(): void {

    this.captchaElem.execute();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.cdr.detectChanges();
    this.submit();
  }

  handleError(): void {
    this.isSubmitLoading = false;
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.cdr.detectChanges();
  }

  handleReady(): void {
    this.captchaIsReady = true;
    this.cdr.detectChanges();
  }

  reload(): void {
    this.captchaElem.reloadCaptcha();
  }

  reset(): void {
    this.captchaElem.resetCaptcha();
  }
  //#endregion
}