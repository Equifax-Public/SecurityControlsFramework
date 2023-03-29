import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RolesComponent } from './roles/roles.component';
import { HeaderNavigationComponent } from './shared/header-navigation/header-navigation.component';
import { DomainsComponent } from './domains/domains.component';
import { DomainDetailsComponent } from './domain-details/domain-details.component';
import { AddDialogComponent, DeleteDialogComponent, ManageComponent } from './manage/manage.component';
import { ComplianceComponent } from './compliance/compliance.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { DownloadSnackBarComponent } from './shared/download-file-modal/download-file-modal.component';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Services
import { RolesService } from './services/roles.service';
import { DownloadFileModalComponent } from './shared/download-file-modal/download-file-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RolesComponent,
    RoleDetailsComponent,
    DomainsComponent,
    DomainDetailsComponent,
    ManageComponent,
    AddDialogComponent,
    DeleteDialogComponent,
    HeaderNavigationComponent,
    ComplianceComponent,
    DownloadFileModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatGridListModule,
    HttpClientModule,
    MatTableModule,
    MatRadioModule,
    MatListModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  providers: [RolesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
