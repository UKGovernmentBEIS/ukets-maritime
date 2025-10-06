package uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.ComplianceRestored;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationClosedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseJustification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDecisionNotification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDetermination;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonCompliancePenalties;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceReason;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.application.taskview.RequestInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class NonComplianceMapperTest {
    private final NonComplianceMapper nonComplianceMapper = Mappers.getMapper(NonComplianceMapper.class);

    @Test
    void toSubmittedRequestAction() {
        final String payloadType = "payloadType";
        final LocalDate nonComplianceDate = LocalDate.now();
        final LocalDate complianceDate = LocalDate.now().plusMonths(1);
        final Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        final String comments = "comments";
        NonCompliancePenalties nonCompliancePenalties = mock(NonCompliancePenalties.class);
        final NonComplianceApplicationSubmitRequestTaskPayload taskPayload =
            NonComplianceApplicationSubmitRequestTaskPayload.builder()
                .availableRequests(List.of(
                        RequestInfoDTO.builder().id("id1").type(MrtmRequestType.EMP_ISSUANCE).build(),
                        RequestInfoDTO.builder().id("id2").type(MrtmRequestType.AER).build(),
                        RequestInfoDTO.builder().id("id3").type(MrtmRequestType.EMP_NOTIFICATION).build()
                    )
                )
                .reason(NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN)
                .nonComplianceDate(nonComplianceDate)
                .complianceDate(complianceDate)
                .nonComplianceComments(comments)
                .nonCompliancePenalties(nonCompliancePenalties)
                .sectionsCompleted(sectionsCompleted)
                .selectedRequests(Set.of("id1", "id2"))
                .payloadType(payloadType)
                .build();

        final NonComplianceApplicationSubmittedRequestActionPayload expectedActionPayload =
            NonComplianceApplicationSubmittedRequestActionPayload.builder()
                .reason(NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN)
                .nonComplianceDate(nonComplianceDate)
                .complianceDate(complianceDate)
                .nonComplianceComments(comments)
                .selectedRequests(Set.of(
                    RequestInfoDTO.builder().id("id1").type(MrtmRequestType.EMP_ISSUANCE).build(),
                    RequestInfoDTO.builder().id("id2").type(MrtmRequestType.AER).build()))
                .nonCompliancePenalties(nonCompliancePenalties)
                .payloadType(payloadType)
                .sectionsCompleted(sectionsCompleted)
                .build();

        final NonComplianceApplicationSubmittedRequestActionPayload actionPayload =
            nonComplianceMapper.toSubmittedRequestAction(taskPayload, payloadType);

        assertEquals(expectedActionPayload, actionPayload);
    }

    @Test
    void toNonComplianceInitialPenaltyNoticeRequestTaskPayload() {
        String payloadType = "payloadType";
        NonComplianceCloseJustification closeJustification = mock(NonComplianceCloseJustification.class);
        String comments = "comments";
        UUID initialPenaltyNotice = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        NonComplianceRequestPayload requestPayload = NonComplianceRequestPayload.builder()
            .initialPenaltyComments(comments)
            .issueNoticeOfIntent(true)
            .initialPenaltyNotice(initialPenaltyNotice)
            .closeJustification(closeJustification)
            .nonComplianceAttachments(attachments)
            .initialPenaltySectionsCompleted(sectionsCompleted)
            .noticeOfIntent(UUID.randomUUID())
            .noticeOfIntentComments("noticeOfIntentComments")
            .noticeOfIntentSectionsCompleted(Map.of("B", "COMPLETED"))
            .civilPenalty(UUID.randomUUID())
            .civilPenaltyAmount(BigDecimal.ONE)
            .civilPenaltyDueDate(LocalDate.now())
            .civilPenaltyComments("civilPenaltyComments")
            .civilPenaltySectionsCompleted(Map.of("C", "COMPLETED"))
            .reIssueCivilPenalty(true)
            .build();

        NonComplianceInitialPenaltyNoticeRequestTaskPayload expectedRequestTaskPayload =
            NonComplianceInitialPenaltyNoticeRequestTaskPayload.builder()
                .comments(comments)
                .issueNoticeOfIntent(true)
                .initialPenaltyNotice(initialPenaltyNotice)
                .closeJustification(closeJustification)
                .nonComplianceAttachments(attachments)
                .payloadType(payloadType)
                .sectionsCompleted(sectionsCompleted)
                .build();

        final NonComplianceInitialPenaltyNoticeRequestTaskPayload taskPayload =
            nonComplianceMapper.toNonComplianceInitialPenaltyNoticeRequestTaskPayload(requestPayload, payloadType);

        assertEquals(expectedRequestTaskPayload, taskPayload);
    }

    @Test
    void toNonComplianceNoticeOfIntentRequestTaskPayload() {
        String payloadType = "payloadType";
        NonComplianceCloseJustification closeJustification = mock(NonComplianceCloseJustification.class);
        String comments = "comments";
        UUID noticeOfIntent = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        Map<String, String> sectionsCompleted = Map.of("B", "COMPLETED");
        NonComplianceRequestPayload requestPayload = NonComplianceRequestPayload.builder()
            .noticeOfIntentComments(comments)
            .issueNoticeOfIntent(true)
            .noticeOfIntent(noticeOfIntent)
            .closeJustification(closeJustification)
            .nonComplianceAttachments(attachments)
            .initialPenaltySectionsCompleted(Map.of("A", "COMPLETED"))
            .initialPenaltyNotice(UUID.randomUUID())
            .initialPenaltyComments("initialPenaltyComments")
            .noticeOfIntentSectionsCompleted(sectionsCompleted)
            .civilPenalty(UUID.randomUUID())
            .civilPenaltyAmount(BigDecimal.ONE)
            .civilPenaltyDueDate(LocalDate.now())
            .civilPenaltyComments("civilPenaltyComments")
            .civilPenaltySectionsCompleted(Map.of("C", "COMPLETED"))
            .reIssueCivilPenalty(true)
            .build();

        NonComplianceNoticeOfIntentRequestTaskPayload expectedRequestTaskPayload =
            NonComplianceNoticeOfIntentRequestTaskPayload.builder()
                .comments(comments)
                .noticeOfIntent(noticeOfIntent)
                .closeJustification(closeJustification)
                .nonComplianceAttachments(attachments)
                .payloadType(payloadType)
                .sectionsCompleted(sectionsCompleted)
                .build();

        final NonComplianceNoticeOfIntentRequestTaskPayload taskPayload =
            nonComplianceMapper.toNonComplianceNoticeOfIntentRequestTaskPayload(requestPayload, payloadType);

        assertEquals(expectedRequestTaskPayload, taskPayload);
    }

    @Test
    void toInitialPenaltyNoticeSubmittedRequestAction() {
        String payloadType = "payloadType";
        NonComplianceCloseJustification closeJustification = mock(NonComplianceCloseJustification.class);
        String comments = "comments";
        UUID initialPenaltyNotice = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");

        NonComplianceDecisionNotification decisionNotification =  mock(NonComplianceDecisionNotification.class);
        Map<String, RequestActionUserInfo> usersInfo = Map.of("userId", mock(RequestActionUserInfo.class));

        Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        NonComplianceInitialPenaltyNoticeRequestTaskPayload requestTaskPayload =
            NonComplianceInitialPenaltyNoticeRequestTaskPayload.builder()
                .comments(comments)
                .issueNoticeOfIntent(true)
                .initialPenaltyNotice(initialPenaltyNotice)
                .closeJustification(closeJustification)
                .sectionsCompleted(sectionsCompleted)
                .nonComplianceAttachments(attachments)
                .payloadType(payloadType)
                .build();

        NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload expectedRequestActionPayload =
            NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload.builder()
                .initialPenaltyNotice(initialPenaltyNotice)
                .comments(comments)
                .decisionNotification(decisionNotification)
                .nonComplianceAttachments(attachments)
                .payloadType(payloadType)
                .sectionsCompleted(sectionsCompleted)
                .usersInfo(usersInfo)
                .build();

        final NonComplianceInitialPenaltyNoticeApplicationSubmittedRequestActionPayload requestActionPayload =
            nonComplianceMapper.toInitialPenaltyNoticeSubmittedRequestAction(requestTaskPayload, decisionNotification, usersInfo, payloadType);

        assertEquals(expectedRequestActionPayload, requestActionPayload);
    }

    @Test
    void toNoticeOfIntentSubmittedRequestAction() {
        String payloadType = "payloadType";
        NonComplianceCloseJustification closeJustification = mock(NonComplianceCloseJustification.class);
        String comments = "comments";
        UUID noticeOfIntent = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");

        NonComplianceDecisionNotification decisionNotification =  mock(NonComplianceDecisionNotification.class);
        Map<String, RequestActionUserInfo> usersInfo = Map.of("userId", mock(RequestActionUserInfo.class));

        Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        NonComplianceNoticeOfIntentRequestTaskPayload requestTaskPayload =
            NonComplianceNoticeOfIntentRequestTaskPayload.builder()
                .comments(comments)
                .noticeOfIntent(noticeOfIntent)
                .closeJustification(closeJustification)
                .sectionsCompleted(sectionsCompleted)
                .nonComplianceAttachments(attachments)
                .payloadType(payloadType)
                .build();

        NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload expectedRequestActionPayload =
            NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload.builder()
                .noticeOfIntent(noticeOfIntent)
                .comments(comments)
                .decisionNotification(decisionNotification)
                .nonComplianceAttachments(attachments)
                .payloadType(payloadType)
                .sectionsCompleted(sectionsCompleted)
                .usersInfo(usersInfo)
                .build();

        final NonComplianceNoticeOfIntentApplicationSubmittedRequestActionPayload requestActionPayload =
            nonComplianceMapper.toNoticeOfIntentSubmittedRequestAction(requestTaskPayload, decisionNotification, usersInfo, payloadType);

        assertEquals(expectedRequestActionPayload, requestActionPayload);
    }

    @Test
    void toNonComplianceCivilPenaltyRequestTaskPayload() {
        String payloadType = "payloadType";
        NonComplianceCloseJustification closeJustification = mock(NonComplianceCloseJustification.class);
        String comments = "comments";
        UUID civilPenalty = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        Map<String, String> sectionsCompleted = Map.of("B", "COMPLETED");
        BigDecimal penaltyAmount = BigDecimal.ONE;
        LocalDate civilPenaltyDueDate = LocalDate.now();
        NonComplianceRequestPayload requestPayload = NonComplianceRequestPayload.builder()
            .issueNoticeOfIntent(true)
            .closeJustification(closeJustification)
            .noticeOfIntentComments("noticeOfIntentComments")
            .initialPenaltySectionsCompleted(Map.of("A", "COMPLETED"))
            .initialPenaltyNotice(UUID.randomUUID())
            .initialPenaltyComments("initialPenaltyComments")
            .noticeOfIntentSectionsCompleted(Map.of("C", "COMPLETED"))
            .noticeOfIntent(UUID.randomUUID())
            .reIssueCivilPenalty(true)
            .civilPenalty(civilPenalty)
            .civilPenaltyAmount(penaltyAmount)
            .civilPenaltyDueDate(civilPenaltyDueDate)
            .civilPenaltyComments(comments)
            .nonComplianceAttachments(attachments)
            .civilPenaltySectionsCompleted(sectionsCompleted)
            .build();

        NonComplianceCivilPenaltyRequestTaskPayload expectedRequestTaskPayload =
            NonComplianceCivilPenaltyRequestTaskPayload.builder()
                .civilPenalty(civilPenalty)
                .penaltyAmount(penaltyAmount)
                .dueDate(civilPenaltyDueDate)
                .comments(comments)
                .closeJustification(closeJustification)
                .nonComplianceAttachments(attachments)
                .sectionsCompleted(sectionsCompleted)
                .payloadType(payloadType)
                .build();

        final NonComplianceCivilPenaltyRequestTaskPayload taskPayload =
            nonComplianceMapper.toNonComplianceCivilPenaltyRequestTaskPayload(requestPayload, payloadType);

        assertEquals(expectedRequestTaskPayload, taskPayload);
    }

    @Test
    void toCivilPenaltySubmittedRequestAction() {
        String payloadType = "payloadType";
        UUID civilPenalty = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        NonComplianceDecisionNotification decisionNotification =  mock(NonComplianceDecisionNotification.class);
        Map<String, RequestActionUserInfo> usersInfo = Map.of("userId", mock(RequestActionUserInfo.class));
        Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        BigDecimal penaltyAmount = BigDecimal.ONE;
        LocalDate civilPenaltyDueDate = LocalDate.now();
        String comments = "comments";
        NonComplianceCloseJustification closeJustification = mock(NonComplianceCloseJustification.class);

        NonComplianceCivilPenaltyRequestTaskPayload requestActionPayload =
            NonComplianceCivilPenaltyRequestTaskPayload.builder()
                .civilPenalty(civilPenalty)
                .penaltyAmount(penaltyAmount)
                .dueDate(civilPenaltyDueDate)
                .comments(comments)
                .closeJustification(closeJustification)
                .nonComplianceAttachments(attachments)
                .sectionsCompleted(sectionsCompleted)
                .payloadType(payloadType)
                .build();

        NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload expectedRequestActionPayload =
            NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload.builder()
                .civilPenalty(civilPenalty)
                .decisionNotification(decisionNotification)
                .nonComplianceAttachments(attachments)
                .comments(comments)
                .payloadType(payloadType)
                .dueDate(civilPenaltyDueDate)
                .penaltyAmount(penaltyAmount)
                .sectionsCompleted(sectionsCompleted)
                .usersInfo(usersInfo)
                .build();

        final NonComplianceCivilPenaltyApplicationSubmittedRequestActionPayload actualRequestActionPayload =
            nonComplianceMapper.toCivilPenaltySubmittedRequestAction(requestActionPayload, decisionNotification, usersInfo, payloadType);

        assertEquals(expectedRequestActionPayload, actualRequestActionPayload);
    }

    @Test
    void toFinalDeterminationSubmittedRequestAction() {
        String payloadType = "payloadType";
        Map<String, String> sectionsCompleted = Map.of("A", "COMPLETED");
        LocalDate operatorPaidDate = LocalDate.now();
        LocalDate complianceRestoredDate = LocalDate.now().minusMonths(1);
        String comments = "comments";
        boolean reissuePenalty = true;
        boolean operatorPaid = true;
        ComplianceRestored complianceRestored = ComplianceRestored.NOT_APPLICABLE;

        NonComplianceFinalDeterminationRequestTaskPayload requestTaskPayload =
            NonComplianceFinalDeterminationRequestTaskPayload.builder()
                .sectionsCompleted(sectionsCompleted)
                .finalDetermination(
                    NonComplianceFinalDetermination.builder()
                        .complianceRestored(complianceRestored)
                        .complianceRestoredDate(complianceRestoredDate)
                        .comments(comments)
                        .reissuePenalty(reissuePenalty)
                        .operatorPaid(operatorPaid)
                        .operatorPaidDate(operatorPaidDate)
                        .build())
                .build();

        NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload expectedRequestActionPayload =
            NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload.builder()
                .sectionsCompleted(sectionsCompleted)
                .payloadType(payloadType)
                .finalDetermination(
                    NonComplianceFinalDetermination.builder()
                        .complianceRestored(complianceRestored)
                        .complianceRestoredDate(complianceRestoredDate)
                        .comments(comments)
                        .reissuePenalty(reissuePenalty)
                        .operatorPaid(operatorPaid)
                        .operatorPaidDate(operatorPaidDate)
                        .build())
                .build();

        final NonComplianceFinalDeterminationApplicationSubmittedRequestActionPayload actualRequestActionPayload =
            nonComplianceMapper.toFinalDeterminationSubmittedRequestAction(requestTaskPayload, payloadType);

        assertEquals(expectedRequestActionPayload, actualRequestActionPayload);
    }

    @Test
    void toClosedRequestAction() {
        String payloadType = "payloadType";
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        Set<UUID> files = Set.of(UUID.randomUUID());
        String reason = "reason";
        NonComplianceCloseJustification closeJustification = NonComplianceCloseJustification.builder()
            .reason(reason).files(files).build();

        NonComplianceRequestPayload requestPayload =
            NonComplianceRequestPayload.builder()
                .closeJustification(closeJustification)
                .initialPenaltyNotice(UUID.randomUUID())
                .initialPenaltyComments("initialPenaltyComments")
                .initialPenaltySectionsCompleted(Map.of("A", "B"))
                .issueNoticeOfIntent(true)
                .noticeOfIntent(UUID.randomUUID())
                .noticeOfIntentComments("noticeOfIntentComments")
                .noticeOfIntentSectionsCompleted(Map.of("C", "D"))
                .civilPenalty(UUID.randomUUID())
                .civilPenaltyAmount(BigDecimal.ONE)
                .civilPenaltyDueDate(LocalDate.now())
                .civilPenaltyComments("civilPenaltyComments")
                .civilPenaltySectionsCompleted(Map.of("E", "F"))
                .reIssueCivilPenalty(true)
                .nonComplianceAttachments(attachments)
                .build();

        NonComplianceApplicationClosedRequestActionPayload expectedRequestActionPayload =
            NonComplianceApplicationClosedRequestActionPayload.builder()
                .closeJustification(closeJustification)
                .payloadType(payloadType)
                .nonComplianceAttachments(attachments)
                .build();

        final NonComplianceApplicationClosedRequestActionPayload actualRequestActionPayload =
            nonComplianceMapper.toClosedRequestAction(requestPayload, payloadType);

        assertEquals(expectedRequestActionPayload, actualRequestActionPayload);
    }

}