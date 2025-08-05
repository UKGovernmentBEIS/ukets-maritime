package uk.gov.mrtm.api.workflow.request.flow.aer.submit.handler;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusQueryService;
import uk.gov.mrtm.api.account.transform.AddressStateMapper;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.EmpOriginatedData;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AerApplicationSubmitInitializer implements InitializeRequestTaskHandler {
	
	private final MrtmAccountQueryService mrtmAccountQueryService;
    private final AccountReportingStatusQueryService accountReportingStatusQueryService;
    private final AddressStateMapper addressStateMapper;

    @Override
    public RequestTaskPayload initializePayload(Request request) {
        AerRequestMetadata requestMetadata = (AerRequestMetadata) request.getMetadata();
        AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();

        final Long verificationBodyId = !ObjectUtils.isEmpty(requestPayload.getVerificationReport()) ?
            requestPayload.getVerificationReport().getVerificationBodyId() : null;

        MrtmAccount account = mrtmAccountQueryService.getAccountById(request.getAccountId());
        final MrtmAccountReportingStatus accountReportingStatus = accountReportingStatusQueryService
            .getReportingStatusByYear(account.getId(), requestMetadata.getYear()).getStatus();
        boolean sendEmailNotification = !MrtmAccountReportingStatus.EXEMPT.equals(accountReportingStatus);

        final EmpOriginatedData originatedData = requestPayload.getEmpOriginatedData();
        final Aer aer = requestPayload.getAer();
        if(aer != null && aer.getOperatorDetails() != null) {
            aer.getOperatorDetails().setOperatorName(account.getName());
            aer.getOperatorDetails().setContactAddress(addressStateMapper.toAddressState(account.getAddress()));
        }

        return AerApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.AER_APPLICATION_SUBMIT_PAYLOAD)
            .sendEmailNotification(sendEmailNotification)
            .reportingYear(requestMetadata.getYear())
            .reportingRequired(requestPayload.getReportingRequired())
            .reportingObligationDetails(requestPayload.getReportingObligationDetails())
            .aer(requestPayload.getAer())
            .aerAttachments(requestPayload.getAerAttachments())
            .aerSectionsCompleted(requestPayload.getAerSectionsCompleted())
            .verificationSectionsCompleted(requestPayload.getVerificationSectionsCompleted())
            .empOriginatedData(originatedData)
            .aerMonitoringPlanVersion(requestPayload.getAerMonitoringPlanVersion())
            .verificationBodyId(verificationBodyId)
            .verificationPerformed(requestPayload.isVerificationPerformed())
            .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.AER_APPLICATION_SUBMIT);
    }

}
