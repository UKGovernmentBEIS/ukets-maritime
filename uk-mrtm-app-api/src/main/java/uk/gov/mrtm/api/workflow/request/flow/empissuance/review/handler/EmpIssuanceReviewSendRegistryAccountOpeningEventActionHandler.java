package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanIdentifierGenerator;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.EmpIssuanceSendRegistryAccountOpeningAddRequestActionService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.List;

@Log4j2
@Component
@RequiredArgsConstructor
public class EmpIssuanceReviewSendRegistryAccountOpeningEventActionHandler
        implements RequestTaskActionHandler<RequestTaskActionEmptyPayload> {

    private final RequestTaskService requestTaskService;
    private final ApplicationEventPublisher publisher;
    private final EmissionsMonitoringPlanIdentifierGenerator empIdentifierGenerator;
    private final EmpIssuanceSendRegistryAccountOpeningAddRequestActionService addRequestActionService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      RequestTaskActionEmptyPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        EmpIssuanceApplicationReviewRequestTaskPayload
            requestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        if (!requestTaskPayload.isAccountOpeningEventSentToRegistry()) {
            publisher.publishEvent(EmpApprovedEvent.builder()
                .accountId(requestTask.getRequest().getAccountId())
                .empId(empIdentifierGenerator.generate(requestTask.getRequest().getAccountId()))
                .emissionsMonitoringPlan(requestTaskPayload.getEmissionsMonitoringPlan())
                .build());

            requestTaskPayload.setAccountOpeningEventSentToRegistry(true);
            ((EmpIssuanceRequestPayload) requestTask.getRequest().getPayload()).setAccountOpeningEventSentToRegistry(true);

            addRequestActionService.addRequestAction(
                requestTask.getRequest(),
                requestTaskPayload.getEmissionsMonitoringPlan().getOperatorDetails().getOrganisationStructure(),
                appUser.getUserId());
        }

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_ISSUANCE_SEND_REGISTRY_ACCOUNT_OPENING_EVENT);
    }
}
