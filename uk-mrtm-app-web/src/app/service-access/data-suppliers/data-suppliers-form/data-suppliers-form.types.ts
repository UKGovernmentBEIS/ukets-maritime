import { FormControl } from '@angular/forms';

import { ThirdPartyDataProviderCreateDTO } from '@mrtm/api';

export type DataSuppliersFormGroup = Record<keyof ThirdPartyDataProviderCreateDTO, FormControl>;
