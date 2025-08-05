package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerOperatorDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifierContact;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.verificationbody.domain.verificationbodydetails.VerificationBodyDetails;
import uk.gov.netz.api.verificationbody.service.VerificationBodyDetailsQueryService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerApplicationVerificationSubmitInitializerTest {

    @InjectMocks
    private AerApplicationVerificationSubmitInitializer initializer;

    @Mock
    private VerificationBodyDetailsQueryService verificationBodyDetailsQueryService;

    @Test
    void initializePayload_vb_not_changed() {
        Long requestVBId = 1L;
        Long accountId = 1L;
        Year reportingYear = Year.of(2022);
        BigDecimal totalEmissions = BigDecimal.valueOf(12345);
        BigDecimal surrenderEmissions = BigDecimal.valueOf(234);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(10);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(12);

        final AerTotalReportableEmissions aerTotalReportableEmissions = AerTotalReportableEmissions.builder()
                .totalEmissions(totalEmissions)
                .surrenderEmissions(surrenderEmissions)
                .lessIslandFerryDeduction(lessIslandFerryDeduction)
                .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                .build();

        Aer aer = Aer.builder()
                .operatorDetails(AerOperatorDetails.builder()
                        .operatorName("name")
                        .build())
                .totalEmissions(AerTotalEmissions.builder()
                        .totalShipEmissionsSummary(totalEmissions)
                        .surrenderEmissionsSummary(surrenderEmissions)
                        .lessIslandFerryDeduction(AerPortEmissionsMeasurement.builder().total(lessIslandFerryDeduction).build())
                        .less5PercentIceClassDeduction(AerPortEmissionsMeasurement.builder().total(less5PercentIceClassDeduction).build())
                        .build())
                .build();

        AerVerificationReport requestVerificationReport = AerVerificationReport.builder()
                .verificationBodyId(requestVBId)
                .verificationBodyDetails(VerificationBodyDetails.builder()
                        .accreditationReferenceNumber("old vb details")
                        .build())
                .verificationData(AerVerificationData.builder()
                        .build())
                .build();

        AerRequestPayload requestPayload = AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
                .reportingRequired(true)
                .aer(aer)
                .totalEmissions(aerTotalReportableEmissions)
                .verificationReport(requestVerificationReport)
                .build();

        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().year(reportingYear).build();

        Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.AER).build())
                .payload(requestPayload)
                .metadata(aerRequestMetadata)
                .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build(),
                        RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(requestVBId.toString()).build()))
                .build();


        VerificationBodyDetails latestVerificationBodyDetails = VerificationBodyDetails.builder()
                .accreditationReferenceNumber("accr_ref_number")
                .build();
        when(verificationBodyDetailsQueryService.getVerificationBodyDetails(requestVBId))
                .thenReturn(Optional.of(latestVerificationBodyDetails));

        //invoke
        RequestTaskPayload result = initializer.initializePayload(request);

        assertThat(requestPayload.getVerificationReport()).isNotNull();
        assertEquals(MrtmRequestTaskPayloadType.AER_APPLICATION_VERIFICATION_SUBMIT_PAYLOAD, result.getPayloadType());

        AerApplicationVerificationSubmitRequestTaskPayload resultPayload = (AerApplicationVerificationSubmitRequestTaskPayload) result;
        assertThat(resultPayload.getVerificationReport()).isEqualTo(AerVerificationReport.builder()
                .verificationBodyId(requestVBId)
                .verificationBodyDetails(latestVerificationBodyDetails)
                .verificationData(requestPayload.getVerificationData())
                .build());
        assertThat(resultPayload.getTotalEmissions()).isEqualTo(aerTotalReportableEmissions);
        assertThat(resultPayload.getReportingYear()).isEqualTo(reportingYear);

        verify(verificationBodyDetailsQueryService, times(1)).getVerificationBodyDetails(requestVBId);
        verifyNoMoreInteractions(verificationBodyDetailsQueryService);
    }

    @Test
    void initializePayload_vb_changed() {
        Long requestVBId = 1L;
        Long reportVBId = 2L;
        Long accountId = 1L;
        Year reportingYear = Year.of(2022);
        BigDecimal totalEmissions = BigDecimal.valueOf(12345);
        BigDecimal surrenderEmissions = BigDecimal.valueOf(234);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(10);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(12);

        final AerTotalReportableEmissions aerTotalReportableEmissions = AerTotalReportableEmissions.builder()
                .totalEmissions(totalEmissions)
                .surrenderEmissions(surrenderEmissions)
                .lessIslandFerryDeduction(lessIslandFerryDeduction)
                .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                .build();

        Aer aer = Aer.builder()
                .operatorDetails(AerOperatorDetails.builder()
                        .operatorName("name")
                        .build())
                .totalEmissions(AerTotalEmissions.builder()
                        .totalShipEmissionsSummary(totalEmissions)
                        .surrenderEmissionsSummary(surrenderEmissions)
                        .lessIslandFerryDeduction(AerPortEmissionsMeasurement.builder().total(lessIslandFerryDeduction).build())
                        .less5PercentIceClassDeduction(AerPortEmissionsMeasurement.builder().total(less5PercentIceClassDeduction).build())
                        .build())
                .build();

        AerVerificationReport requestVerificationReport = AerVerificationReport.builder()
                .verificationBodyId(reportVBId)
                .verificationBodyDetails(VerificationBodyDetails.builder()
                        .accreditationReferenceNumber("old vb details")
                        .build())
                .verificationData(AerVerificationData.builder()
                        .verifierContact(AerVerifierContact.builder()
                                .name("verifier contact name")
                                .build())
                        .build())
                .build();

        AerRequestPayload requestPayload = AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
                .reportingRequired(true)
                .totalEmissions(aerTotalReportableEmissions)
                .aer(aer)
                .verificationReport(requestVerificationReport)
                .build();

        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().year(reportingYear).build();

        Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.AER).build())
                .payload(requestPayload)
                .metadata(aerRequestMetadata)
                .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build(),
                        RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(requestVBId.toString()).build()))
                .build();


        VerificationBodyDetails latestVerificationBodyDetails = VerificationBodyDetails.builder()
                .accreditationReferenceNumber("accr_ref_number")
                .build();
        when(verificationBodyDetailsQueryService.getVerificationBodyDetails(requestVBId))
                .thenReturn(Optional.of(latestVerificationBodyDetails));

        //invoke
        RequestTaskPayload result = initializer.initializePayload(request);

        assertThat(requestPayload.getVerificationReport()).isNull();
        assertEquals(MrtmRequestTaskPayloadType.AER_APPLICATION_VERIFICATION_SUBMIT_PAYLOAD, result.getPayloadType());

        AerApplicationVerificationSubmitRequestTaskPayload resultPayload = (AerApplicationVerificationSubmitRequestTaskPayload) result;
        assertThat(resultPayload.getVerificationReport()).isEqualTo(AerVerificationReport.builder()
                .verificationBodyId(requestVBId)
                .verificationBodyDetails(latestVerificationBodyDetails)
                .verificationData(AerVerificationData.builder().build())
                .build());
        assertThat(resultPayload.getTotalEmissions()).isEqualTo(aerTotalReportableEmissions);
        assertThat(resultPayload.getReportingYear()).isEqualTo(reportingYear);

        verify(verificationBodyDetailsQueryService, times(1)).getVerificationBodyDetails(requestVBId);
        verifyNoMoreInteractions(verificationBodyDetailsQueryService);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactlyInAnyOrder(
                MrtmRequestTaskType.AER_APPLICATION_VERIFICATION_SUBMIT,
                MrtmRequestTaskType.AER_AMEND_APPLICATION_VERIFICATION_SUBMIT
        );
    }
}