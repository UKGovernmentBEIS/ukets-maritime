package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondToRegulatorCommentsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.mapper.VirMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class VirApplicationRespondToRegulatorCommentsInitializer implements InitializeRequestTaskHandler {

    private static final VirMapper VIR_MAPPER = Mappers.getMapper(VirMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        
        final VirRequestPayload requestPayload = (VirRequestPayload) request.getPayload();
        final Map<String, RegulatorImprovementResponse> regulatorImprovementResponses = requestPayload.getRegulatorReviewResponse()
                .getRegulatorImprovementResponses()
                .entrySet().stream().filter(entry -> entry.getValue().isImprovementRequired())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

        return VirApplicationRespondToRegulatorCommentsRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.VIR_RESPOND_TO_REGULATOR_COMMENTS_PAYLOAD)
                .verificationData(requestPayload.getVerificationData())
                .operatorImprovementResponses(requestPayload.getOperatorImprovementResponses())
                .regulatorImprovementResponses(VIR_MAPPER.regulatorImprovementResponsesIgnoreComments(regulatorImprovementResponses))
                .virAttachments(requestPayload.getVirAttachments())
                .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS);
    }
}
