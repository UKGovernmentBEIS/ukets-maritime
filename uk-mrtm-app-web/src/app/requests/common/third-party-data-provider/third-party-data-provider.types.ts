import { ThirdPartyDataProviderDTO } from '@mrtm/api';

export type ThirdPartyDataProviderPayload = Record<string, any> & {
  payloadType: string;
};

export interface ThirdPartyDataProviderDTOExtended extends ThirdPartyDataProviderDTO {
  payload?: ThirdPartyDataProviderPayload;
}

export interface ThirdPartyDataProviderState {
  thirdPartyDataProviderInfo?: ThirdPartyDataProviderDTO | null;
  loaded: boolean;
}
