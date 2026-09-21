package uk.gov.mrtm.api.workflow.request.flow.rde.handler;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.rde.domain.RdeSaveRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.rde.domain.RdeData;
import uk.gov.netz.api.workflow.request.flow.rde.domain.RdePayload;
import uk.gov.netz.api.workflow.request.flow.rde.domain.RequestPayloadRdeable;

@Component
@RequiredArgsConstructor
public class RdeSaveActionHandler implements RequestTaskActionHandler<RdeSaveRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final RdeSaveRequestTaskActionPayload actionPayload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final RdePayload rdePayload = actionPayload.getRdePayload();
        final RequestPayloadRdeable requestPayload = (RequestPayloadRdeable) requestTask.getRequest().getPayload();

        requestPayload.setRdeData(RdeData.builder()
                .rdePayload(rdePayload)
                .currentDueDate(requestTask.getDueDate())
                .build());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.RDE_SAVE);
    }
}
