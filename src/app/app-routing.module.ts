import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from "./core/services/auth-guard.service"

import { LoginComponent } from './features/login/login.component';
//import { RegisterComponent } from './features/register/register.component';
import { CqcRegisteredQuestionComponent } from './features/cqc-registered-question/cqc-registered-question.component';
import { SelectWorkplaceComponent } from './features/select-workplace/select-workplace.component';
import { ConfirmWorkplaceDetailsComponent } from './features/confirm-workplace-details/confirm-workplace-details.component';
import { SelectWorkplaceAddressComponent } from './features/select-workplace-address/select-workplace-address.component';
import { UserDetailsComponent } from './features/user-details/user-details.component';
import { CreateUsernameComponent } from './features/create-username/create-username.component';
import { SecurityQuestionComponent } from './features/security-question/security-question.component';
import { ConfirmAccountDetailsComponent } from './features/confirm-account-details/confirm-account-details.component';
import { RegistrationCompleteComponent } from './features/registration-complete/registration-complete.component';
import { EnterWorkplaceAddressComponent } from './features/enter-workplace-address/enter-workplace-address.component';
import { SelectMainServiceComponent } from './features/select-main-service/select-main-service.component';
import { ContinueCreatingAccountComponent } from './features/continue-creating-account/continue-creating-account.component';
import { HomepageComponent } from './features/homepage/homepage.component';
import { SelectOtherServicesComponent } from './features/select-other-services/select-other-services.component';
import { TypeOfEmployerComponent } from './features/type-of-employer/type-of-employer.component';
import { VacanciesComponent } from './features/vacancies/vacancies.component';
import { ConfirmVacanciesComponent } from './features/confirm-vacancies/confirm-vacancies.component';
import { StartersComponent } from './features/starters/starters.component';
import { ConfirmStartersComponent } from './features/confirm-starters/confirm-starters.component';
import { LeaversComponent } from './features/leavers/leavers.component';
import { ConfirmLeaversComponent } from './features/confirm-leavers/confirm-leavers.component';
import { StaffComponent } from './features/staff/staff.component';
import { ServicesCapacityComponent } from './features/services-capacity/services-capacity.component';
import { ShareOptionsComponent } from './features/shareOptions/shareOptions.component';
import { ShareLocalAuthorityComponent } from './features/shareLocalAuthorities/shareLocalAuthority.component';
import { FeedbackComponent } from './features/feedback/feedback.component';
import { ContactUsComponent } from "./features/contactUs/contactUs.component";
import { LogoutComponent } from './features/logout/logout.component';
import { CreateStaffRecordComponent } from './features/workers/create-staff-record/create-staff-record.component';
import { MentalHealthComponent } from './features/mental-health/mental-health.component';
import { TermsConditionsComponent } from './shared/terms-conditions/terms-conditions.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: 'registered-question',
    component: CqcRegisteredQuestionComponent,
  },
  {
    path: 'sign-out',
    component: LogoutComponent
  },
  {
    path: 'select-workplace',
    component: SelectWorkplaceComponent
  },
  {
    path: 'confirm-workplace-details',
    component: ConfirmWorkplaceDetailsComponent
  },
  {
    path: 'select-workplace-address',
    component: SelectWorkplaceAddressComponent
  },
  {
    path: 'user-details',
    component: UserDetailsComponent
  },
  {
    path: 'create-username',
    component: CreateUsernameComponent
  },
  {
    path: 'security-question',
    component: SecurityQuestionComponent
  },
  {
    path: 'confirm-account-details',
    component: ConfirmAccountDetailsComponent
  },
  {
    path: 'registration-complete',
    component: RegistrationCompleteComponent
  },
  {
    path: 'enter-workplace-address',
    component: EnterWorkplaceAddressComponent
  },
  {
    path: 'select-main-service',
    component: SelectMainServiceComponent
  },
  {
    path: 'continue-creating-account',
    component: ContinueCreatingAccountComponent
  },
  {
    path: 'welcome',
    component: HomepageComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'select-other-services',
    component: SelectOtherServicesComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'type-of-employer',
    component: TypeOfEmployerComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'vacancies',
    component: VacanciesComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'confirm-vacancies',
    component: ConfirmVacanciesComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'starters',
    component: StartersComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'confirm-starters',
    component: ConfirmStartersComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'leavers',
    component: LeaversComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'confirm-leavers',
    component: ConfirmLeaversComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'staff',
    component: StaffComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'capacity-of-services',
    component: ServicesCapacityComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'share-local-authority',
    component: ShareLocalAuthorityComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'share-options',
    component: ShareOptionsComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  {
    path: 'feedback',
    component: FeedbackComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsConditionsComponent
  },
  {
    path: 'create-staff-record',
    component: CreateStaffRecordComponent
  },
  {
    path: 'mental-health',
    component: MentalHealthComponent
  },
  {
    path: "",
    redirectTo: "/welcome",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "/welcome"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
