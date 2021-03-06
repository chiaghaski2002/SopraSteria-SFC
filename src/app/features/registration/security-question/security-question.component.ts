import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityDetails } from '@core/model/security-details.model';
import { BackService } from '@core/services/back.service';
import { ErrorSummaryService } from '@core/services/error-summary.service';
import { RegistrationService } from '@core/services/registration.service';
import { SecurityQuestion } from '@features/account/security-question/security-question';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
})
export class SecurityQuestionComponent extends SecurityQuestion {
  constructor(
    private registrationService: RegistrationService,
    protected backService: BackService,
    protected errorSummaryService: ErrorSummaryService,
    protected formBuilder: FormBuilder,
    protected router: Router
  ) {
    super(backService, errorSummaryService, formBuilder, router);
  }

  protected init(): void {
    this.setupSubscription();
  }

  protected setupSubscription(): void {
    this.subscriptions.add(
      this.registrationService.securityDetails$
        .pipe(finalize(() => this.setBackLink()))
        .subscribe((securityDetails: SecurityDetails) => {
          if (securityDetails) {
            this.securityDetailsExist = true;
            this.preFillForm(securityDetails);
          }
        })
    );
  }

  protected setBackLink(): void {
    const route: string = this.securityDetailsExist
      ? '/registration/confirm-account-details'
      : '/registration/create-username';
    this.backService.setBackLink({ url: [route] });
  }

  protected save(): void {
    this.router.navigate(['/registration/confirm-account-details']).then(() => {
      this.registrationService.securityDetails$.next({
        securityQuestion: this.getSecurityQuestion.value,
        securityQuestionAnswer: this.getSecurityQuestionAnswer.value,
      });
    });
  }

  protected setCallToActionLabel(): void {
    const label: string = this.securityDetailsExist ? 'Save and return' : 'Continue';
    this.callToActionLabel = label;
  }
}
