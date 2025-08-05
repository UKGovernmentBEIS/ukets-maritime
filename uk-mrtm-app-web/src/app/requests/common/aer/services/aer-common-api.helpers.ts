import { isNil } from 'lodash-es';

import {
  Aer,
  AerAggregatedEmissionsMeasurement,
  AerAggregatedEmissionsMeasurementSave,
  AerFuelConsumption,
  AerFuelConsumptionSave,
  AerPort,
  AerPortEmissionsMeasurement,
  AerPortEmissionsMeasurementSave,
  AerPortSave,
  AerSave,
  AerShipAggregatedData,
  AerShipAggregatedDataSave,
  AerSmfDetails,
  AerSmfDetailsSave,
  AerSmfPurchaseSave,
  AerVoyage,
  AerVoyageSave,
} from '@mrtm/api';

const mapFuelConsumptions = (fuelConsumptions: Array<AerFuelConsumption>): Array<AerFuelConsumptionSave> =>
  (fuelConsumptions ?? []).map<AerFuelConsumptionSave>(({ totalConsumption, ...fuel }) => fuel);

const mapDirectEmissions = (directEmissions?: AerPortEmissionsMeasurement): AerPortEmissionsMeasurementSave => ({
  co2: directEmissions?.co2,
  ch4: directEmissions?.ch4,
  n2o: directEmissions?.n2o,
});

const mapAerAggregatedEmissionsMeasurementToSavePayload = ({
  total,
  ...measurement
}: AerAggregatedEmissionsMeasurement): AerAggregatedEmissionsMeasurementSave => measurement;

const mapPortsToSavePayload = (ports: Array<AerPort>): Array<AerPortSave> =>
  (ports ?? []).map<AerPortSave>(({ imoNumber, directEmissions, portDetails, uniqueIdentifier, fuelConsumptions }) => ({
    imoNumber,
    uniqueIdentifier,
    portDetails,
    directEmissions: !isNil(directEmissions) ? mapDirectEmissions(directEmissions) : undefined,
    fuelConsumptions: mapFuelConsumptions(fuelConsumptions),
  }));

const mapVoyagesToSavePayload = (voyages: Array<AerVoyage>): Array<AerVoyageSave> =>
  (voyages ?? []).map<AerVoyageSave>(
    ({ imoNumber, voyageDetails, directEmissions, fuelConsumptions, uniqueIdentifier }) =>
      ({
        imoNumber,
        uniqueIdentifier,
        voyageDetails,
        directEmissions: !isNil(directEmissions) ? mapDirectEmissions(directEmissions) : undefined,
        fuelConsumptions: mapFuelConsumptions(fuelConsumptions),
      }) as AerVoyageSave,
  );

const mapAggregatedDataToSavePayload = (
  aggregatedData: Array<AerShipAggregatedData>,
): Array<AerShipAggregatedDataSave> =>
  (aggregatedData ?? []).map<AerShipAggregatedDataSave>(
    ({
      imoNumber,
      uniqueIdentifier,
      fuelConsumptions,
      emissionsWithinUKPorts,
      emissionsBetweenUKPorts,
      emissionsBetweenUKAndEEAVoyages,
      smallIslandSurrenderReduction,
      fromFetch,
    }) => ({
      uniqueIdentifier,
      imoNumber,
      fromFetch,
      fuelConsumptions,
      emissionsWithinUKPorts: !isNil(emissionsWithinUKPorts)
        ? mapAerAggregatedEmissionsMeasurementToSavePayload(emissionsWithinUKPorts)
        : undefined,
      emissionsBetweenUKPorts: !isNil(emissionsBetweenUKPorts)
        ? mapAerAggregatedEmissionsMeasurementToSavePayload(emissionsBetweenUKPorts)
        : undefined,
      emissionsBetweenUKAndEEAVoyages: !isNil(emissionsBetweenUKAndEEAVoyages)
        ? mapAerAggregatedEmissionsMeasurementToSavePayload(emissionsBetweenUKAndEEAVoyages)
        : undefined,
      smallIslandSurrenderReduction: !isNil(smallIslandSurrenderReduction)
        ? mapAerAggregatedEmissionsMeasurementToSavePayload(smallIslandSurrenderReduction)
        : undefined,
    }),
  );

const mapSmfDetailsToSavePayload = (smfDetails: AerSmfDetails): AerSmfDetailsSave => ({
  purchases: (smfDetails?.purchases ?? []).map<AerSmfPurchaseSave>(({ ...purchase }) => {
    delete purchase.co2Emissions;

    return purchase;
  }),
});

export const mapAerToSavePayload = ({ ...aer }: Aer): AerSave => {
  delete aer.totalEmissions;

  return {
    ...aer,
    portEmissions: {
      ports: mapPortsToSavePayload(aer?.portEmissions?.ports),
    },
    voyageEmissions: {
      voyages: mapVoyagesToSavePayload(aer?.voyageEmissions?.voyages),
    },
    aggregatedData: {
      emissions: mapAggregatedDataToSavePayload(aer?.aggregatedData?.emissions),
    },
    smf: {
      ...aer.smf,
      smfDetails: aer?.smf?.exist ? mapSmfDetailsToSavePayload(aer?.smf?.smfDetails) : undefined,
    },
  };
};
