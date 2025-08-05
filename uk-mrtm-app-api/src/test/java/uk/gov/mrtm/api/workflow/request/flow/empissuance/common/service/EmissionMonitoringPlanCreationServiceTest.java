package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmissionMonitoringPlanCreationServiceTest {

    @InjectMocks
    private EmissionMonitoringPlanCreationService emissionMonitoringPlanCreationService;

    @Mock
    private  EmpCreationRequestParamsBuilderService empCreationRequestParamsBuilderService;

    @Mock
    private  StartProcessRequestService startProcessRequestService;

    @Test
    void createRequestEmissionMonitoringPlan() {
        Long accountId = 1L;

        RequestParams requestParams = RequestParams.builder()
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .build();

        when(empCreationRequestParamsBuilderService.buildRequestParams(accountId)).thenReturn(requestParams);

        emissionMonitoringPlanCreationService.createRequestEmissionMonitoringPlan(accountId);

        verify(empCreationRequestParamsBuilderService).buildRequestParams(accountId);
        verify(startProcessRequestService, times(1)).startProcess(requestParams);
    }
}
