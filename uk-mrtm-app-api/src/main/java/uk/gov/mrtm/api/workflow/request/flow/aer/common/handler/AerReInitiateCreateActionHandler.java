package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestAccountCreateActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;


@Component
@RequiredArgsConstructor
public class AerReInitiateCreateActionHandler implements RequestAccountCreateActionHandler<ReportRelatedRequestCreateActionPayload> {

    private final RequestService requestService;
    private final StartProcessRequestService startProcessRequestService;

    @Override
    public String process(Long accountId, ReportRelatedRequestCreateActionPayload payload, AppUser appUser) {
        Request request = requestService.findRequestById(payload.getRequestId());
        AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();
        requestPayload.clearRegulatorData();

        // Restart AER
        startProcessRequestService.reStartProcess(request);

        // Add action
        requestService.addActionToRequest(
                request,
                null,
                MrtmRequestActionType.AER_APPLICATION_RE_INITIATED,
                appUser.getUserId());

        return payload.getRequestId();
    }

    @Override
    public String getRequestType() {
        return MrtmRequestType.AER;
    }
}
