export const aerAggregatedDataXmlMock = `
<emissions>
    <shipEmissions shipImoNumber="1111111">
        <annualEmission>
            <emissions>
                <fuelOriginCode>FOSSIL</fuelOriginCode>
                <fuelTypeCode>HFO</fuelTypeCode>
                <amount>1500.25000</amount>
            </emissions>
            <emissions>
                <fuelOriginCode>BIOFUEL</fuelOriginCode>
                <fuelTypeCode>BIO_LNG</fuelTypeCode>
                <amount>750.50000</amount>
            </emissions>
            <etsEmissionsWithinUkPort>
                <tco2Total>125.5432100</tco2Total>
                <tch4eqTotal>3.2100000</tch4eqTotal>
                <tn2oeqTotal>0.8765400</tn2oeqTotal>
            </etsEmissionsWithinUkPort>
            <etsEmissionsBetweenUkPort>
                <tco2Total>250.9876500</tco2Total>
                <tch4eqTotal>6.5432100</tch4eqTotal>
                <tn2oeqTotal>1.7890100</tn2oeqTotal>
            </etsEmissionsBetweenUkPort>
            <etsEmissionsBetweenUkAndNiPort>
                <tco2Total>500.1234500</tco2Total>
                <tch4eqTotal>12.8765400</tch4eqTotal>
                <tn2oeqTotal>3.4567800</tn2oeqTotal>
            </etsEmissionsBetweenUkAndNiPort>
        </annualEmission>
    </shipEmissions>
    <shipEmissions shipImoNumber="2222222">
        <annualEmission>
            <emissions>
                <fuelOriginCode>FOSSIL</fuelOriginCode>
                <fuelTypeCode>LNG</fuelTypeCode>
                <amount>800.12500</amount>
            </emissions>
            <etsEmissionsWithinUkPort>
                <tco2Total>85.3210000</tco2Total>
                <tch4eqTotal>2.1000000</tch4eqTotal>
                <tn2oeqTotal>0.5432100</tn2oeqTotal>
            </etsEmissionsWithinUkPort>
            <etsEmissionsBetweenUkPort>
                <tco2Total>170.6540000</tco2Total>
                <tch4eqTotal>4.3210000</tch4eqTotal>
                <tn2oeqTotal>1.0987600</tn2oeqTotal>
            </etsEmissionsBetweenUkPort>
            <etsEmissionsBetweenUkAndNiPort>
                <tco2Total>340.9870000</tco2Total>
                <tch4eqTotal>8.7654300</tch4eqTotal>
                <tn2oeqTotal>2.3456700</tn2oeqTotal>
            </etsEmissionsBetweenUkAndNiPort>
        </annualEmission>
    </shipEmissions>
</emissions>
`;

export const mockAerAggregatedDataPartialErrorsXml = `
<emissions>
    <shipEmissions></shipEmissions>
    <shipEmissions shipImoNumber="1111111"></shipEmissions>
    <shipEmissions shipImoNumber="1111111"></shipEmissions>
</emissions>
`;
