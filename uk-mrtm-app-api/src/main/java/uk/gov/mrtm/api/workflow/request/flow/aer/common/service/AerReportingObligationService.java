package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerCustomProcessVariablesUtil;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AerReportingObligationService {

    private final WorkflowService workflowService;
    private final RequestService requestService;
    private final AerRequestIdGenerator aerRequestIdGenerator;
    private final StartProcessRequestService startProcessRequestService;
    private final RequestCustomRepository requestRepository;
    private final ReportableEmissionsService reportableEmissionsService;

    @Transactional
    public void markAsExempt(Long accountId, String submitterId, Year year) {
        RequestParams params = RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestMetadata(AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(year).build())
            .build();
        String requestId = aerRequestIdGenerator.generate(params);
        Request aerRequest = requestService.findRequestById(requestId);

        if (aerRequest != null) {
            if (RequestStatuses.IN_PROGRESS.equals(aerRequest.getStatus())) {
                markAsExempt(aerRequest, submitterId);
            } else {
                //mark emissions for aerRequest request as exempted
                ((AerRequestMetadata) aerRequest.getMetadata()).setExempted(true);
            }
            //mark emissions derived from doe requests as exempted
            updateDoeEmissionsExemptedFlag(accountId, year, true);
            cancelInProgressDoeRequests(accountId, year, submitterId);
        }


        //reportable emissions for the reporting year here marked as exempted
        reportableEmissionsService.updateReportableEmissionsExemptedFlag(accountId, year, true);
    }

    private void cancelInProgressDoeRequests(Long accountId, Year year, String submitterId) {
        Optional<Request> doeOptional = requestRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), year.getValue());

        if (doeOptional.isPresent()) {
            Request doe =  doeOptional.get();
            workflowService.deleteProcessInstance(doe.getProcessInstanceId(), "DOE workflow terminated since related account was marked as exempt");

            doe.setStatus(MrtmRequestStatus.CANCELLED);

            requestService.addActionToRequest(doe, null, MrtmRequestActionType.DOE_APPLICATION_CANCELLED_DUE_TO_EXEMPT, submitterId);
        }
    }

    public void markAsExempt(Request request, String submitterId) {
        //terminate workflow
        workflowService.deleteProcessInstance(request.getProcessInstanceId(), "AER workflow terminated since related account was marked as exempt");

        //update request status to EXEMPT
        requestService.updateRequestStatus(request.getId(), MrtmRequestStatus.EXEMPT);

        //add cancelled timeline event
        requestService.addActionToRequest(request, null, MrtmRequestActionType.AER_APPLICATION_CANCELLED_DUE_TO_EXEMPT, submitterId);

        //mark emissions for aer request as exempted
        ((AerRequestMetadata) request.getMetadata()).setExempted(true);
    }

    @Transactional
    public void revertExemption(Long accountId, String submitterId, Year year) {
        RequestParams params = RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestMetadata(AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(year).build())
            .build();
        String requestId = aerRequestIdGenerator.generate(params);
        Request aerRequest = requestService.findRequestById(requestId);

        if(MrtmRequestStatus.EXEMPT.equals(aerRequest.getStatus())) {
            revertExemptRequest(aerRequest, submitterId, year);
        } else {
            revertNonExemptRequest(aerRequest);
        }
    }

    private void revertExemptRequest(Request request, String submitterId, Year year) {

        Map<String, Object> processVars = AerCustomProcessVariablesUtil.buildProcessVars(year);
        //start workflow again
        startProcessRequestService.reStartProcess(request, processVars);

        //add timeline event
        requestService.addActionToRequest(request, null, MrtmRequestActionType.AER_APPLICATION_RE_INITIATED, submitterId);

        //remove emissions from request metadata and set exempt flag to false
        AerRequestMetadata requestMetadata = (AerRequestMetadata) request.getMetadata();
        requestMetadata.setEmissions(null);
        requestMetadata.setExempted(false);

        //mark emissions derived from doe requests as not exempted
        updateDoeEmissionsExemptedFlag(request.getAccountId(), requestMetadata.getYear(), false);

        //remove reportable emissions
        reportableEmissionsService.deleteReportableEmissions(request.getAccountId(), requestMetadata.getYear());
    }

    /**
     * Perform actions needed when the reporting status of the account linked to the provided request turns to
     * {@link uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus#REQUIRED_TO_REPORT}
     * and the request has already been finalized,
     * i.e. request status is {@link RequestStatuses#COMPLETED} or {@link MrtmRequestStatus#CANCELLED}.
     * @param request {@link Request}
     */
    private void revertNonExemptRequest(Request request) {
        //mark emissions for aer request as not exempted
        AerRequestMetadata requestMetadata = (AerRequestMetadata) request.getMetadata();
        requestMetadata.setExempted(false);

        //mark emissions derived from doe requests as not exempted
        updateDoeEmissionsExemptedFlag(request.getAccountId(), requestMetadata.getYear(), false);

        //reportable emissions for the reporting year here marked as not exempted
        reportableEmissionsService.updateReportableEmissionsExemptedFlag(request.getAccountId(), requestMetadata.getYear(), false);
    }

    private void updateDoeEmissionsExemptedFlag(Long accountId, Year reportingYear, boolean exempted) {
        List<Request> doeRequests = requestRepository
                .findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                        String.valueOf(accountId), reportingYear.getValue());

        doeRequests.forEach(request -> ((DoeRequestMetadata) request.getMetadata()).setExempted(exempted));
    }
}
