import { AerFuelConsumption } from '@mrtm/api';

export type FuelConsumptionItemDto = Partial<AerFuelConsumption & { isSummary: boolean; methaneSlip: number }>;
