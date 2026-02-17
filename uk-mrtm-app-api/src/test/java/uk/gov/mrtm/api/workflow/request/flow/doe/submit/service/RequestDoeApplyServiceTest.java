package uk.gov.mrtm.api.workflow.request.flow.doe.submit.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeFeeDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeTotalMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.validation.DecisionNotificationUsersValidator;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestDoeApplyServiceTest {


    @InjectMocks
    private RequestDoeApplyService service;

    @Mock
    private DoeValidatorService doeValidatorService;

    @Mock
    private DecisionNotificationUsersValidator decisionNotificationUsersValidator;

    @Test
    void applySaveAction() {
        Doe doe = Doe.builder().build();
        Map<String, String> sectionsCompleted = Map.of("s1", "a");
        DoeSaveApplicationRequestTaskActionPayload taskActionPayload =
                DoeSaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.DOE_SAVE_APPLICATION_PAYLOAD)
                        .doe(doe)
                        .sectionsCompleted(sectionsCompleted)
                        .build();

        DoeApplicationSubmitRequestTaskPayload requestTaskPayload = DoeApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD)
                .doe(Doe.builder().build())
                .sectionsCompleted(Map.of())
                .build();

        RequestTask requestTask = RequestTask.builder()
                .payload(requestTaskPayload)
                .build();

        //invoke
        service.applySaveAction(taskActionPayload, requestTask);

        DoeApplicationSubmitRequestTaskPayload payloadSaved =
                (DoeApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        assertEquals(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD, payloadSaved.getPayloadType());
        assertEquals(doe, payloadSaved.getDoe());
        assertThat(payloadSaved.getSectionsCompleted()).isEqualTo(sectionsCompleted);
    }

    @Test
    void requestPeerReview() {
        UUID att1 = UUID.randomUUID();
        Doe doe = Doe.builder()
                .maritimeEmissions(DoeMaritimeEmissions.builder()
                        .chargeOperator(false)
                        .totalMaritimeEmissions(DoeTotalMaritimeEmissions.builder()
                                .calculationApproach("calculationApproach")
                                .totalReportableEmissions(BigDecimal.valueOf(1250.9)).build())
                        .determinationReason(DoeDeterminationReason.builder()
                            .details(DoeDeterminationReasonDetails.builder()
                                .type(DoeDeterminationReasonType.VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER)
                                .noticeText("noticeText")
                                .build()).build())
                        .build())
                .build();

        DoeApplicationSubmitRequestTaskPayload requestTaskPayload = DoeApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_PEER_REVIEW_PAYLOAD)
                .doe(doe)
                .doeAttachments(Map.of(att1, "atta1.pdf"))
                .sectionsCompleted(Map.of())
                .build();

        DoeRequestPayload doeRequestPayload = DoeRequestPayload.builder().build();
        RequestTask requestTask = RequestTask.builder()
                .request(Request.builder()
                        .payload(doeRequestPayload)
                        .build())
                .payload(requestTaskPayload).build();

        String peerReviewer = "peerReviewer";
        AppUser appUser = AppUser.builder().userId("user").build();

        // Invoke
        service.requestPeerReview(requestTask, peerReviewer, appUser.getUserId());

        assertThat(doeRequestPayload.getRegulatorPeerReviewer()).isEqualTo(peerReviewer);
        assertThat(doeRequestPayload.getDoe()).isEqualTo(doe);
        assertThat(doeRequestPayload.getSectionsCompleted()).isEqualTo(Map.of());
        assertThat(doeRequestPayload.getDoeAttachments()).containsExactlyEntriesOf(Map.of(att1, "atta1.pdf"));
        assertThat(doeRequestPayload.getPaymentAmount()).isNull();
    }

    @Test
    void applySubmitNotify() {
        UUID att1 = UUID.randomUUID();
        Doe doe = Doe.builder()
                .maritimeEmissions(DoeMaritimeEmissions.builder()
                        .chargeOperator(false)
                        .determinationReason(DoeDeterminationReason.builder()
                                .details(DoeDeterminationReasonDetails.builder()
                                    .type(DoeDeterminationReasonType.VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER)
                                    .noticeText("noticeText")
                                    .build())
                                .build())
                        .totalMaritimeEmissions(DoeTotalMaritimeEmissions.builder()
                                .calculationApproach("calculationApproach")
                                .totalReportableEmissions(BigDecimal.valueOf(1250.9))
                                .build())
                        .feeDetails(DoeFeeDetails.builder()
                                .build())
                        .build())
                .build();

        DoeApplicationSubmitRequestTaskPayload requestTaskPayload = DoeApplicationSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD)
                .doe(doe)
                .doeAttachments(Map.of(att1, "atta1.pdf"))
                .sectionsCompleted(Map.of("section1", "true"))
                .build();

        DoeRequestPayload doeRequestPayload = DoeRequestPayload.builder().build();
        RequestTask requestTask = RequestTask.builder()
                .request(Request.builder()
                        .payload(doeRequestPayload)
                        .build())
                .payload(requestTaskPayload)
                .build();

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .signatory("signatory")
                .build();

        AppUser appUser = AppUser.builder().userId("user").build();

        doNothing().when(doeValidatorService).validateDoe(any());
        when(decisionNotificationUsersValidator
                .areUsersValid(any(RequestTask.class), any(DecisionNotification.class), any(AppUser.class)))
                .thenReturn(true);

        // Invoke
        service.applySubmitNotify(requestTask, decisionNotification, appUser);

        assertThat(doeRequestPayload.getDoe()).isEqualTo(doe);
        assertThat(doeRequestPayload.getSectionsCompleted()).isEqualTo(Map.of("section1", "true"));
        assertThat(doeRequestPayload.getDoeAttachments()).containsExactlyEntriesOf(Map.of(att1, "atta1.pdf"));
    }
}
