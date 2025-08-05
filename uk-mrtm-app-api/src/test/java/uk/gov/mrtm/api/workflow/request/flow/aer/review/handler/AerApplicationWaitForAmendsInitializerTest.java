package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestVerificationService;

import java.time.Year;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AerApplicationWaitForAmendsInitializerTest {

    @InjectMocks
    private AerApplicationWaitForAmendsInitializer initializer;

    @Mock
    private RequestVerificationService requestVerificationService;

    @Mock
    private AerReviewMapper aerReviewMapper;

    @Test
    void initializePayload_when_verification_report_exists() {
        String requestId = "REQ_ID";
        long accountId = 1L;
        Long vbId = 2L;
        Year reportingYear = Year.of(2023);
        AerRequestMetadata requestMetadata = AerRequestMetadata.builder().year(reportingYear).build();
        AerVerificationReport verificationReport = AerVerificationReport.builder()
            .verificationData(AerVerificationData.builder().build())
            .build();
        AerRequestPayload requestPayload = AerRequestPayload.builder()
            .verificationReport(verificationReport)
            .build();
        Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(Long.toString(accountId)).build(),
                RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(vbId.toString()).build()))
            .payload(requestPayload)
            .metadata(requestMetadata)
            .build();

        //invoke
        initializer.initializePayload(request);

        //verify
        verify(requestVerificationService).refreshVerificationReportVBDetails(verificationReport, vbId);
        verify(aerReviewMapper).toAerApplicationReviewRequestTaskPayload(
            requestPayload, MrtmRequestTaskPayloadType.AER_WAIT_FOR_AMENDS_PAYLOAD, reportingYear);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsOnly(MrtmRequestTaskType.AER_WAIT_FOR_AMENDS);
    }

    @Test
    void getRequestTaskPayloadType() {
        assertEquals(MrtmRequestTaskPayloadType.AER_WAIT_FOR_AMENDS_PAYLOAD, initializer.getRequestTaskPayloadType());
    }
}
