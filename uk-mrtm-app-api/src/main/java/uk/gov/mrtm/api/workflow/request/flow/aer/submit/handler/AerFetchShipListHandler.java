package uk.gov.mrtm.api.workflow.request.flow.aer.submit.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper.AerMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AerFetchShipListHandler implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private static final AerMapper AER_MAPPER = Mappers.getMapper(AerMapper.class);
    private final RequestTaskService requestTaskService;
    private final EmissionsMonitoringPlanQueryService empQueryService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      RequestTaskActionEmptyPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        Long accountId = requestTask.getRequest().getAccountId();

        EmissionsMonitoringPlanContainer empContainer = empQueryService
                .getEmissionsMonitoringPlanDTOByAccountId(accountId)
                .map(EmissionsMonitoringPlanDTO::getEmpContainer)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));

        EmpEmissions emissions = empContainer.getEmissionsMonitoringPlan().getEmissions();
        AerEmissions aerEmissions = AER_MAPPER.toAerShipEmissions(emissions);

        AerApplicationSubmitRequestTaskPayload taskPayload =
                (AerApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        taskPayload.getAer().setEmissions(aerEmissions);

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.AER_FETCH_EMP_LIST_OF_SHIPS);
    }
}
