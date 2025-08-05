import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { AccountNotesService, FileNotesService } from '@mrtm/api';

import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { NoteFileDownloadComponent } from '@notes/components';

describe('NoteFileDownloadComponent', () => {
  let component: NoteFileDownloadComponent;
  let fixture: ComponentFixture<NoteFileDownloadComponent>;
  let accountNotesService: jest.Mocked<AccountNotesService>;

  beforeEach(async () => {
    Object.defineProperty(window, 'onfocus', { set: jest.fn() });
    accountNotesService = mockClass(AccountNotesService);
    accountNotesService.generateGetAccountFileNoteToken = jest
      .fn()
      .mockReturnValue(of({ token: 'abce', tokenExpirationMinutes: 1 }));

    const activatedRoute = new ActivatedRouteStub({ accountId: 11 });

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AccountNotesService, useValue: accountNotesService },
        { provide: FileNotesService, useValue: { configuration: { basePath: '' } } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteFileDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the download link', async () => {
    expect(component.url()).toEqual('/v1.0/file-notes/abce');
  });
});
