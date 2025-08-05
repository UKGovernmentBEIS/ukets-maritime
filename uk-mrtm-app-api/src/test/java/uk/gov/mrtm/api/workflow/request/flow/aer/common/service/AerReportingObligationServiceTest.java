package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.service.ReportableEmissionsService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerReportingObligationServiceTest {
    private static final Year YEAR = Year.now();
    private static final String REQUEST_ID_AER = "AER-2025";

    @InjectMocks
    private AerReportingObligationService aerReportingObligationService;

    @Mock
    private RequestCustomRepository requestRepository;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private RequestService requestService;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Mock
    private AerRequestIdGenerator aerRequestIdGenerator;

    @Mock
    private ReportableEmissionsService reportableEmissionsService;

    @Test
    void markAsExempted_when_request_status_in_progress() {
        String aerRequestId = "req-id";
        String submitterId = "submitterId";
        String processInstanceId = "processInstanceId";
        String doeProcessInstanceId = "processInstanceId2";
        Year reportingYear = Year.now().minusYears(1);
        Long accountId = 1L;
        DoeRequestMetadata doeRequestMetadata = DoeRequestMetadata.builder().year(YEAR).isExempted(false).build();
        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().year(reportingYear).build();
        Request aerRequest = Request.builder()
            .id(aerRequestId)
            .status(RequestStatuses.IN_PROGRESS)
            .processInstanceId(processInstanceId)
            .metadata(aerRequestMetadata)
            .build();

        Request doeRequest = Request.builder()
            .status(RequestStatuses.COMPLETED)
            .metadata(doeRequestMetadata)
            .processInstanceId(doeProcessInstanceId)
            .build();

        when(aerRequestIdGenerator.generate(getAerRequestParams(accountId))).thenReturn(REQUEST_ID_AER);
        when(requestService.findRequestById(REQUEST_ID_AER)).thenReturn(aerRequest);
        when(requestRepository.findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue())).thenReturn(List.of(doeRequest));
        when(requestRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), Set.of(RequestStatuses.IN_PROGRESS), YEAR.getValue()))
            .thenReturn(Optional.of(doeRequest));

        assertFalse(((AerRequestMetadata)aerRequest.getMetadata()).isExempted());

        //invoke
        aerReportingObligationService.markAsExempt(accountId, submitterId, YEAR);

        //verify
        assertTrue(((AerRequestMetadata)aerRequest.getMetadata()).isExempted());
        assertTrue(((DoeRequestMetadata)doeRequest.getMetadata()).isExempted());
        assertThat(doeRequest.getStatus()).isEqualTo(MrtmRequestStatus.CANCELLED);

        verify(workflowService).deleteProcessInstance(doeProcessInstanceId,
            "DOE workflow terminated since related account was marked as exempt");
        verify(requestRepository).findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue());
        verify(requestRepository).findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), Set.of(RequestStatuses.IN_PROGRESS), YEAR.getValue());
        verify(requestService).addActionToRequest(doeRequest, null,
            MrtmRequestActionType.DOE_APPLICATION_CANCELLED_DUE_TO_EXEMPT, submitterId);
        verify(reportableEmissionsService).updateReportableEmissionsExemptedFlag(accountId, YEAR, true);
        verify(requestService).findRequestById(REQUEST_ID_AER);
        verify(aerRequestIdGenerator).generate(getAerRequestParams(accountId));
        verify(workflowService).deleteProcessInstance(eq(processInstanceId), anyString());
        verify(requestService).updateRequestStatus(aerRequestId, MrtmRequestStatus.EXEMPT);
        verify(requestService).addActionToRequest(aerRequest, null,
            MrtmRequestActionType.AER_APPLICATION_CANCELLED_DUE_TO_EXEMPT, submitterId);

        verifyNoMoreInteractions(requestService, aerRequestIdGenerator, requestRepository,
            workflowService, reportableEmissionsService);
    }

    @Test
    void markAsExempted_when_request_status_completed() {
        String aerRequestId = "req-id";
        String submitterId = "submitterId";
        String processInstanceId = "processInstanceId";
        String doeProcessInstanceId = "processInstanceId2";
        Long accountId = 1L;
        DoeRequestMetadata doeRequestMetadata = DoeRequestMetadata.builder().year(YEAR).isExempted(false).build();
        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().year(YEAR).build();
        Request aerRequest = Request.builder()
            .id(aerRequestId)
            .status(RequestStatuses.COMPLETED)
            .processInstanceId(processInstanceId)
            .metadata(aerRequestMetadata)
            .build();

        Request doeRequest = Request.builder()
            .status(RequestStatuses.COMPLETED)
            .metadata(doeRequestMetadata)
            .processInstanceId(doeProcessInstanceId)
            .build();

        when(aerRequestIdGenerator.generate(getAerRequestParams(accountId))).thenReturn(REQUEST_ID_AER);
        when(requestService.findRequestById(REQUEST_ID_AER)).thenReturn(aerRequest);
        when(requestRepository.findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue())).thenReturn(List.of(doeRequest));
        when(requestRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), Set.of(RequestStatuses.IN_PROGRESS), YEAR.getValue()))
            .thenReturn(Optional.of(doeRequest));

        //invoke
        aerReportingObligationService.markAsExempt(accountId, submitterId, YEAR);

        //verify
        assertTrue(((DoeRequestMetadata)doeRequest.getMetadata()).isExempted());
        assertTrue(((AerRequestMetadata)aerRequest.getMetadata()).isExempted());
        assertThat(doeRequest.getStatus()).isEqualTo(MrtmRequestStatus.CANCELLED);

        verify(requestService).findRequestById(REQUEST_ID_AER);
        verify(workflowService).deleteProcessInstance(doeProcessInstanceId,
            "DOE workflow terminated since related account was marked as exempt");
        verify(aerRequestIdGenerator).generate(getAerRequestParams(accountId));
        verify(reportableEmissionsService).updateReportableEmissionsExemptedFlag(accountId, YEAR, true);
        verify(requestRepository).findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue());
        verify(requestRepository).findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), Set.of(RequestStatuses.IN_PROGRESS), YEAR.getValue());
        verify(requestService).addActionToRequest(doeRequest, null,
            MrtmRequestActionType.DOE_APPLICATION_CANCELLED_DUE_TO_EXEMPT, submitterId);

        verifyNoMoreInteractions(requestService, aerRequestIdGenerator, requestRepository,
            workflowService, reportableEmissionsService);
    }

    @Test
    void markAsExempted_request_input() {
        String processInstanceId = "processInstanceId";
        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder().year(YEAR).build();
        Request request = Request.builder().id(REQUEST_ID_AER)
            .processInstanceId(processInstanceId)
            .metadata(aerRequestMetadata)
            .build();
        String submitterId = "submitterId";

        assertFalse(((AerRequestMetadata)request.getMetadata()).isExempted());

        aerReportingObligationService.markAsExempt(request, submitterId);

        //verify
        assertTrue(((AerRequestMetadata)request.getMetadata()).isExempted());

        verify(workflowService).deleteProcessInstance(eq(processInstanceId), anyString());
        verify(requestService).updateRequestStatus(REQUEST_ID_AER, MrtmRequestStatus.EXEMPT);
        verify(requestService).addActionToRequest(request, null, MrtmRequestActionType.AER_APPLICATION_CANCELLED_DUE_TO_EXEMPT, submitterId );
        verifyNoInteractions(reportableEmissionsService);
        verifyNoMoreInteractions(requestService, workflowService);
    }

    @Test
    void revertExemption_when_request_status_exempted() {
        String aerRequestId = "req-id";
        String submitterId = "submitterId";
        Long accountId = 1L;
        String requestTypeCode = "requestTypeCode";
        String doeProcessInstanceId = "processInstanceId2";
        DoeRequestMetadata doeRequestMetadata = DoeRequestMetadata.builder().year(YEAR).isExempted(false).build();
        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder()
            .year(YEAR)
            .emissions(AerTotalReportableEmissions.builder()
                    .totalEmissions(BigDecimal.TEN)
                    .surrenderEmissions(BigDecimal.TEN)
                    .lessIslandFerryDeduction(BigDecimal.TEN)
                    .less5PercentIceClassDeduction(BigDecimal.TEN)
                    .build())
            .isExempted(true)
            .build();
        Request aerRequest = Request.builder()
            .id(aerRequestId)
            .type(RequestType.builder().code(requestTypeCode).build())
            .status(MrtmRequestStatus.EXEMPT)
            .metadata(aerRequestMetadata)
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .build();

        Request doeRequest = Request.builder()
            .status(RequestStatuses.COMPLETED)
            .metadata(doeRequestMetadata)
            .processInstanceId(doeProcessInstanceId)
            .build();

        final Map<String, Object> processVars =
                Map.of(MrtmBpmnProcessConstants.AER_EXPIRATION_DATE, DateUtils.atEndOfDay(LocalDate.of(YEAR.plusYears(1).getValue(), 3, 31)));

        when(aerRequestIdGenerator.generate(getAerRequestParams(accountId))).thenReturn(REQUEST_ID_AER);
        when(requestService
            .findRequestById(REQUEST_ID_AER))
            .thenReturn(aerRequest);
        when(requestRepository.findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue())).thenReturn(List.of(doeRequest));

        assertTrue(((AerRequestMetadata)aerRequest.getMetadata()).isExempted());
        assertFalse(((DoeRequestMetadata)doeRequest.getMetadata()).isExempted());

        //invoke
        aerReportingObligationService.revertExemption(accountId, submitterId, YEAR);

        //verify

        assertFalse(((AerRequestMetadata)aerRequest.getMetadata()).isExempted());
        assertNull(((AerRequestMetadata)aerRequest.getMetadata()).getEmissions());

        verify(requestRepository).findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue());
        verify(requestService).findRequestById(REQUEST_ID_AER);
        verify(aerRequestIdGenerator).generate(getAerRequestParams(accountId));
        verify(startProcessRequestService).reStartProcess(aerRequest, processVars);
        verify(requestService)
            .addActionToRequest(aerRequest, null, MrtmRequestActionType.AER_APPLICATION_RE_INITIATED, submitterId);

        verify(requestService, never()).updateRequestStatus(any(), any());
        verifyNoInteractions(workflowService);
        verifyNoMoreInteractions(requestService, aerRequestIdGenerator, startProcessRequestService, requestRepository);
    }

    @Test
    void revertExemption_when_request_status_completed() {
        String aerRequestId = "req-id";
        String submitterId = "submitterId";
        Long accountId = 1L;
        DoeRequestMetadata doeRequestMetadata = DoeRequestMetadata.builder().year(YEAR).isExempted(false).build();
        String doeProcessInstanceId = "processInstanceId2";
        AerRequestMetadata aerRequestMetadata = AerRequestMetadata.builder()
            .year(YEAR)
            .emissions(AerTotalReportableEmissions.builder()
                    .totalEmissions(BigDecimal.TEN)
                    .surrenderEmissions(BigDecimal.TEN)
                    .lessIslandFerryDeduction(BigDecimal.TEN)
                    .less5PercentIceClassDeduction(BigDecimal.TEN)
                    .build())
            .isExempted(true)
            .build();
        Request aerRequest = Request.builder()
            .id(aerRequestId)
            .status(RequestStatuses.COMPLETED)
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .metadata(aerRequestMetadata)
            .build();
        Request doeRequest = Request.builder()
            .status(RequestStatuses.COMPLETED)
            .metadata(doeRequestMetadata)
            .processInstanceId(doeProcessInstanceId)
            .build();

        when(aerRequestIdGenerator.generate(getAerRequestParams(accountId))).thenReturn(REQUEST_ID_AER);
        when(requestService
            .findRequestById(REQUEST_ID_AER))
            .thenReturn(aerRequest);
        when(requestRepository.findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue())).thenReturn(List.of(doeRequest));

        assertTrue(((AerRequestMetadata)aerRequest.getMetadata()).isExempted());
        assertFalse(((DoeRequestMetadata)doeRequest.getMetadata()).isExempted());

        //invoke
        aerReportingObligationService.revertExemption(accountId, submitterId, YEAR);

        //verify

        assertFalse(((AerRequestMetadata)aerRequest.getMetadata()).isExempted());

        verify(requestService).findRequestById(REQUEST_ID_AER);
        verify(aerRequestIdGenerator).generate(getAerRequestParams(accountId));
        verify(requestService, never()).updateRequestStatus(any(), any());
        verify(requestRepository).findByRequestTypeAndResourceAndMetadataYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
            String.valueOf(accountId), YEAR.getValue());

        verifyNoInteractions(workflowService, startProcessRequestService);
        verifyNoMoreInteractions(requestService, aerRequestIdGenerator, requestRepository);
    }

    @Test
    void revertExemption_when_no_request_found() {
        String submitterId = "submitterId";
        Long accountId = 1L;

        when(aerRequestIdGenerator.generate(getAerRequestParams(accountId))).thenReturn(REQUEST_ID_AER);
        when(requestService.findRequestById(REQUEST_ID_AER)).thenReturn(null);

        //invoke
        aerReportingObligationService.markAsExempt(accountId, submitterId, YEAR);

        verify(aerRequestIdGenerator).generate(getAerRequestParams(accountId));
        verify(requestService).findRequestById(REQUEST_ID_AER);
        verify(reportableEmissionsService).updateReportableEmissionsExemptedFlag(accountId, YEAR, true);

        verifyNoMoreInteractions(aerRequestIdGenerator, requestService, reportableEmissionsService);
        verifyNoInteractions(requestRepository, workflowService);
    }

    private RequestParams getAerRequestParams(Long accountId) {
        return RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestMetadata(AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(YEAR).build())
            .build();
    }
}