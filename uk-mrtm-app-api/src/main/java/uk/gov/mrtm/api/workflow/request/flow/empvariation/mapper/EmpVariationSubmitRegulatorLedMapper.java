package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRegulatorLedApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;

import java.util.AbstractMap;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpVariationSubmitRegulatorLedMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "reviewGroupDecisions", source = "requestPayload.reviewGroupDecisionsRegulatorLed")
    EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload toEmpVariationApplicationSubmitRegulatorLedRequestTaskPayload(
            EmpVariationRequestPayload requestPayload, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "fileDocuments", ignore = true)
    @Mapping(target = "reviewGroupDecisions", source = "requestPayload.reviewGroupDecisionsRegulatorLed")
    @Mapping(target = "reasonRegulatorLed", source = "requestPayload.reasonRegulatorLed")
    EmpVariationApplicationRegulatorLedApprovedRequestActionPayload toEmpVariationApplicationRegulatorLedApprovedRequestActionPayload(
            EmpVariationRequestPayload requestPayload, MrtmAccount accountInfo,
            Map<String, RequestActionUserInfo> usersInfo, String payloadType);

    @Mapping(target = "fileDocuments", ignore = true)
    @Mapping(target = "reviewGroupDecisions", source = "reviewGroupDecisions", qualifiedByName = "reviewGroupDecisionsWithoutNotes")
    EmpVariationApplicationRegulatorLedApprovedRequestActionPayload cloneRegulatorLedApprovedPayloadIgnoreDecisionNotes(
            EmpVariationApplicationRegulatorLedApprovedRequestActionPayload payload);

    @Named("reviewGroupDecisionsWithoutNotes")
    default Map<EmpReviewGroup, EmpAcceptedVariationDecisionDetails> setReviewGroupDecisionsWithoutNotes(
            Map<EmpReviewGroup, EmpAcceptedVariationDecisionDetails> reviewGroupDecisions) {
        return reviewGroupDecisions.entrySet().stream()
                .map(entry ->
                        new AbstractMap.SimpleEntry<>(entry.getKey(),
                                EmpAcceptedVariationDecisionDetails.builder()
                                        .variationScheduleItems(entry.getValue().getVariationScheduleItems())
                                        .build())
                ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
