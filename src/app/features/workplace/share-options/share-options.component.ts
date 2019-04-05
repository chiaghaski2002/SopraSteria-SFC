import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharingOptionsModel } from '@core/model/sharingOptions.model';
import { EstablishmentService } from '@core/services/establishment.service';
import { MessageService } from '@core/services/message.service';

@Component({
  selector: 'app-share-options',
  templateUrl: './share-options.component.html',
  styleUrls: ['./share-options.component.scss'],
})
export class ShareOptionsComponent implements OnInit, OnDestroy {
  private _withLocalAuthority = 'Local Authority';
  private _withCQC = 'CQC';

  constructor(
    private router: Router,
    private establishmentService: EstablishmentService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  private shareOptionsForm: FormGroup;
  private subscriptions = [];

  private _shareOptions: SharingOptionsModel = null;

  // form controls
  get shareWithCQCcontrol() {
    return this.shareOptionsForm.get('shareWithCQCctl').value;
  }
  set shareWithCQCcontrol(value: boolean) {
    this.shareOptionsForm.get('shareWithCQCctl').patchValue(true, { onlySelf: true, emitEvent: false });
  }
  get shareWithLocalAuthorityControl(): boolean {
    return this.shareOptionsForm.get('shareWithLocalAuthorityCtl').value;
  }
  set shareWithLocalAuthorityControl(value: boolean) {
    this.shareOptionsForm.get('shareWithLocalAuthorityCtl').patchValue(true, { onlySelf: true, emitEvent: false });
  }

  private get isShareWithCQCEnabled(): boolean {
    if (this._shareOptions) {
      if (this._shareOptions.enabled && this._shareOptions.with && this._shareOptions.with.includes(this._withCQC)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  private get isShareWithLAEnabled(): boolean {
    if (this._shareOptions) {
      if (
        this._shareOptions.enabled &&
        this._shareOptions.with &&
        this._shareOptions.with.includes(this._withLocalAuthority)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  onSubmit() {
    if (this.shareWithCQCcontrol || this.shareWithLocalAuthorityControl) {
      this._shareOptions.enabled = true;
      this._shareOptions.with = [];

      if (this.shareWithCQCcontrol) {
        this._shareOptions.with.push(this._withCQC);
      }
      if (this.shareWithLocalAuthorityControl) {
        this._shareOptions.with.push(this._withLocalAuthority);
      }

      if (this.shareWithLocalAuthorityControl) {
        // only navigate to share with local authorities if sharing
        //  has been enabled with Local Authorities
        this.subscriptions.push(
          this.establishmentService.postSharingOptions(this._shareOptions).subscribe(() => {
            this.router.navigate(['/workplace', 'share-local-authority']);
          })
        );
      } else {
        this.subscriptions.push(
          this.establishmentService.postSharingOptions(this._shareOptions).subscribe(() => {
            this.router.navigate(['/workplace', 'vacancies']);
          })
        );
      }
    } else {
      // reset sharing options - must continue to enable sharing, but remove all share with options.
      this._shareOptions.enabled = false;
      this._shareOptions.with = [];

      this.subscriptions.push(
        this.establishmentService.postSharingOptions(this._shareOptions).subscribe(() => {
          this.router.navigate(['/workplace', 'vacancies']);
        })
      );
    }
  }

  ngOnInit() {
    // create form controls, including an empty array for the list of authorities
    this.shareOptionsForm = this.fb.group({
      shareWithCQCctl: [false, [Validators.required]],
      shareWithLocalAuthorityCtl: [false, [Validators.required]],
    });

    // // fetch establishment sharing options to determine if Local Authority sharing is enable.
    this.subscriptions.push(
      this.establishmentService.getSharingOptions().subscribe(options => {
        // for this component to be relevant, sharing must be enabled and
        //   must be sharing with Local Authority
        this._shareOptions = options.share;

        // update the controls with data fetched from store
        if (this.isShareWithCQCEnabled) {
          this.shareWithCQCcontrol = true;
        }
        if (this.isShareWithLAEnabled) {
          this.shareWithLocalAuthorityControl = true;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.messageService.clearAll();
  }
}