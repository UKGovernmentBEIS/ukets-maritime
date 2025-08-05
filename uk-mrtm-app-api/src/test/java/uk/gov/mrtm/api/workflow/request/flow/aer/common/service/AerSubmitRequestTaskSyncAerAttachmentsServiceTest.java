package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.AerReportingObligationDetails;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.EmpOriginatedData;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class AerSubmitRequestTaskSyncAerAttachmentsServiceTest {

    @Test
    void sync_upon_reporting_true() {
        Boolean reportingRequired = Boolean.TRUE;
        UUID empOriginatedDoc1Uuid = UUID.randomUUID();
        UUID empOriginatedDoc2Uuid = UUID.randomUUID();
        UUID reportingObligationSupportingDoc = UUID.randomUUID();
        AerApplicationSubmitRequestTaskPayload requestTaskPayload = AerApplicationSubmitRequestTaskPayload
            .builder()
            .reportingRequired(Boolean.FALSE)
            .reportingObligationDetails(AerReportingObligationDetails.builder()
                .supportingDocuments(Set.of(reportingObligationSupportingDoc))
                .build())
            .aerAttachments(new HashMap<>() {
                {
                    put(reportingObligationSupportingDoc, "suppDoc");
                }
            })
            .empOriginatedData(EmpOriginatedData.builder().operatorDetailsAttachments(new HashMap<>() {
                {
                    put(empOriginatedDoc1Uuid, "fileName1");
                    put(empOriginatedDoc2Uuid, "fileName2");
                }
            }).build()).build();

        new AerSubmitRequestTaskSyncAerAttachmentsService().sync(reportingRequired, requestTaskPayload);

        assertThat(requestTaskPayload.getAerAttachments()).containsExactlyInAnyOrderEntriesOf(Map.of(
            empOriginatedDoc1Uuid, "fileName1",
            empOriginatedDoc2Uuid, "fileName2"
        ));
    }

    @Test
    void sync_do_nothing() {
        Boolean reportingRequired = Boolean.TRUE;
        UUID file1Uuid = UUID.randomUUID();
        AerApplicationSubmitRequestTaskPayload requestTaskPayload = AerApplicationSubmitRequestTaskPayload
            .builder()
            .reportingRequired(Boolean.TRUE)
            .empOriginatedData(EmpOriginatedData.builder().operatorDetailsAttachments(new HashMap<>() {
                {
                    put(file1Uuid, "fileName1");
                    put(UUID.randomUUID(), "fileName2");
                }
            }).build())
            .aerAttachments(new HashMap<>() {
                {
                    put(file1Uuid, "fileName1");
                }
            })
            .build();

        new AerSubmitRequestTaskSyncAerAttachmentsService().sync(reportingRequired, requestTaskPayload);

        assertThat(requestTaskPayload.getAerAttachments()).containsEntry(file1Uuid, "fileName1");
    }
}
