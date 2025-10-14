import { inject, Injectable } from '@angular/core';

import { FileUploadService } from '@shared/services';

@Injectable({ providedIn: 'root' })
export class GuidanceFileService {
  private readonly fileUploadService = inject(FileUploadService);
}
