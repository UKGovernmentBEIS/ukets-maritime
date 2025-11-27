package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service.RequestEmpService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.util.List;

@Component
@RequiredArgsConstructor
public class EmpIssuanceApplyImportThirdPartyDataActionHandler implements RequestTaskActionHandler<EmpIssuanceSaveApplicationRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestEmpService requestEmpService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      EmpIssuanceSaveApplicationRequestTaskActionPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        requestEmpService.updateStagingEmp(requestTask);
        requestEmpService.applySaveAction(payload, requestTask);

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_ISSUANCE_IMPORT_THIRD_PARTY_DATA_APPLICATION);
    }
}
