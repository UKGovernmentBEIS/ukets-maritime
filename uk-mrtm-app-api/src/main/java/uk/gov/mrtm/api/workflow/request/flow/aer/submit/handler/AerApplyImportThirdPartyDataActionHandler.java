package uk.gov.mrtm.api.workflow.request.flow.aer.submit.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerImportThirdPartyDataRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.service.RequestAerApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AerApplyImportThirdPartyDataActionHandler implements RequestTaskActionHandler<AerImportThirdPartyDataRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestAerApplyService requestAerApplyService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      AerImportThirdPartyDataRequestTaskActionPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        requestAerApplyService.applyStagingData(requestTask, payload);

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.AER_IMPORT_THIRD_PARTY_DATA_APPLICATION);
    }
}
