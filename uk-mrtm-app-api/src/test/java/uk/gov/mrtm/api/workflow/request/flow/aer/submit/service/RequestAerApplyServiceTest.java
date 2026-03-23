package uk.gov.mrtm.api.workflow.request.flow.aer.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerSave;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerAggregatedDataEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerPortEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSmfEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerSubmitRequestTaskSyncAerAttachmentsService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerTotalEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.service.AerVoyageEmissionsCalculator;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class RequestAerApplyServiceTest {

    @InjectMocks
    private RequestAerApplyService service;

    @Mock
    private AerSubmitRequestTaskSyncAerAttachmentsService syncAerAttachmentsService;

    @Mock
    private AerPortEmissionsCalculator portEmissionsCalculator;

    @Mock
    private AerVoyageEmissionsCalculator voyageEmissionsCalculator;

    @Mock
    private AerAggregatedDataEmissionsCalculator aggregatedDataEmissionsCalculator;

    @Mock
    private AerSmfEmissionsCalculator smfEmissionsCalculator;

    @Mock
    private AerTotalEmissionsCalculator totalEmissionsCalculator;

    @Test
    void applySaveAction() {
        AerSave aerSave = AerSave.builder()
            .additionalDocuments(AdditionalDocuments.builder().exist(true).build())
            .build();
        Aer aer = Aer.builder()
            .additionalDocuments(AdditionalDocuments.builder().exist(true).build())
            .build();

        AerSaveApplicationRequestTaskActionPayload taskActionPayload =
            AerSaveApplicationRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.AER_SAVE_APPLICATION_PAYLOAD)
                .reportingRequired(true)
                .aer(aerSave)
                .aerSectionsCompleted(Map.of(AdditionalDocuments.class.getName(), "COMPLETED"))
                .build();

        AerApplicationSubmitRequestTaskPayload requestTaskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_SUBMIT_PAYLOAD)
            .build();

        RequestTask requestTask = RequestTask.builder()
            .payload(requestTaskPayload)
            .build();

        //invoke
        service.applySaveAction(taskActionPayload, requestTask);

        AerApplicationSubmitRequestTaskPayload payloadSaved =
            (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        assertNotNull(payloadSaved.getAer());
        assertTrue(payloadSaved.getReportingRequired());
        assertThat(payloadSaved.getAerSectionsCompleted()).containsExactly(Map.entry(AdditionalDocuments.class.getName(), "COMPLETED"));
        assertFalse(payloadSaved.isVerificationPerformed());

        verify(syncAerAttachmentsService).sync(taskActionPayload.getReportingRequired(), requestTaskPayload);
        verify(portEmissionsCalculator).calculateEmissions(aer);
        verify(voyageEmissionsCalculator).calculateEmissions(aer);
        verify(smfEmissionsCalculator).calculateEmissions(aer);
        verify(aggregatedDataEmissionsCalculator).calculateEmissions(aer);
        verify(totalEmissionsCalculator).calculateEmissions(aer);

        verifyNoMoreInteractions(portEmissionsCalculator, voyageEmissionsCalculator,
            smfEmissionsCalculator, aggregatedDataEmissionsCalculator, totalEmissionsCalculator);
    }
}