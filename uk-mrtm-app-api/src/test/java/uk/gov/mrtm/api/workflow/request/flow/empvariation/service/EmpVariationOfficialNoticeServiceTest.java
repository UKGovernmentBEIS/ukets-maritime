package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationOfficialNoticeServiceTest {

    @InjectMocks
    private EmpVariationOfficialNoticeService empVariationOfficialNoticeService;

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

    @Test
    void generateApprovedOfficialNotice() throws InterruptedException, ExecutionException {
        String requestId = "1";
        Long accountId = 1L;
        String fileName = "emp_variation_approved.pdf";

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator"))
                .signatory("signatory")
                .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .decisionNotification(decisionNotification)
                .build();
        Request request = Request.builder().payload(requestPayload).requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();

        TemplateParams templateParams = TemplateParams.builder().build();
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();

        UserInfoDTO accountPrimaryContactInfo = buildUserInfo("primaryContact@pmrv.uk");
        UserInfoDTO serviceContactInfo = buildUserInfo("serviceContact@pmrv.uk");
        List<String> decisionNotificationUserEmails = List.of("operator@pmrv.uk");
        DocumentTemplateParamsSourceData documentTemplateSourceParams =
                DocumentTemplateParamsSourceData.builder()
                        .contextActionType(MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_ACCEPTED)
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
                MrtmDocumentTemplateType.EMP_VARIATION_ACCEPTED, templateParams, fileName))
                .thenReturn(CompletableFuture.completedFuture(officialDocFileInfoDTO));

        // Invoke
        CompletableFuture<FileInfoDTO> result = empVariationOfficialNoticeService.generateApprovedOfficialNotice(requestId);

        // Verify
        assertThat(result.get()).isEqualTo(officialDocFileInfoDTO);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountServiceContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(documentTemplateOfficialNoticeParamsProvider, times(1)).constructTemplateParams(documentTemplateSourceParams);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateAndSaveFileDocumentAsync(
                MrtmDocumentTemplateType.EMP_VARIATION_ACCEPTED, templateParams, fileName);
    }

    @Test
    void generateApprovedOfficialNoticeRegulatorLed() throws InterruptedException, ExecutionException {
        String requestId = "1";
        Long accountId = 1L;
        String fileName = "emp_variation_approved.pdf";

        DecisionNotification decisionNotification = DecisionNotification.builder()
            .operators(Set.of("operator"))
            .signatory("signatory")
            .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
            .decisionNotification(decisionNotification)
            .build();
        Request request = Request.builder().payload(requestPayload).requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();

        TemplateParams templateParams = TemplateParams.builder().build();
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();

        UserInfoDTO accountPrimaryContactInfo = buildUserInfo("primaryContact@pmrv.uk");
        UserInfoDTO serviceContactInfo = buildUserInfo("serviceContact@pmrv.uk");
        List<String> decisionNotificationUserEmails = List.of("operator@pmrv.uk");
        DocumentTemplateParamsSourceData documentTemplateSourceParams =
            DocumentTemplateParamsSourceData.builder()
                .contextActionType(MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_REGULATOR_LED_APPROVED)
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
            MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED, templateParams, fileName))
            .thenReturn(CompletableFuture.completedFuture(officialDocFileInfoDTO));

        // Invoke
        CompletableFuture<FileInfoDTO> result = empVariationOfficialNoticeService.generateApprovedOfficialNoticeRegulatorLed(requestId);

        // Verify
        assertThat(result.get()).isEqualTo(officialDocFileInfoDTO);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountServiceContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(documentTemplateOfficialNoticeParamsProvider, times(1)).constructTemplateParams(documentTemplateSourceParams);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateAndSaveFileDocumentAsync(
            MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED, templateParams, fileName);
    }

    @ParameterizedTest
    @MethodSource("provideSendOfficialNoticeTestArgs")
    void sendOfficialNotice(FileInfoDTO officialDocFileInfoDTO, FileInfoDTO empDocFileInfoDTO,
                            List<FileInfoDTO> attachments) {
        String requestId = "1";
        String decisionNotificationUserEmail = "operator1@email";

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operatorUser"))
                .signatory("signatoryUser")
                .build();


        Request request = Request.builder()
                .id(requestId)
                .payload(EmpVariationRequestPayload.builder()
                        .decisionNotification(decisionNotification)
                        .officialNotice(officialDocFileInfoDTO)
                        .empDocument(empDocFileInfoDTO)
                        .build())
                .build();

        List<String> ccRecipientsEmails = List.of(decisionNotificationUserEmail);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(List.of(decisionNotificationUserEmail));

        empVariationOfficialNoticeService.sendOfficialNotice(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(officialNoticeSendService, times(1)).sendOfficialNotice(attachments, request, ccRecipientsEmails);
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
    @Test
    void generateAndSaveDeemedWithdrawnOfficialNotice() {
        String requestId = "1";
        String fileName = "emp_variation_withdrawn.pdf";

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator"))
                .signatory("signatory")
                .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .decisionNotification(decisionNotification)
                .build();
        Request request = Request.builder().payload(requestPayload).build();

        TemplateParams templateParams = TemplateParams.builder().build();
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();

        UserInfoDTO accountPrimaryContactInfo = buildUserInfo("primaryContact@pmrv.uk");
        UserInfoDTO serviceContactInfo = buildUserInfo("serviceContact@pmrv.uk");
        List<String> decisionNotificationUserEmails = List.of("operator@pmrv.uk");
        DocumentTemplateParamsSourceData documentTemplateSourceParams =
                DocumentTemplateParamsSourceData.builder()
                        .contextActionType(MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_DEEMED_WITHDRAWN)
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
                MrtmDocumentTemplateType.EMP_VARIATION_DEEMED_WITHDRAWN, templateParams, fileName))
                .thenReturn(officialDocFileInfoDTO);

        // Invoke
        empVariationOfficialNoticeService.generateAndSaveDeemedWithdrawnOfficialNotice(requestId);

        // Verify
        assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialDocFileInfoDTO);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(documentTemplateOfficialNoticeParamsProvider, times(1)).constructTemplateParams(documentTemplateSourceParams);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateAndSaveFileDocument(
                MrtmDocumentTemplateType.EMP_VARIATION_DEEMED_WITHDRAWN, templateParams, fileName);
    }

    @Test
    void generateAndSaveRejectedOfficialNotice() {
        String requestId = "1";
        String fileName = "emp_variation_rejected.pdf";

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator"))
                .signatory("signatory")
                .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .decisionNotification(decisionNotification)
                .build();
        Request request = Request.builder().payload(requestPayload).build();

        TemplateParams templateParams = TemplateParams.builder().build();
        FileInfoDTO officialDocFileInfoDTO = buildOfficialFileInfo();

        UserInfoDTO accountPrimaryContactInfo = buildUserInfo("primaryContact@pmrv.uk");
        UserInfoDTO serviceContactInfo = buildUserInfo("serviceContact@pmrv.uk");
        List<String> decisionNotificationUserEmails = List.of("operator@pmrv.uk");
        DocumentTemplateParamsSourceData documentTemplateSourceParams =
                DocumentTemplateParamsSourceData.builder()
                        .contextActionType(MrtmDocumentTemplateGenerationContextActionType.EMP_VARIATION_REJECTED)
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
                MrtmDocumentTemplateType.EMP_VARIATION_REJECTED, templateParams, fileName))
                .thenReturn(officialDocFileInfoDTO);

        // Invoke
        empVariationOfficialNoticeService.generateAndSaveRejectedOfficialNotice(requestId);

        // Verify
        assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialDocFileInfoDTO);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestAccountContactQueryService, times(1)).getRequestAccountPrimaryContact(request);
        verify(decisionNotificationUsersService, times(1)).findUserEmails(decisionNotification);
        verify(documentTemplateOfficialNoticeParamsProvider, times(1)).constructTemplateParams(documentTemplateSourceParams);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateAndSaveFileDocument(
                MrtmDocumentTemplateType.EMP_VARIATION_REJECTED, templateParams, fileName);
    }

    private static FileInfoDTO buildOfficialFileInfo() {
        return FileInfoDTO.builder()
                .name("doc.pdf")
                .uuid(UUID.randomUUID().toString())
                .build();
    }

    private UserInfoDTO buildUserInfo(String email) {
        return UserInfoDTO.builder().email(email).build();
    }
}
