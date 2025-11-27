package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.transform.EmpSubmitMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RequestEmpService {

    private final RequestService requestService;
    private final EmpValidatorService empValidatorService;
    private final StagingEmissionsMonitoringPlanRepository stagingEmpRepository;
    private final DateService dateService;
    private static final EmpSubmitMapper EMP_SUBMIT_MAPPER = Mappers.getMapper(EmpSubmitMapper.class);


    @Transactional
    public void applySaveAction(EmpIssuanceSaveApplicationRequestTaskActionPayload requestTaskActionPayload,
                                RequestTask requestTask) {
        EmpIssuanceApplicationSubmitRequestTaskPayload requestTaskPayload =
                (EmpIssuanceApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        requestTaskPayload.setEmissionsMonitoringPlan(requestTaskActionPayload.getEmissionsMonitoringPlan());
        requestTaskPayload.setEmpSectionsCompleted(requestTaskActionPayload.getEmpSectionsCompleted());
    }

    @Transactional
    public void applySubmitAction(RequestTask requestTask, AppUser appUser) {
        //validate emp
        EmpIssuanceApplicationSubmitRequestTaskPayload empIssuanceApplicationSubmitRequestTaskPayload =
                (EmpIssuanceApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        EmissionsMonitoringPlanContainer empContainer =
                EMP_SUBMIT_MAPPER.toEmissionsMonitoringPlanContainer(empIssuanceApplicationSubmitRequestTaskPayload);

        empValidatorService.validateEmissionsMonitoringPlan(empContainer, requestTask.getRequest().getAccountId());

        //update request payload
        Request request = requestTask.getRequest();
        EmpIssuanceRequestPayload empIssuanceRequestPayload = (EmpIssuanceRequestPayload) request.getPayload();
        empIssuanceRequestPayload.setEmissionsMonitoringPlan(empIssuanceApplicationSubmitRequestTaskPayload.getEmissionsMonitoringPlan());
        empIssuanceRequestPayload.setEmpAttachments(empIssuanceApplicationSubmitRequestTaskPayload.getEmpAttachments());
        empIssuanceRequestPayload.setEmpSectionsCompleted(empIssuanceApplicationSubmitRequestTaskPayload.getEmpSectionsCompleted());

        //add request action for emp submission
        addEmpApplicationSubmittedRequestAction(empIssuanceApplicationSubmitRequestTaskPayload, request, appUser);
    }

    @Transactional
    public void updateStagingEmp(RequestTask requestTask) {
        StagingEmissionsMonitoringPlanEntity stagingEmpEntity =
            stagingEmpRepository.findByAccountId(requestTask.getRequest().getAccountId())
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        stagingEmpEntity.setImportedOn(dateService.getLocalDateTime());
    }

    private void addEmpApplicationSubmittedRequestAction(EmpIssuanceApplicationSubmitRequestTaskPayload empIssuanceApplicationSubmitRequestTaskPayload,
                                                         Request request, AppUser appUser) {

        EmpIssuanceApplicationSubmittedRequestActionPayload empApplicationSubmittedPayload =
                EMP_SUBMIT_MAPPER.toEmpIssuanceApplicationSubmittedRequestActionPayload(empIssuanceApplicationSubmitRequestTaskPayload);

        requestService.addActionToRequest(request, empApplicationSubmittedPayload, MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_SUBMITTED, appUser.getUserId());
    }
}
