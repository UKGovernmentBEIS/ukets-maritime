import { ThirdPartyDataProviderStagingDetailsDTO } from '@mrtm/api';

export type ThirdPartyDataProviderPayload = Record<string, any> & {
  payloadType: string;
};

export interface ThirdPartyDataProviderState {
  thirdPartyDataProviderInfo?: ThirdPartyDataProviderStagingDetailsDTO | null;
  loaded: boolean;
}
