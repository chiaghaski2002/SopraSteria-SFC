import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Contracts } from '@core/constants/contracts.enum';
import { BackService } from '@core/services/back.service';
import { ErrorSummaryService } from '@core/services/error-summary.service';
import { WorkerService } from '@core/services/worker.service';
import { isNull } from 'lodash';

import { QuestionComponent } from '../question/question.component';

@Component({
  selector: 'app-days-of-sickness',
  templateUrl: './days-of-sickness.component.html',
})
export class DaysOfSicknessComponent extends QuestionComponent {
  public daysSicknessMin = 0;
  public daysSicknessMax = 366;

  constructor(
    protected formBuilder: FormBuilder,
    protected router: Router,
    protected backService: BackService,
    protected errorSummaryService: ErrorSummaryService,
    protected workerService: WorkerService
  ) {
    super(formBuilder, router, backService, errorSummaryService, workerService);

    this.form = this.formBuilder.group({
      daysKnown: null,
      days: null,
    });
  }

  init() {
    if (![Contracts.Permanent, Contracts.Temporary].includes(this.worker.contract)) {
      this.router.navigate(['/worker', this.worker.uid, 'adult-social-care-started'], { replaceUrl: true });
    }

    this.subscriptions.add(
      this.form.get('daysKnown').valueChanges.subscribe(value => {
        this.form.get('days').reset();
        this.form.get('days').clearValidators();

        if (value === 'Yes') {
          this.form
            .get('days')
            .setValidators([
              Validators.required,
              Validators.min(this.daysSicknessMin),
              Validators.max(this.daysSicknessMax),
            ]);
        }

        this.form.get('days').updateValueAndValidity();
      })
    );

    if (this.worker.daysSick) {
      this.form.patchValue({
        daysKnown: this.worker.daysSick.value,
        days: !isNull(this.worker.daysSick.days) ? this.worker.daysSick.days : null,
      });
    }

    this.next = ['/worker', this.worker.uid, 'contract-with-zero-hours'];
    this.previous = ['/worker', this.worker.uid, 'adult-social-care-started'];
  }

  setupFormErrorsMap(): void {
    this.formErrorsMap = [
      {
        item: 'days',
        type: [
          {
            name: 'required',
            message: 'Number of days is required.',
          },
          {
            name: 'min',
            message: `Number of days must be between ${this.daysSicknessMin} and ${this.daysSicknessMax}.`,
          },
          {
            name: 'max',
            message: `Number of days must be between ${this.daysSicknessMin} and ${this.daysSicknessMax}.`,
          },
        ],
      },
    ];
  }

  generateUpdateProps() {
    const { daysKnown, days } = this.form.value;

    if (!daysKnown) {
      return null;
    }

    return {
      daysSick: {
        value: daysKnown,
        days: days,
      },
    };
  }
}
