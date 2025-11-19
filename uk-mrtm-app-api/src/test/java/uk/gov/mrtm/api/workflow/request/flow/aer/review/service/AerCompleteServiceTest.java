package uk.gov.mrtm.api.workflow.request.flow.aer.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.LimitedCompanyOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerOperatorDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.common.AerSubmitParams;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.service.AerService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper.AerMapper;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestVerificationService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerCompleteServiceTest {

    @InjectMocks
    private AerCompleteService completeService;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestVerificationService requestVerificationService;

    @Mock
    private AerService aerService;

    @Mock
    private AerMapper aerMapper;

    @Test
    void complete_when_reporting_required() {
        String requestId = "REQ_ID";
        Long accountId = 1L;
        Long vbId = 2L;
        String operatorName = "operator name";
        final LimitedCompanyOrganisation organisation = LimitedCompanyOrganisation.builder()
                .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
                .registeredAddress(AddressStateDTO.builder()
                        .line1("line1")
                        .city("city")
                        .country("GR")
                        .state("state")
                        .postcode("postcode")
                        .build())
                .build();
        AerOperatorDetails operatorDetails = AerOperatorDetails.builder()
                .operatorName(operatorName)
                .organisationStructure(organisation)
                .build();
        Aer aer = Aer.builder()
                .operatorDetails(operatorDetails)
                .build();
        AerVerificationReport verificationReport = AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder().build())
                .build();
        AerRequestPayload requestPayload = AerRequestPayload.builder()
                .reportingRequired(true)
                .aer(aer)
                .verificationReport(verificationReport)
                .build();
        AerRequestMetadata metadata = AerRequestMetadata.builder().build();
        Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(
                        RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build(),
                        RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(vbId.toString()).build()
                ))
                .payload(requestPayload)
                .metadata(metadata)
                .build();


        AerContainer aerContainer = AerContainer.builder().reportingRequired(true).aer(aer).build();

        AerSubmitParams submitAerParams = AerSubmitParams.builder()
                .accountId(accountId)
                .aerContainer(aerContainer)
                .build();
        AerTotalReportableEmissions reportableEmissions = AerTotalReportableEmissions.builder()
                .totalEmissions(BigDecimal.valueOf(3456.10))
                .surrenderEmissions(BigDecimal.valueOf(2476.67))
                .lessIslandFerryDeduction(BigDecimal.valueOf(7564.67))
                .less5PercentIceClassDeduction(BigDecimal.valueOf(3902.98))
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(aerMapper.toAerContainer(requestPayload, metadata))
                .thenReturn(aerContainer);
        when(aerService.submitAer(submitAerParams)).thenReturn(Optional.of(reportableEmissions));

        //invoke
        completeService.complete(requestId);

        //verify
        AerRequestMetadata updatedRequestMetadata = (AerRequestMetadata) request.getMetadata();

        assertEquals(reportableEmissions, updatedRequestMetadata.getEmissions());

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestVerificationService, times(1)).refreshVerificationReportVBDetails(verificationReport, vbId);
        verify(aerMapper, times(1)).toAerContainer(requestPayload, metadata);
        verify(aerService, times(1)).submitAer(submitAerParams);
    }

    @Test
    void complete_when_reporting_not_required() {
        String requestId = "REQ_ID";
        Long accountId = 1L;
        AerRequestPayload requestPayload = AerRequestPayload.builder()
                .reportingRequired(false)
                .build();
        AerRequestMetadata metadata = AerRequestMetadata.builder().build();
        Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(
                        RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build()
                ))
                .payload(requestPayload)
                .metadata(metadata)
                .build();


        AerContainer aerContainer = AerContainer.builder().reportingRequired(false).build();

        AerSubmitParams submitAerParams = AerSubmitParams.builder()
                .accountId(accountId)
                .aerContainer(aerContainer)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(aerMapper
                .toAerContainer(requestPayload, metadata))
                .thenReturn(aerContainer);
        when(aerService.submitAer(submitAerParams)).thenReturn(Optional.empty());

        //invoke
        completeService.complete(requestId);

        //verify
        assertNull(metadata.getEmissions());

        verify(requestService, times(1)).findRequestById(requestId);
        verify(aerMapper, times(1)).toAerContainer(requestPayload, metadata);
        verify(aerService, times(1)).submitAer(submitAerParams);
    }

    @Test
    void addRequestAction() {
        String requestId = "REQ_ID";
        Long accountId = 1L;
        Long vbId = 2L;
        String regulatorReviewer = "regulatorReviewer";
        Aer aer = Aer.builder().build();
        AerVerificationReport verificationReport = AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder().build())
                .build();
        AerRequestPayload requestPayload = AerRequestPayload.builder()
                .reportingRequired(true)
                .aer(aer)
                .verificationReport(verificationReport)
                .regulatorReviewer(regulatorReviewer)
                .build();
        AerRequestMetadata metadata = AerRequestMetadata.builder().build();
        Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(
                        RequestResource.builder().resourceType(ResourceType.ACCOUNT).resourceId(accountId.toString()).build(),
                        RequestResource.builder().resourceType(ResourceType.VERIFICATION_BODY).resourceId(vbId.toString()).build()
                ))
                .payload(requestPayload)
                .metadata(metadata)
                .build();

        AerApplicationCompletedRequestActionPayload requestActionPayload =
                AerApplicationCompletedRequestActionPayload.builder().reportingRequired(true).aer(aer).build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(aerMapper.toAerApplicationCompletedRequestActionPayload(requestPayload, MrtmRequestActionPayloadType.AER_APPLICATION_COMPLETED_PAYLOAD, metadata))
                .thenReturn(requestActionPayload);

        //invoke
        completeService.addRequestAction(requestId, false);

        //verify
        verify(requestService, times(1))
                .addActionToRequest(request, requestActionPayload, MrtmRequestActionType.AER_APPLICATION_COMPLETED, regulatorReviewer);

    }

}
