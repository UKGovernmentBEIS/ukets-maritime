package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotificationContainer;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSaveRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper.EmpNotificationMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class RequestEmpNotificationService {

    private final RequestService requestService;
    private final EmpNotificationApplicationSubmitValidatorService empNotificationApplicationSubmitValidatorService;
    private static final EmpNotificationMapper empNotificationMapper = Mappers.getMapper(EmpNotificationMapper.class);

    @Transactional
    public void applySavePayload(EmpNotificationApplicationSaveRequestTaskActionPayload actionPayload,
                                 RequestTask requestTask) {
        EmpNotificationApplicationSubmitRequestTaskPayload taskPayload = (EmpNotificationApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        if (taskPayload == null) {
            taskPayload = EmpNotificationApplicationSubmitRequestTaskPayload.builder()
                    .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMIT_PAYLOAD).build();
            requestTask.setPayload(taskPayload);
        }

        taskPayload.setEmissionsMonitoringPlanNotification(actionPayload.getEmissionsMonitoringPlanNotification());
        taskPayload.setSectionsCompleted(actionPayload.getSectionsCompleted());
    }

    @Transactional
    public void applySubmitPayload(RequestTask requestTask, AppUser appUser) {
        Request request = requestTask.getRequest();
        EmpNotificationApplicationSubmitRequestTaskPayload
                taskPayload = (EmpNotificationApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        EmissionsMonitoringPlanNotificationContainer emissionsMonitoringPlanNotificationContainer =
                empNotificationMapper.toEmpNotificationContainer(taskPayload);

        // Validate EMP notification
        empNotificationApplicationSubmitValidatorService.validateEmpNotification(emissionsMonitoringPlanNotificationContainer);

        // Update request payload
        EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        requestPayload.setEmissionsMonitoringPlanNotification(taskPayload.getEmissionsMonitoringPlanNotification());
        requestPayload.setEmpNotificationAttachments(taskPayload.getEmpNotificationAttachments());
        requestPayload.setSectionsCompleted(taskPayload.getSectionsCompleted());

        // Add action
        EmpNotificationApplicationSubmittedRequestActionPayload applicationSubmittedActionPayload =
                empNotificationMapper.toApplicationSubmittedRequestActionPayload(taskPayload);
        applicationSubmittedActionPayload.setEmpNotificationAttachments(requestPayload.getEmpNotificationAttachments());
        requestService.addActionToRequest(request, applicationSubmittedActionPayload,
                MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_SUBMITTED, appUser.getUserId());
    }
}