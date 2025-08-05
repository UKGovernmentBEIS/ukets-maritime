package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RequestPayloadRfiable;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RfiData;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpNotificationRequestPayload extends RequestPayload implements RequestPayloadRfiable {

    private EmissionsMonitoringPlanNotification emissionsMonitoringPlanNotification;

    @Builder.Default
    private Map<UUID, String> empNotificationAttachments = new HashMap<>();

    private EmpNotificationReviewDecision reviewDecision;

    private DecisionNotification reviewDecisionNotification;

    private String followUpResponse;

    @Builder.Default
    private Set<UUID> followUpResponseFiles = new HashSet<>();

    @Builder.Default
    private Map<UUID, String> followUpResponseAttachments = new HashMap<>();

    private LocalDate followUpResponseSubmissionDate;

    private EmpNotificationFollowUpReviewDecision followUpReviewDecision;

    private DecisionNotification followUpReviewDecisionNotification;

    @Builder.Default
    private Map<String, String> followUpReviewSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<String, String> followUpSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<String, String> amendsSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<String, String> reviewSectionsCompleted = new HashMap<>();

    private FileInfoDTO officialNotice;

    @JsonUnwrapped
    private RfiData rfiData;
}
