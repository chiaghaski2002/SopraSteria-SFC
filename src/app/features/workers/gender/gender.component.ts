import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Worker } from '@core/model/worker.model';
import { MessageService } from '@core/services/message.service';
import { WorkerEditResponse, WorkerService } from '@core/services/worker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
})
export class GenderComponent implements OnInit, OnDestroy {
  public answersAvailable = ['Female', 'Male', 'Other', `Don't know`];
  public form: FormGroup;
  private worker: Worker;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private workerService: WorkerService,
    private messageService: MessageService
  ) {
    this.saveHandler = this.saveHandler.bind(this);
  }

  ngOnInit() {
    this.worker = this.route.parent.snapshot.data.worker;

    this.form = this.formBuilder.group({
      gender: null,
    });

    if (this.worker.gender) {
      this.form.patchValue({
        gender: this.worker.gender,
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.messageService.clearAll();
  }

  async submitHandler() {
    try {
      await this.saveHandler();
      this.router.navigate(['/worker', this.worker.uid, 'disability']);
    } catch (err) {
      // keep typescript transpiler silent
    }
  }

  saveHandler(): Promise<WorkerEditResponse> {
    return new Promise((resolve, reject) => {
      const { gender } = this.form.value;
      this.messageService.clearError();

      if (this.form.valid) {
        this.worker.gender = gender;
        this.subscriptions.add(this.workerService.setWorker(this.worker).subscribe(resolve, reject));
      } else {
        this.messageService.show('error', 'Please fill required fields.');
        reject();
      }
    });
  }
}
