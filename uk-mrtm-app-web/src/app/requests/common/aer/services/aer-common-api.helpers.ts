import {
  Aer,
  AerFuelConsumption,
  AerFuelConsumptionSave,
  AerPort,
  AerPortEmissionsMeasurement,
  AerPortEmissionsMeasurementSave,
  AerPortSave,
  AerSave,
  AerShipAggregatedData,
  AerShipAggregatedDataSave,
  AerShipEmissions,
  AerShipEmissionsSave,
  AerSmfDetails,
  AerSmfDetailsSave,
  AerSmfPurchaseSave,
  AerVoyage,
  AerVoyageSave,
} from '@mrtm/api';

import { isNil } from '@shared/utils';

const mapFuelConsumptions = (fuelConsumptions: Array<AerFuelConsumption>): Array<AerFuelConsumptionSave> =>
  (fuelConsumptions ?? []).map<AerFuelConsumptionSave>(({ totalConsumption, ...fuel }) => fuel);

const mapDirectEmissions = (directEmissions?: AerPortEmissionsMeasurement): AerPortEmissionsMeasurementSave => ({
  co2: directEmissions?.co2,
  ch4: directEmissions?.ch4,
  n2o: directEmissions?.n2o,
});

const mapAerPortEmissionsMeasurementToSavePayload = ({
  total,
  ...measurement
}: AerPortEmissionsMeasurement): AerPortEmissionsMeasurementSave => measurement;

const mapPortsToSavePayload = (ports: Array<AerPort>): Array<AerPortSave> =>
  (ports ?? []).map<AerPortSave>(({ imoNumber, directEmissions, portDetails, uniqueIdentifier, fuelConsumptions }) => ({
    imoNumber,
    uniqueIdentifier,
    portDetails,
    directEmissions: !isNil(directEmissions) ? mapDirectEmissions(directEmissions) : undefined,
    fuelConsumptions: mapFuelConsumptions(fuelConsumptions),
  }));

const mapEmissionsToSavePayload = (emissions: Array<AerShipEmissions>): Array<AerShipEmissionsSave> =>
  (emissions ?? []).map<AerShipEmissionsSave>(
    ({ details, uniqueIdentifier, fuelsAndEmissionsFactors, emissionsSources, uncertaintyLevel, derogations }) => ({
      details,
      uniqueIdentifier,
      fuelsAndEmissionsFactors,
      emissionsSources,
      uncertaintyLevel,
      derogations,
      dataInputType: 'MANUAL',
    }),
  );

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
      emissionsBetweenUKAndNIVoyages,
      fromFetch,
    }) => ({
      uniqueIdentifier,
      imoNumber,
      fromFetch,
      fuelConsumptions,
      emissionsWithinUKPorts: !isNil(emissionsWithinUKPorts)
        ? mapAerPortEmissionsMeasurementToSavePayload(emissionsWithinUKPorts)
        : undefined,
      emissionsBetweenUKPorts: !isNil(emissionsBetweenUKPorts)
        ? mapAerPortEmissionsMeasurementToSavePayload(emissionsBetweenUKPorts)
        : undefined,
      emissionsBetweenUKAndNIVoyages: !isNil(emissionsBetweenUKAndNIVoyages)
        ? mapAerPortEmissionsMeasurementToSavePayload(emissionsBetweenUKAndNIVoyages)
        : undefined,
      dataInputType: 'MANUAL',
    }),
  );

const mapSmfDetailsToSavePayload = (smfDetails: AerSmfDetails): AerSmfDetailsSave => ({
  purchases: (smfDetails?.purchases ?? []).map<AerSmfPurchaseSave>(({ ...purchase }) => {
    delete purchase.co2Emissions;
    // TODO DELETE THIS emissions: mapEmissionsToSavePayload ALONG WITH LINE 115-117 AND METHOD mapEmissionsToSavePayload
    delete purchase?.['dataSaveMethod'];

    return {
      ...purchase,
      dataInputType: 'MANUAL',
    };
  }),
});

export const mapAerToSavePayload = ({ ...aer }: Aer): AerSave => {
  delete aer.totalEmissions;
  delete aer.thirdPartyDataProviderName;

  return {
    ...aer,
    // TODO DELETE THIS emissions: mapEmissionsToSavePayload ALONG WITH LINE 103
    emissions: {
      ships: mapEmissionsToSavePayload(aer?.emissions?.ships),
    },
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
