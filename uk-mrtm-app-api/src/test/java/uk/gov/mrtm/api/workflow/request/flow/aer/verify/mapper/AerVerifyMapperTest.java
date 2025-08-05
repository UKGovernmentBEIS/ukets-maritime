package uk.gov.mrtm.api.workflow.request.flow.aer.verify.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerMonitoringPlanChanges;
import uk.gov.mrtm.api.reporting.domain.AerOperatorDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifierContact;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerMonitoringPlanVersion;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmittedRequestActionPayload;
import uk.gov.netz.api.verificationbody.domain.verificationbodydetails.VerificationBodyDetails;

import java.math.BigDecimal;
import java.time.Year;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AerVerifyMapperTest {

    private final AerVerifyMapper mapper = Mappers.getMapper(AerVerifyMapper.class);

    @Test
    void toAerApplicationVerificationSubmitRequestTaskPayload() {

        Long vbId = 1L;
        final AerMonitoringPlanVersion aerMonitoringPlanVersion = AerMonitoringPlanVersion.builder()
                .empId("empId")
                .empConsolidationNumber(1)
                .build();

        Aer aer = Aer.builder()
                .aerMonitoringPlanChanges(AerMonitoringPlanChanges.builder().changes("changes").build())
                .build();

        final BigDecimal totalEmissionsProvided = BigDecimal.valueOf(12345.67);
        final BigDecimal surrenderEmissionsProvided = BigDecimal.valueOf(345.89);
        final BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(122.78);
        final BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(45.75);
        final AerTotalReportableEmissions totalEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(totalEmissionsProvided)
            .surrenderEmissions(surrenderEmissionsProvided)
            .lessIslandFerryDeduction(lessIslandFerryDeduction)
            .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
            .build();

        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
                .reportingRequired(Boolean.TRUE)
                .aerMonitoringPlanVersion(aerMonitoringPlanVersion)
                .aer(aer)
                .totalEmissions(totalEmissions)
                .build();
        final AerVerificationReport verificationReport = AerVerificationReport.builder()
                .verificationBodyId(vbId)
                .verificationBodyDetails(VerificationBodyDetails.builder().name("vb name").accreditationReferenceNumber("vb ref").build())
                .build();
        final Year year = Year.of(2025);
        final String requestTaskPayloadType = MrtmRequestTaskPayloadType.AER_APPLICATION_VERIFICATION_SUBMIT_PAYLOAD;

        final AerApplicationVerificationSubmitRequestTaskPayload requestTaskPayload =
                mapper.toAerApplicationVerificationSubmitRequestTaskPayload(aerRequestPayload, verificationReport,
                        year, requestTaskPayloadType);

        assertThat(requestTaskPayload.getPayloadType()).isEqualTo(requestTaskPayloadType);
        assertThat(requestTaskPayload.getReportingRequired()).isEqualTo(Boolean.TRUE);
        assertThat(requestTaskPayload.getReportingYear()).isEqualTo(year);
        assertThat(requestTaskPayload.getTotalEmissions()).isEqualTo(totalEmissions);
        assertThat(requestTaskPayload.getAer()).isEqualTo(aer);
        assertThat(requestTaskPayload.getVerificationReport()).isEqualTo(verificationReport);
        assertThat(requestTaskPayload.getAerMonitoringPlanVersion()).isEqualTo(aerMonitoringPlanVersion);
        assertThat(requestTaskPayload.getNotCoveredChangesProvided()).isEqualTo(aer.getAerMonitoringPlanChanges().getChanges());
    }

    @Test
    void toAerApplicationVerificationSubmittedRequestActionPayload() {
        String requestActionPayloadType = MrtmRequestActionPayloadType.AER_APPLICATION_VERIFICATION_SUBMITTED_PAYLOAD;
        Aer aer = Aer.builder()
                .operatorDetails(AerOperatorDetails.builder()
                        .operatorName("operatorName")
                        .build())
                .build();
        Map<UUID, String> aerAttachments = Map.of(UUID.randomUUID(), "attachment");
        AerVerificationReport verificationReport = AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                        .verifierContact(AerVerifierContact.builder().name("name").build())
                        .build())
                .build();
        Year reportingYear = Year.of(2022);
        BigDecimal totalEmissionsProvided = BigDecimal.valueOf(23670.80);
        final BigDecimal surrenderEmissionsProvided = BigDecimal.valueOf(345.89);
        final BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(122.78);
        final BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(45.75);

        final AerTotalReportableEmissions totalEmissions = AerTotalReportableEmissions.builder()
                .totalEmissions(totalEmissionsProvided)
                .surrenderEmissions(surrenderEmissionsProvided)
                .lessIslandFerryDeduction(lessIslandFerryDeduction)
                .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                .build();

        AerApplicationVerificationSubmitRequestTaskPayload verificationSubmitRequestTaskPayload =
                AerApplicationVerificationSubmitRequestTaskPayload.builder()
                        .reportingRequired(Boolean.TRUE)
                        .reportingYear(reportingYear)
                        .verificationReport(verificationReport)
                        .aer(aer)
                        .aerAttachments(aerAttachments)
                        .totalEmissions(totalEmissions)
                        .build();

        AerApplicationVerificationSubmittedRequestActionPayload requestActionPayload =
                mapper.toAerApplicationVerificationSubmittedRequestActionPayload(verificationSubmitRequestTaskPayload, requestActionPayloadType);

        assertEquals(requestActionPayloadType, requestActionPayload.getPayloadType());
        assertTrue(requestActionPayload.getReportingRequired());
        assertNull(requestActionPayload.getReportingObligationDetails());
        assertEquals(reportingYear, requestActionPayload.getReportingYear());
        assertEquals(verificationReport, requestActionPayload.getVerificationReport());
        assertThat(requestActionPayload.getAerMonitoringPlanVersion()).isNull();
        assertEquals(totalEmissions, requestActionPayload.getTotalEmissions());
        assertNull(requestActionPayload.getNotCoveredChangesProvided());
        assertThat(requestActionPayload.getAerAttachments()).containsExactlyInAnyOrderEntriesOf(aerAttachments);

        Aer requestActionPayloadAer = requestActionPayload.getAer();
        assertNotNull(requestActionPayloadAer);
    }
}
