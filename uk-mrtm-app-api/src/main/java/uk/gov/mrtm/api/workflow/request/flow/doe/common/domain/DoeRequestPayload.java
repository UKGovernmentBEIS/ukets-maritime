package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerInitiatorRequest;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.payment.domain.RequestPayloadPayable;
import uk.gov.netz.api.workflow.request.flow.payment.domain.RequestPaymentInfo;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class DoeRequestPayload extends RequestPayload implements RequestPayloadPayable {

    private Year reportingYear;

    private AerInitiatorRequest initiatorRequest;

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> doeAttachments = new HashMap<>();

    private RequestPaymentInfo requestPaymentInfo;

    private Doe doe;

    private DecisionNotification decisionNotification;

    private FileInfoDTO officialNotice;
}
