package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.time.Year;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerApplicationAmendsSubmitInitializerTest {

    @InjectMocks
    private AerApplicationAmendsSubmitInitializer initializer;

    @Mock
    private AerReviewMapper aerReviewMapper;

    @Test
    void initializePayload() {
        String requestId = "REQ_ID";
        Year reportingYear = Year.of(2023);
        AerRequestMetadata requestMetadata = AerRequestMetadata.builder().year(reportingYear).build();
        AerRequestPayload requestPayload = AerRequestPayload.builder().build();
        Request request = Request.builder()
            .id(requestId)
            .payload(requestPayload)
            .metadata(requestMetadata)
            .build();

        AerApplicationAmendsSubmitRequestTaskPayload requestTaskPayload =
            mock(AerApplicationAmendsSubmitRequestTaskPayload.class);
        when(aerReviewMapper.toAerApplicationAmendsSubmitRequestTaskPayload(requestPayload,
            MrtmRequestTaskPayloadType.AER_APPLICATION_AMENDS_SUBMIT_PAYLOAD,
            reportingYear
        )).thenReturn(requestTaskPayload);

        //invoke
        RequestTaskPayload result = initializer.initializePayload(request);

        assertThat(result).isEqualTo(requestTaskPayload);

        //verify
        verify(aerReviewMapper)
            .toAerApplicationAmendsSubmitRequestTaskPayload(
                requestPayload,
                MrtmRequestTaskPayloadType.AER_APPLICATION_AMENDS_SUBMIT_PAYLOAD,
                reportingYear
            );
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsOnly(MrtmRequestTaskType.AER_APPLICATION_AMENDS_SUBMIT);
    }
}