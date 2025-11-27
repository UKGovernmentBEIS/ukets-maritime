package uk.gov.mrtm.api.workflow.request.flow.aer.common.utils;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes1;
import uk.gov.mrtm.api.reporting.enumeration.PortCodes2;
import uk.gov.mrtm.api.reporting.enumeration.PortCodesNorthernIreland;
import uk.gov.mrtm.api.reporting.enumeration.PortCountries;
import uk.gov.mrtm.api.reporting.enumeration.PortType;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class AerPortCodesUtilsTest {

    public static Stream<Arguments> scenarios() {
        return
            Stream.of(
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.NOT_APPLICABLE.name()).build(),
                    PortType.GB
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBAMR.name()).build(),
                    PortType.GB
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodesNorthernIreland.GBBEL.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    PortType.NI
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodesNorthernIreland.GBBEL.name()).build(),
                    PortType.NI
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.GR).port(PortCodes2.GRKAK.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    PortType.EU
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GR).port(PortCodes2.GRKAK.name()).build(),
                    PortType.EU
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.US).port(PortCodes2.USBAL.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    PortType.INTERNATIONAL
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.GB).port(PortCodes1.GBABD.name()).build(),
                    AerPortVisit.builder().country(PortCountries.US).port(PortCodes2.USBAL.name()).build(),
                    PortType.INTERNATIONAL
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.US).port(PortCodes1.GBABD.name()).build(),
                    AerPortVisit.builder().country(PortCountries.CA).port(PortCodes1.CABAD.name()).build(),
                    PortType.INTERNATIONAL
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.US).port(PortCodes1.GBABD.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GR).port(PortCodes2.GRPIR.name()).build(),
                    PortType.INTERNATIONAL
                ),
                Arguments.of(
                    AerPortVisit.builder().country(PortCountries.ES).port(PortCodes1.ESACA.name()).build(),
                    AerPortVisit.builder().country(PortCountries.GR).port(PortCodes2.GRPIR.name()).build(),
                    PortType.EU
                )
            );
    }

    @ParameterizedTest
    @MethodSource("scenarios")
    void getJourneyType(AerPortVisit from, AerPortVisit to, PortType portType) {
        assertEquals(portType, AerPortCodesUtils.getJourneyType(from, to));
    }

}