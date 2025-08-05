package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmpVariationApplicationRegulatorLedApprovedRequestActionPayload
        extends EmpVariationApplicationSubmittedRequestActionPayload {

    @Valid
    @NotNull
    private EmissionsMonitoringPlanContainer originalEmpContainer;

    @Builder.Default
    private Map<EmpReviewGroup, EmpAcceptedVariationDecisionDetails> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);

    @Valid
    @NotNull
    private EmpVariationRegulatorLedReason reasonRegulatorLed;

    @Valid
    @NotNull
    private DecisionNotification decisionNotification;

    @Valid
    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Map<String, RequestActionUserInfo> usersInfo = new HashMap<>();

    @NotNull
    private FileInfoDTO officialNotice;

    @NotNull
    private FileInfoDTO empDocument;

    @Override
    @JsonIgnore
    public Map<UUID, String> getFileDocuments() {
        return Stream.of(super.getFileDocuments(),
                        Map.of(
                                UUID.fromString(officialNotice.getUuid()), officialNotice.getName(),
                                UUID.fromString(empDocument.getUuid()), empDocument.getName()
                        )
                )
                .flatMap(m -> m.entrySet().stream()).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public Map<UUID, String> getAttachments() {

        final Map<UUID, String> originalAttachments = originalEmpContainer != null ?
                originalEmpContainer.getEmpAttachments() : new HashMap<>();

        return Stream.of(super.getEmpAttachments(), originalAttachments).flatMap(m -> m.entrySet().stream()).collect(
                Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (first, second) -> first)
        );
    }
}
