import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFileModalComponent } from './download-file-modal.component';

describe('DownloadFileModalComponent', () => {
  let component: DownloadFileModalComponent;
  let fixture: ComponentFixture<DownloadFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFileModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
