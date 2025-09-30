package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceAmendDetailsRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseJustification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDetailsAmendedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonCompliancePenalties;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceReason;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class NonComplianceApplyServiceTest {

    @InjectMocks
    private NonComplianceApplyService service;

    @Mock
    private RequestService requestService;

    @Test
    void applySaveAction() {
        NonCompliancePenalties nonCompliancePenalties = mock(NonCompliancePenalties.class);
        Set<String> selectedRequests = Set.of("request");
        LocalDate nonComplianceDate = LocalDate.now();
        LocalDate complianceDate = LocalDate.now().minusMonths(1);
        String comment = "comment";
        Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        NonComplianceReason reason = NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN;

        NonComplianceApplicationSubmitRequestTaskPayload expectedRequestTaskPayload =
            NonComplianceApplicationSubmitRequestTaskPayload.builder()
            .reason(reason)
            .selectedRequests(selectedRequests)
            .nonComplianceDate(nonComplianceDate)
            .complianceDate(complianceDate)
            .nonComplianceComments(comment)
            .nonCompliancePenalties(nonCompliancePenalties)
            .sectionsCompleted(sectionsCompleted)
            .build();

        NonComplianceSaveApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceSaveApplicationRequestTaskActionPayload.builder()
                .reason(reason)
                .selectedRequests(selectedRequests)
                .nonComplianceDate(nonComplianceDate)
                .complianceDate(complianceDate)
                .nonComplianceComments(comment)
                .nonCompliancePenalties(nonCompliancePenalties)
                .sectionsCompleted(sectionsCompleted)
                .build();

        RequestTask requestTask = RequestTask.builder()
            .payload(NonComplianceApplicationSubmitRequestTaskPayload.builder().build())
            .build();

        service.applySaveAction(requestTask, taskActionPayload);

        NonComplianceApplicationSubmitRequestTaskPayload actualRequestTaskPayload =
            (NonComplianceApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        assertEquals(expectedRequestTaskPayload, actualRequestTaskPayload);
    }


    @Test
    void applyCloseAction() {

        final UUID file = UUID.randomUUID();
        final String reason = "the reason";
        final NonComplianceCloseApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceCloseApplicationRequestTaskActionPayload.builder()
                .closeJustification(NonComplianceCloseJustification.builder()
                    .reason(reason)
                    .files(Set.of(file))
                    .build())
                .build();

        final NonComplianceRequestPayload requestPayload = NonComplianceRequestPayload.builder().build();
        final Request request = Request.builder().payload(requestPayload).build();

        final Map<UUID, String> nonComplianceAttachments = Map.of(file, "filename");
        final NonComplianceApplicationSubmitRequestTaskPayload requestTaskPayload =
            NonComplianceApplicationSubmitRequestTaskPayload
                .builder()
                .nonComplianceAttachments(nonComplianceAttachments)
                .build();
        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .payload(requestTaskPayload)
            .build();

        service.applyCloseAction(requestTask, taskActionPayload);

        assertEquals(requestTaskPayload.getCloseJustification(), taskActionPayload.getCloseJustification());
        assertEquals(requestPayload.getCloseJustification(), taskActionPayload.getCloseJustification());
        assertEquals(requestPayload.getNonComplianceAttachments(), nonComplianceAttachments);
    }

    @Test
    public void amendDetails() {

        AppUser appUser = AppUser.builder().userId("id").build();

        LocalDate nonComplianceDate = LocalDate.of(2024, 9, 1);
        LocalDate complianceDate = LocalDate.of(2024, 10, 1);

        Request request = Request.builder().build();

        NonComplianceNoticeOfIntentRequestTaskPayload taskPayload =
            NonComplianceNoticeOfIntentRequestTaskPayload
                .builder()
                .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_NOTICE_OF_INTENT_PAYLOAD)
                .build();

        RequestTask requestTask = RequestTask
            .builder()
            .request(request)
            .payload(taskPayload)
            .build();

        NonComplianceAmendDetailsRequestTaskActionPayload taskActionPayload =
            NonComplianceAmendDetailsRequestTaskActionPayload
                .builder()
                .reason(NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN)
                .nonComplianceDate(nonComplianceDate)
                .complianceDate(complianceDate)
                .nonComplianceComments("test comments")
                .build();


        NonComplianceDetailsAmendedRequestActionPayload actionPayload =
            NonComplianceDetailsAmendedRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.NON_COMPLIANCE_DETAILS_AMENDED_PAYLOAD)
                .reason(NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN)
                .nonComplianceDate(nonComplianceDate)
                .complianceDate(complianceDate)
                .nonComplianceComments("test comments")
                .build();


        service.amendDetails(requestTask, taskActionPayload, appUser);

        assertThat(((NonComplianceNoticeOfIntentRequestTaskPayload) requestTask.getPayload()).getReason()).isEqualTo(NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN);
        assertThat(((NonComplianceNoticeOfIntentRequestTaskPayload) requestTask.getPayload()).getComplianceDate()).isEqualTo(complianceDate).isEqualTo(complianceDate);
        assertThat(((NonComplianceNoticeOfIntentRequestTaskPayload) requestTask.getPayload()).getNonComplianceDate()).isEqualTo(nonComplianceDate);
        assertThat(((NonComplianceNoticeOfIntentRequestTaskPayload) requestTask.getPayload()).getNonComplianceComments()).isEqualTo("test comments");

        verify(requestService).addActionToRequest(request, actionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_DETAILS_AMENDED, appUser.getUserId());

        verifyNoMoreInteractions(requestService);
    }
}