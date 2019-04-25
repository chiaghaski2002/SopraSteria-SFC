import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { EstablishmentService } from './establishment.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private _reportDetails$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public reportDetails$: Observable<string> = this._reportDetails$.asObservable();

  constructor(
    private http: HttpClient,
    private establishmentService: EstablishmentService
  ) {}

  getWDFReport(updatedEffectiveFrom?) {

    if (updatedEffectiveFrom) {
      const effectiveFrom = 'effectiveFrom=2019-03-01T12:30:00.000Z';
    }

    return this.http.get<any>(
      `/api/reports/wdf/establishment/${this.establishmentService.establishmentId}?effectiveFrom`
    );
  }

  updateState(data) {
    this._reportDetails$.next(data);
  }

}
