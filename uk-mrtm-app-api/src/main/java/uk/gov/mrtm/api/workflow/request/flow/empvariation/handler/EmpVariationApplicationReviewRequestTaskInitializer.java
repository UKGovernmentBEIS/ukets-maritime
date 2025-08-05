package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import lombok.RequiredArgsConstructor;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationReviewMapper;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.HashMap;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpVariationApplicationReviewRequestTaskInitializer implements InitializeRequestTaskHandler {

    private static final EmpVariationReviewMapper EMP_VARIATION_REVIEW_MAPPER = Mappers
            .getMapper(EmpVariationReviewMapper.class);
    private final EmissionsMonitoringPlanQueryService empQueryService;

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        EmissionsMonitoringPlanContainer originalEmpContainer = empQueryService
                .getEmissionsMonitoringPlanDTOByAccountId(request.getAccountId())
                .map(EmissionsMonitoringPlanDTO::getEmpContainer)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        final EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload = EMP_VARIATION_REVIEW_MAPPER
                .toEmpVariationApplicationReviewRequestTaskPayload(
                        requestPayload, MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_REVIEW_PAYLOAD);

        requestTaskPayload.setOriginalEmpContainer(originalEmpContainer);
        requestTaskPayload.setEmpSectionsCompleted(new HashMap<>());

        if (reviewGroupDecisionsNotYetSet(requestPayload)) {
            requestTaskPayload.setReviewGroupDecisions(EmpReviewGroup.getStandardReviewGroups().stream()
                    .filter(empReviewGroup -> !requestPayload.getUpdatedSubtasks().contains(empReviewGroup))
                    .collect(Collectors.toMap(Function.identity(), reviewGroup -> EmpVariationReviewDecision
                            .builder()
                            .type(EmpVariationReviewDecisionType.ACCEPTED)
                            .details(EmpAcceptedVariationDecisionDetails
                                    .builder()
                                    .build())
                            .build())));

        }

        return requestTaskPayload;
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW);
    }

    private boolean reviewGroupDecisionsNotYetSet(EmpVariationRequestPayload requestPayload) {
        return requestPayload.getReviewGroupDecisions() == null ||
                requestPayload.getReviewGroupDecisions().isEmpty() ||
                requestPayload.getEmpVariationDetailsReviewDecision() == null;
    }
}
