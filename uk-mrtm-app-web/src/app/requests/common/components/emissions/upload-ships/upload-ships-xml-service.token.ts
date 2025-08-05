import { InjectionToken } from '@angular/core';

import { ShipsXmlService } from '@requests/common/components/emissions/upload-ships/upload-ships-xml-service.interface';

export const UPLOAD_SHIPS_XML_SERVICE: InjectionToken<ShipsXmlService> = new InjectionToken<ShipsXmlService>(
  'Upload ships XML service',
);
