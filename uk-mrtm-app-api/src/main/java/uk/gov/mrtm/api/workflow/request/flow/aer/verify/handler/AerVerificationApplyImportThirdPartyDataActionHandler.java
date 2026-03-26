package uk.gov.mrtm.api.workflow.request.flow.aer.verify.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationImportThirdPartyDataRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.service.RequestAerApplyVerificationService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.util.List;

@Component
@RequiredArgsConstructor
public class AerVerificationApplyImportThirdPartyDataActionHandler implements RequestTaskActionHandler<AerVerificationImportThirdPartyDataRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestAerApplyVerificationService requestAerApplyVerificationService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      AerVerificationImportThirdPartyDataRequestTaskActionPayload payload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        requestAerApplyVerificationService.applyStagingData(requestTask, payload);

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.AER_VERIFICATION_IMPORT_THIRD_PARTY_DATA_APPLICATION);
    }
}
