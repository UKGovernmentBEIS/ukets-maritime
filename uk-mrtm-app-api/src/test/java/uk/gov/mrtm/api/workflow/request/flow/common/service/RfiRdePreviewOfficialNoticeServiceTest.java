package uk.gov.mrtm.api.workflow.request.flow.common.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.account.domain.dto.MrtmDocumentTemplateAccountData;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.MrtmDocumentTemplateAccountDataCollectFromEmpIssuanceService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.MrtmDocumentTemplateAccountDataCollectFromEmpVariationService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateType;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateGenerationContextActionType;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateOfficialNoticeParamsProvider;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateParamsSourceData;

@ExtendWith(MockitoExtension.class)
class RfiRdePreviewOfficialNoticeServiceTest {

    @InjectMocks
    private RfiRdePreviewOfficialNoticeService service;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Mock
    private DecisionNotificationUsersService decisionNotificationUsersService;

    @Mock
    private MrtmDocumentTemplateAccountDataCollectFromAccountService templateAccountDataCollectFromAccountService;

    @Mock
    private MrtmDocumentTemplateAccountDataCollectFromEmpIssuanceService templateAccountDataCollectFromEmpIssuanceService;

    @Mock
    private MrtmDocumentTemplateAccountDataCollectFromEmpVariationService templateAccountDataCollectFromEmpVariationService;

    @Mock
    private DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;

    @Mock
    private FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    @Test
    void generateRfiPreview_fromAccount() {
        final Long accountId = 1L;
        final DecisionNotification decisionNotification = DecisionNotification.builder().signatory("signatory").build();
        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .requestResources(List.of(RequestResource.builder()
                        .resourceId(String.valueOf(accountId))
                        .resourceType(ResourceType.ACCOUNT)
                        .build()))
                .build();
        final RequestTask requestTask = RequestTask.builder().request(request).build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().email("primary@email").build();
        final List<String> ccEmails = List.of("cc@email");
        final MrtmDocumentTemplateAccountData accountData = MrtmDocumentTemplateAccountData.builder().imoNumber("123").build();
        final TemplateParams templateParams = TemplateParams.builder().build();
        final FileDTO fileDTO = FileDTO.builder().fileName("Request for Further Information.pdf").build();
        final DocumentTemplateParamsSourceData sourceData = DocumentTemplateParamsSourceData.builder()
                .contextActionType(DocumentTemplateGenerationContextActionType.RFI_SUBMIT)
                .request(request)
                .signatory(decisionNotification.getSignatory())
                .accountPrimaryContact(accountPrimaryContact)
                .toRecipientEmail(accountPrimaryContact.getEmail())
                .ccRecipientsEmails(ccEmails)
                .accountData(accountData)
                .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(accountPrimaryContact));
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(ccEmails);
        when(templateAccountDataCollectFromAccountService.collect(accountId)).thenReturn(accountData);
        when(documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(sourceData)).thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateFileDocument(
                DocumentTemplateType.IN_RFI, templateParams, "Request for Further Information.pdf"))
                .thenReturn(fileDTO);

        assertThat(service.generateRfiPreview(requestTask, decisionNotification)).isEqualTo(fileDTO);
        verify(templateAccountDataCollectFromAccountService, times(1)).collect(accountId);
        verifyNoInteractions(templateAccountDataCollectFromEmpIssuanceService, templateAccountDataCollectFromEmpVariationService);
    }

    @Test
    void generateRdePreview_fromEmpIssuance() {
        final DecisionNotification decisionNotification = DecisionNotification.builder().signatory("signatory").build();
        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.EMP_ISSUANCE).build())
                .build();
        final EmpIssuanceApplicationReviewRequestTaskPayload taskPayload =
                EmpIssuanceApplicationReviewRequestTaskPayload.builder().build();
        final RequestTask requestTask = RequestTask.builder().request(request).payload(taskPayload).build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().email("primary@email").build();
        final List<String> ccEmails = List.of("cc@email");
        final MrtmDocumentTemplateAccountData accountData = MrtmDocumentTemplateAccountData.builder().imoNumber("123").build();
        final TemplateParams templateParams = TemplateParams.builder().build();
        final FileDTO fileDTO = FileDTO.builder().fileName("Request for Determination Extension.pdf").build();
        final DocumentTemplateParamsSourceData sourceData = DocumentTemplateParamsSourceData.builder()
                .contextActionType(DocumentTemplateGenerationContextActionType.RDE_SUBMIT)
                .request(request)
                .signatory(decisionNotification.getSignatory())
                .accountPrimaryContact(accountPrimaryContact)
                .toRecipientEmail(accountPrimaryContact.getEmail())
                .ccRecipientsEmails(ccEmails)
                .accountData(accountData)
                .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(accountPrimaryContact));
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(ccEmails);
        when(templateAccountDataCollectFromEmpIssuanceService.collect(requestTask)).thenReturn(accountData);
        when(documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(sourceData)).thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateFileDocument(
                DocumentTemplateType.IN_RDE, templateParams, "Request for Determination Extension.pdf"))
                .thenReturn(fileDTO);

        assertThat(service.generateRdePreview(requestTask, decisionNotification)).isEqualTo(fileDTO);
        verify(templateAccountDataCollectFromEmpIssuanceService, times(1)).collect(requestTask);
        verifyNoInteractions(templateAccountDataCollectFromAccountService, templateAccountDataCollectFromEmpVariationService);
    }

    @Test
    void generateRdePreview_fromEmpVariation() {
        final DecisionNotification decisionNotification = DecisionNotification.builder().signatory("signatory").build();
        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.EMP_VARIATION).build())
                .build();
        final EmpVariationApplicationReviewRequestTaskPayload taskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder().build();
        final RequestTask requestTask = RequestTask.builder().request(request).payload(taskPayload).build();
        final UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().email("primary@email").build();
        final List<String> ccEmails = List.of("cc@email");
        final MrtmDocumentTemplateAccountData accountData = MrtmDocumentTemplateAccountData.builder().imoNumber("123").build();
        final TemplateParams templateParams = TemplateParams.builder().build();
        final FileDTO fileDTO = FileDTO.builder().fileName("Request for Determination Extension.pdf").build();
        final DocumentTemplateParamsSourceData sourceData = DocumentTemplateParamsSourceData.builder()
                .contextActionType(DocumentTemplateGenerationContextActionType.RDE_SUBMIT)
                .request(request)
                .signatory(decisionNotification.getSignatory())
                .accountPrimaryContact(accountPrimaryContact)
                .toRecipientEmail(accountPrimaryContact.getEmail())
                .ccRecipientsEmails(ccEmails)
                .accountData(accountData)
                .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
                .thenReturn(Optional.of(accountPrimaryContact));
        when(decisionNotificationUsersService.findUserEmails(decisionNotification)).thenReturn(ccEmails);
        when(templateAccountDataCollectFromEmpVariationService.collect(requestTask)).thenReturn(accountData);
        when(documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(sourceData)).thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateFileDocument(
                DocumentTemplateType.IN_RDE, templateParams, "Request for Determination Extension.pdf"))
                .thenReturn(fileDTO);

        assertThat(service.generateRdePreview(requestTask, decisionNotification)).isEqualTo(fileDTO);
        verify(templateAccountDataCollectFromEmpVariationService, times(1)).collect(requestTask);
        verifyNoInteractions(templateAccountDataCollectFromAccountService, templateAccountDataCollectFromEmpIssuanceService);
    }
}
