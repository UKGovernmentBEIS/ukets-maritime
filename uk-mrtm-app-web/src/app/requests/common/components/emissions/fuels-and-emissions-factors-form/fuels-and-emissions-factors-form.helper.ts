import { FuelsAndEmissionsFactors, FuelType } from '@shared/types';

export const FUELS_AND_EMISSIONS_FORM_STEP = 'fuels-and-emissions';

type FormManagerMap<T> = Record<
  FuelsAndEmissionsFactors['origin'],
  Partial<
    Record<
      FuelType,
      {
        data: T;
        disabledFields?: Array<keyof T>;
        nitrousOxideOptions?: number[];
      }
    >
  >
>;

const defaultFormValues = {
  methane: '0.00005',
  nitrousOxide: '0.00018',
};

export const fuelsAndEmissionsFormFlowMap: FormManagerMap<
  Partial<Pick<FuelsAndEmissionsFactors, 'carbonDioxide' | 'nitrousOxide' | 'methane'>>
> = {
  FOSSIL: {
    HFO: {
      data: { ...defaultFormValues, carbonDioxide: '3.114' },
      disabledFields: ['carbonDioxide'],
    },
    LFO: {
      data: { ...defaultFormValues, carbonDioxide: '3.151' },
      disabledFields: ['carbonDioxide'],
    },
    MDO: {
      data: { ...defaultFormValues, carbonDioxide: '3.206' },
      disabledFields: ['carbonDioxide'],
    },
    MGO: {
      data: { ...defaultFormValues, carbonDioxide: '3.206' },
      disabledFields: ['carbonDioxide'],
    },
    LNG: {
      data: { carbonDioxide: '2.75', methane: '0', nitrousOxide: '0.00011' },
      disabledFields: ['carbonDioxide'],
    },
    LPG_BUTANE: {
      data: { ...defaultFormValues, carbonDioxide: '3.03' },
      disabledFields: ['carbonDioxide'],
    },
    LPG_PROPANE: {
      data: { ...defaultFormValues, carbonDioxide: '3' },
      disabledFields: ['carbonDioxide'],
    },
    H2: {
      data: { carbonDioxide: '0', methane: '0', nitrousOxide: '0' },
      disabledFields: ['carbonDioxide'],
      nitrousOxideOptions: [0, 0.00018],
    },
    NH3: {
      data: { ...defaultFormValues, carbonDioxide: '0' },
      disabledFields: ['carbonDioxide'],
    },
    METHANOL: {
      data: { carbonDioxide: '1.375', methane: '0.00005', nitrousOxide: '0.00018' },
      disabledFields: ['carbonDioxide'],
    },
    OTHER: { disabledFields: [], data: {} },
  },
  BIOFUEL: {
    ETHANOL: {
      data: { ...defaultFormValues, carbonDioxide: '1.913' },
    },
    BIO_DIESEL: {
      data: { ...defaultFormValues, carbonDioxide: '2.834' },
    },
    HVO: {
      data: { ...defaultFormValues, carbonDioxide: '3.115' },
    },
    BIO_LNG: {
      data: { carbonDioxide: '2.75', methane: '0', nitrousOxide: '0.00011' },
    },
    BIO_METHANOL: {
      data: { ...defaultFormValues, carbonDioxide: '1.375' },
    },
    BIO_H2: {
      data: { carbonDioxide: '0', methane: '0', nitrousOxide: '0' },
      nitrousOxideOptions: [0, 0.00018],
    },
    OTHER: {
      data: { ...defaultFormValues, carbonDioxide: '3.115' },
    },
  },
  RFNBO: {
    E_DIESEL: {
      data: { ...defaultFormValues, carbonDioxide: '3.206' },
    },
    E_METHANOL: {
      data: { ...defaultFormValues, carbonDioxide: '1.375' },
    },
    E_LNG: {
      data: { carbonDioxide: '2.75', methane: '0', nitrousOxide: '0.00011' },
    },
    E_H2: {
      data: { carbonDioxide: '0', methane: '0', nitrousOxide: '0' },
      nitrousOxideOptions: [0, 0.00018],
    },
    E_NH3: { data: { ...defaultFormValues, carbonDioxide: '0' } },
    E_LPG: { data: { ...defaultFormValues, carbonDioxide: '3.206' } },
    E_DME: { data: { ...defaultFormValues, carbonDioxide: '3.206' } },
    OTHER: { disabledFields: [], data: {} },
  },
};
