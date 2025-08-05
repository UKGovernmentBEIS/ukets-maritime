package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

@Service
@RequiredArgsConstructor
public class EmissionMonitoringPlanCreationService {

    private final EmpCreationRequestParamsBuilderService empCreationRequestParamsBuilderService;
    private final StartProcessRequestService startProcessRequestService;

    public void createRequestEmissionMonitoringPlan(Long accountId) {
        RequestParams requestParams = empCreationRequestParamsBuilderService.buildRequestParams(accountId);
        startProcessRequestService.startProcess(requestParams);
    }
}
