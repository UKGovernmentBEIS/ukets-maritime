package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.AccountUpdatedRegistryEvent;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.config.RegistryConfig;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.event.EmpApprovedEvent;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.registry.accountcreated.request.MaritimeAccountCreatedEventListenerResolver;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.integration.registry.accountupdated.request.MaritimeAccountUpdatedEventListenerResolver;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeEvent;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeNotificationType;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;
import uk.gov.mrtm.api.integration.registry.regulatornotice.request.MaritimeRegulatorNoticeEventListenerResolver;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.AccountUpdatedEventAddRequestActionService;
import uk.gov.mrtm.api.workflow.request.flow.registry.service.RegulatorNoticeEventAddRequestActionService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.files.documents.domain.FileDocument;
import uk.gov.netz.api.files.documents.repository.FileDocumentRepository;
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
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.lenient;
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
    private MaritimeAccountCreatedEventListenerResolver accountCreatedEventListenerResolver;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @Mock
    private EmpIssuanceSendRegistryAccountOpeningAddRequestActionService requestActionService;

    @Mock
    private MrtmAccountQueryService accountQueryService;

    @Captor
    private ArgumentCaptor<EmpApprovedEvent> empApprovedEventArgumentCaptor;

    @Mock
    private AccountUpdatedEventAddRequestActionService accountUpdatedEventRequestActionService;

    @Mock
    private MaritimeAccountUpdatedEventListenerResolver accountUpdatedRegistryListener;

    @Mock
    private MaritimeRegulatorNoticeEventListenerResolver registryNoticeEventListenerResolver;

    @Mock
    private FileDocumentRepository fileDocumentRepository;

    @Mock
    private RegulatorNoticeEventAddRequestActionService regulatorNoticeEventAddRequestActionService;

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
        verifyNoInteractions(requestActionService, fileDocumentRepository, registryNoticeEventListenerResolver,
            regulatorNoticeEventAddRequestActionService);
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
        verifyNoInteractions(requestActionService, fileDocumentRepository, registryNoticeEventListenerResolver,
            regulatorNoticeEventAddRequestActionService);
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
        MrtmAccount mrtmAccount = MrtmAccount.builder().registryId(null).build();

        when(accountQueryService.getAccountById(accountId)).thenReturn(mrtmAccount);
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
        verify(accountCreatedEventListenerResolver, times(1)).onAccountCreatedEvent(empApprovedEventArgumentCaptor.capture());
        verify(accountQueryService).getAccountById(accountId);

        verifyNoMoreInteractions(requestService, decisionNotificationUsersService,
            officialNoticeSendService, empQueryService, accountCreatedEventListenerResolver, requestActionService, accountQueryService);
        verifyNoInteractions(fileDocumentRepository, registryNoticeEventListenerResolver, regulatorNoticeEventAddRequestActionService);
        assertEquals(accountId, empApprovedEventArgumentCaptor.getValue().getAccountId());
        assertEquals(emissionsMonitoringPlan, empApprovedEventArgumentCaptor.getValue().getEmissionsMonitoringPlan());
    }

    @ParameterizedTest
    @MethodSource("sendOfficialNoticeAlreadySentToRegistryScenarios")
    void sendOfficialNotice_already_sent_to_registry(boolean accountOpeningEventSentToRegistry,
                                                     int accountUpdateSentToRegistryInvocations) {
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
                .accountOpeningEventSentToRegistry(accountOpeningEventSentToRegistry)
                .build())
            .build();

        List<String> ccRecipientsEmails = List.of(decisionNotificationUserEmail);
        OrganisationStructure organisationStructure = mock(OrganisationStructure.class);
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .operatorDetails(
                EmpOperatorDetails.builder()
                    .organisationStructure(organisationStructure)
                    .build()
            )
            .build();
        MrtmAccount mrtmAccount = MrtmAccount.builder().registryId(accountOpeningEventSentToRegistry? null : 1234567).build();
        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer
            .builder()
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();
        String id = "UK-1234";
        AccountUpdatedRegistryEvent accountUpdatedRegistryEvent = AccountUpdatedRegistryEvent.builder()
            .accountId(request.getAccountId())
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .build();
        AccountUpdatedSubmittedEventDetails accountUpdatedSubmittedEventDetails = mock(AccountUpdatedSubmittedEventDetails.class);

        when(accountQueryService.getAccountById(accountId)).thenReturn(mrtmAccount);
        EmissionsMonitoringPlanDTO emissionsMonitoringPlanDTO = EmissionsMonitoringPlanDTO.builder()
            .empContainer(empContainer)
            .id(id)
            .build();
        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)).thenReturn(Optional.of(emissionsMonitoringPlanDTO));
        when(requestService.findRequestById(requestId)).thenReturn(request);
        lenient().when(accountUpdatedRegistryListener.onAccountUpdatedEvent(accountUpdatedRegistryEvent)).thenReturn(accountUpdatedSubmittedEventDetails);
        when(registryConfig.getEmail()).thenReturn(registryEmail);
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(List.of(decisionNotificationUserEmail));

        empIssuanceOfficialNoticeService.sendOfficialNotice(requestId, determinationType);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(officialNoticeSendService, times(1)).sendOfficialNotice(attachments, request, ccRecipientsEmails, List.of(registryEmail));
        verify(accountQueryService).getAccountById(accountId);
        verify(empQueryService).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verify(accountUpdatedRegistryListener, times(accountUpdateSentToRegistryInvocations)).onAccountUpdatedEvent(accountUpdatedRegistryEvent);
        verify(accountUpdatedEventRequestActionService, times(accountUpdateSentToRegistryInvocations)).addRequestAction(
            request, accountUpdatedSubmittedEventDetails, organisationStructure, null);


        verifyNoMoreInteractions(accountUpdatedRegistryListener, accountUpdatedEventRequestActionService,
            empQueryService, requestService, decisionNotificationUsersService, officialNoticeSendService,
            accountQueryService);
        verifyNoInteractions(accountCreatedEventListenerResolver, requestActionService, fileDocumentRepository, registryNoticeEventListenerResolver,
            regulatorNoticeEventAddRequestActionService);
    }

    public static Stream<Arguments> sendOfficialNoticeAlreadySentToRegistryScenarios() {
        return Stream.of(
            Arguments.of(true, 0),
            Arguments.of(false, 1)
        );
    }

    @ParameterizedTest
    @ValueSource(booleans =  {true, false})
    void sendOfficialNotice_withdrawn(boolean notifiedRegistry) {
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();
        List<FileInfoDTO> attachments = List.of(officialDocFileInfoDTO);
        String requestId = "1";
        Long accountId = 1L;
        String registryEmail = "registry@pmrv.uk";
        String decisionNotificationUserEmail = "operator1@email";
        EmpIssuanceDeterminationType determinationType = EmpIssuanceDeterminationType.DEEMED_WITHDRAWN;

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
                .regulatorReviewer(regulatorReviewer)
                .accountOpeningEventSentToRegistry(false)
                .officialNotice(officialDocFileInfoDTO)
                .build())
            .build();
        byte[] file = HexFormat.of().parseHex("e04fd020ea3a6910a2d808002b30309d");
        MrtmRegulatorNoticeEvent mrtmRegulatorNoticeEvent = MrtmRegulatorNoticeEvent.builder()
            .accountId(accountId)
            .fileName(officialDocFileInfoDTO.getName())
            .file(file)
            .notificationType(MrtmRegulatorNoticeNotificationType.EMP_WITHDRAWN)
            .build();
        RegulatorNoticeSubmittedEventDetails submittedEventDetails = RegulatorNoticeSubmittedEventDetails.builder()
            .notifiedRegistry(notifiedRegistry)
            .data(RegulatorNoticeEvent.builder().registryId("321").build())
            .build();

        List<String> ccRecipientsEmails = List.of(decisionNotificationUserEmail);

        when(registryNoticeEventListenerResolver.onRegulatorNoticeEvent(mrtmRegulatorNoticeEvent))
            .thenReturn(submittedEventDetails);
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(registryConfig.getEmail()).thenReturn(registryEmail);
        when(fileDocumentRepository.findByUuid(officialDocFileInfoDTO.getUuid())).thenReturn(Optional.ofNullable(FileDocument.builder().fileContent(file).build()));
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(List.of(decisionNotificationUserEmail));

        empIssuanceOfficialNoticeService.sendOfficialNotice(requestId, determinationType);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(registryNoticeEventListenerResolver).onRegulatorNoticeEvent(mrtmRegulatorNoticeEvent);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(fileDocumentRepository, times(1)).findByUuid(officialDocFileInfoDTO.getUuid());
        verify(officialNoticeSendService, times(1)).sendOfficialNotice(attachments, request, ccRecipientsEmails, List.of(registryEmail));
        verify(regulatorNoticeEventAddRequestActionService)
            .addRequestAction(request, submittedEventDetails, officialDocFileInfoDTO, MrtmRegulatorNoticeNotificationType.EMP_WITHDRAWN);

        verifyNoMoreInteractions(requestService, decisionNotificationUsersService, regulatorNoticeEventAddRequestActionService,
            officialNoticeSendService, requestActionService, fileDocumentRepository, registryNoticeEventListenerResolver);
        verifyNoInteractions(empQueryService, accountCreatedEventListenerResolver, accountQueryService);
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
