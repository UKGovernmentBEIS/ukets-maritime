package uk.gov.mrtm.api.workflow.request.flow.rfi.handler;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.rfi.domain.RfiSaveRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RequestPayloadRfiable;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RequestTaskPayloadRfiAttachable;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RfiData;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RfiSubmitPayload;

@Component
@RequiredArgsConstructor
public class RfiSaveActionHandler implements RequestTaskActionHandler<RfiSaveRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final RfiSaveRequestTaskActionPayload actionPayload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final RequestTaskPayloadRfiAttachable taskPayload = (RequestTaskPayloadRfiAttachable) requestTask.getPayload();
        final RfiSubmitPayload rfiSubmitPayload = actionPayload.getRfiSubmitPayload();
        final RequestPayloadRfiable requestPayload = (RequestPayloadRfiable) requestTask.getRequest().getPayload();

        requestPayload.setRfiData(RfiData.builder()
                .rfiQuestionPayload(rfiSubmitPayload.getRfiQuestionPayload())
                .rfiDeadline(rfiSubmitPayload.getDeadline())
                .rfiAttachments(new HashMap<>(taskPayload.getRfiAttachments()))
                .build());

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.RFI_SAVE);
    }
}
