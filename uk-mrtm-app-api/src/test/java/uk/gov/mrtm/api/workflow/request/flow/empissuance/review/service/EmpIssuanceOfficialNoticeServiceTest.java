package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import uk.gov.mrtm.api.common.config.RegistryConfig;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateOfficialNoticeParamsProvider;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateParamsSourceData;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.OfficialNoticeSendService;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceOfficialNoticeServiceTest {

    @InjectMocks
    private EmpIssuanceOfficialNoticeService empIssuanceOfficialNoticeService;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Mock
    private DecisionNotificationUsersService decisionNotificationUsersService;

    @Mock
    private FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    @Mock
    private DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;

    @Mock
    private OfficialNoticeSendService officialNoticeSendService;

    @Mock
    private RegistryConfig registryConfig;

    @Mock
    private ApplicationEventPublisher publisher;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @Mock
    private EmpIssuanceSendRegistryAccountOpeningAddRequestActionService requestActionService;

    @Captor
    private ArgumentCaptor<EmpApprovedEvent> empApprovedEventArgumentCaptor;

    @Test
    void generateGrantedOfficialNotice() throws InterruptedException, ExecutionException {
        String requestId = "1";
        String fileName = "emp_application_approved.pdf";

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator"))
                .signatory("signatory")
                .build();
        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
                .decisionNotification(decisionNotification)
                .build();
        Request request = Request.builder().payload(requestPayload).build();

        TemplateParams templateParams = TemplateParams.builder().build();
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();

        UserInfoDTO accountPrimaryContactInfo = UserInfoDTO.builder().email("user@pmrv.uk").build();
        UserInfoDTO serviceContactInfo = UserInfoDTO.builder().email("service-contact@pmrv.uk").build();
        List<String> decisionNotificationUserEmails = List.of("operator@pmrv.uk");
        DocumentTemplateParamsSourceData documentTemplateSourceParams =
                DocumentTemplateParamsSourceData.builder()
                        .contextActionType(MrtmDocumentTemplateGenerationContextActionType.EMP_ISSUANCE_GRANTED)
                        .request(request)
                        .signatory(decisionNotification.getSignatory())
                        .accountPrimaryContact(accountPrimaryContactInfo)
                        .toRecipientEmail(serviceContactInfo.getEmail())
                        .ccRecipientsEmails(decisionNotificationUserEmails)
                        .build();

        when(requestService.findRequestById(requestId))
                .thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(accountPrimaryContactInfo));
        when(requestAccountContactQueryService.getRequestAccountServiceContact(request))
                .thenReturn(Optional.of(serviceContactInfo));
        when(decisionNotificationUsersService.findUserEmails(decisionNotification))
                .thenReturn(decisionNotificationUserEmails);
        when(documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(documentTemplateSourceParams))
                .thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateAndSaveFileDocumentAsync(
                MrtmDocumentTemplateType.EMP_ISSUANCE_GRANTED, templateParams, fileName))
                .thenReturn(CompletableFuture.completedFuture(officialDocFileInfoDTO));

        // Invoke
        CompletableFuture<FileInfoDTO> result = empIssuanceOfficialNoticeService.generateGrantedOfficialNotice(requestId);

        assertThat(result.get()).isEqualTo(officialDocFileInfoDTO);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(documentTemplateOfficialNoticeParamsProvider, times(1)).constructTemplateParams(documentTemplateSourceParams);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateAndSaveFileDocumentAsync(
                MrtmDocumentTemplateType.EMP_ISSUANCE_GRANTED, templateParams, fileName);
        verifyNoInteractions(requestActionService);
    }

    @Test
    void generateAndSaveDeemedWithdrawnOfficialNotice() {
        String requestId = "1";
        String fileName = "emp_application_withdrawn.pdf";

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator"))
                .signatory("signatory")
                .build();
        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
                .decisionNotification(decisionNotification)
                .build();
        Request request = Request.builder().payload(requestPayload).build();

        TemplateParams templateParams = TemplateParams.builder().build();
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();

        UserInfoDTO accountPrimaryContactInfo = UserInfoDTO.builder().email("user@pmrv.uk").build();
        UserInfoDTO serviceContactInfo = UserInfoDTO.builder().email("service-contact@pmrv.uk").build();
        List<String> decisionNotificationUserEmails = List.of("operator@pmrv.uk");
        DocumentTemplateParamsSourceData documentTemplateSourceParams =
                DocumentTemplateParamsSourceData.builder()
                        .contextActionType(MrtmDocumentTemplateGenerationContextActionType.EMP_ISSUANCE_DEEMED_WITHDRAWN)
                        .request(request)
                        .signatory(decisionNotification.getSignatory())
                        .accountPrimaryContact(accountPrimaryContactInfo)
                        .toRecipientEmail(serviceContactInfo.getEmail())
                        .ccRecipientsEmails(decisionNotificationUserEmails)
                        .build();

        when(requestService.findRequestById(requestId))
                .thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(accountPrimaryContactInfo));
        when(requestAccountContactQueryService.getRequestAccountServiceContact(request))
                .thenReturn(Optional.of(serviceContactInfo));
        when(decisionNotificationUsersService.findUserEmails(decisionNotification))
                .thenReturn(decisionNotificationUserEmails);
        when(documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(documentTemplateSourceParams))
                .thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateAndSaveFileDocument(
                MrtmDocumentTemplateType.EMP_ISSUANCE_DEEMED_WITHDRAWN, templateParams, fileName))
                .thenReturn(officialDocFileInfoDTO);

        // Invoke
        empIssuanceOfficialNoticeService.generateAndSaveDeemedWithdrawnOfficialNotice(requestId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(documentTemplateOfficialNoticeParamsProvider, times(1)).constructTemplateParams(documentTemplateSourceParams);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateAndSaveFileDocument(
                MrtmDocumentTemplateType.EMP_ISSUANCE_DEEMED_WITHDRAWN, templateParams, fileName);
        verifyNoInteractions(requestActionService);
        assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialDocFileInfoDTO);
    }

    @ParameterizedTest
    @MethodSource("provideSendOfficialNoticeTestArgs")
    void sendOfficialNotice(FileInfoDTO officialDocFileInfoDTO, FileInfoDTO empDocFileInfoDTO,
                            List<FileInfoDTO> attachments) {
        String requestId = "1";
        Long accountId = 1L;
        String registryEmail = "registry@pmrv.uk";
        String decisionNotificationUserEmail = "operator1@email";
        EmpIssuanceDeterminationType determinationType = EmpIssuanceDeterminationType.APPROVED;

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operatorUser"))
                .signatory("signatoryUser")
                .build();

        String regulatorReviewer = "regulatorReviewer";
        Request request = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                                .resourceType(ResourceType.ACCOUNT)
                                .resourceId(accountId.toString())
                        .build()))
                .payload(EmpIssuanceRequestPayload.builder()
                        .decisionNotification(decisionNotification)
                        .empDocument(empDocFileInfoDTO)
                        .regulatorReviewer(regulatorReviewer)
                        .accountOpeningEventSentToRegistry(false)
                        .officialNotice(officialDocFileInfoDTO)
                        .build())
                .build();

        List<String> ccRecipientsEmails = List.of(decisionNotificationUserEmail);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(registryConfig.getEmail()).thenReturn(registryEmail);
        OrganisationStructure organisationStructure = mock(OrganisationStructure.class);
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .operatorDetails(
                EmpOperatorDetails.builder()
                    .organisationStructure(organisationStructure)
                    .build()
            )
            .build();
        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer
            .builder()
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();
        String id = "UK-1234";
        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)).thenReturn(
            Optional.of(
                EmissionsMonitoringPlanDTO.builder()
                    .empContainer(empContainer)
                    .id(id)
                    .build()
            )
        );
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(List.of(decisionNotificationUserEmail));

        empIssuanceOfficialNoticeService.sendOfficialNotice(requestId, determinationType);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestActionService, times(1)).addRequestAction(request, organisationStructure, regulatorReviewer);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(officialNoticeSendService, times(1)).sendOfficialNotice(attachments, request, ccRecipientsEmails, List.of(registryEmail));
        verify(empQueryService).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verify(publisher, times(1)).publishEvent(empApprovedEventArgumentCaptor.capture());

        verifyNoMoreInteractions(requestService, decisionNotificationUsersService,
            officialNoticeSendService, empQueryService, publisher, requestActionService);

        assertEquals(accountId, empApprovedEventArgumentCaptor.getValue().getAccountId());
        assertEquals(id, empApprovedEventArgumentCaptor.getValue().getEmpId());
        assertEquals(emissionsMonitoringPlan, empApprovedEventArgumentCaptor.getValue().getEmissionsMonitoringPlan());
    }

    @Test
    void sendOfficialNotice_already_sent_to_registry() {
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();
        List<FileInfoDTO> attachments = List.of(officialDocFileInfoDTO);
        String requestId = "1";
        Long accountId = 1L;
        String registryEmail = "registry@pmrv.uk";
        String decisionNotificationUserEmail = "operator1@email";
        EmpIssuanceDeterminationType determinationType = EmpIssuanceDeterminationType.APPROVED;

        DecisionNotification decisionNotification = DecisionNotification.builder()
            .operators(Set.of("operatorUser"))
            .signatory("signatoryUser")
            .build();

        Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder()
                .resourceType(ResourceType.ACCOUNT)
                .resourceId(accountId.toString())
                .build()))
            .payload(EmpIssuanceRequestPayload.builder()
                .decisionNotification(decisionNotification)
                .officialNotice(officialDocFileInfoDTO)
                .accountOpeningEventSentToRegistry(true)
                .build())
            .build();

        List<String> ccRecipientsEmails = List.of(decisionNotificationUserEmail);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(registryConfig.getEmail()).thenReturn(registryEmail);
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(List.of(decisionNotificationUserEmail));

        empIssuanceOfficialNoticeService.sendOfficialNotice(requestId, determinationType);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(officialNoticeSendService, times(1)).sendOfficialNotice(attachments, request, ccRecipientsEmails, List.of(registryEmail));
        verifyNoInteractions(requestActionService);

        verifyNoMoreInteractions(requestService, decisionNotificationUsersService,
            officialNoticeSendService);
        verifyNoInteractions(empQueryService, publisher);
    }

    private static Stream<Arguments> provideSendOfficialNoticeTestArgs() {
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();
        FileInfoDTO empDocFileInfoDTO = buildOfficialFileInfo();

        return Stream.of(
                //when operator
                Arguments.of(officialDocFileInfoDTO, empDocFileInfoDTO, List.of(officialDocFileInfoDTO, empDocFileInfoDTO)),
                Arguments.of(officialDocFileInfoDTO, null, List.of(officialDocFileInfoDTO))
        );
    }

    private static FileInfoDTO buildOfficialFileInfo() {
        return FileInfoDTO.builder()
                .name("offDoc.pdf")
                .uuid(UUID.randomUUID().toString())
                .build();
    }
}
