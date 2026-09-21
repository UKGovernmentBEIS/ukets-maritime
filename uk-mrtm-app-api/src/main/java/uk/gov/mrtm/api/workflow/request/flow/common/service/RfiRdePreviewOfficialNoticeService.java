package uk.gov.mrtm.api.workflow.request.flow.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.dto.MrtmDocumentTemplateAccountData;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service.MrtmDocumentTemplateAccountDataCollectFromEmpIssuanceService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.MrtmDocumentTemplateAccountDataCollectFromEmpVariationService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateType;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.service.DecisionNotificationUsersService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateGenerationContextActionType;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateOfficialNoticeParamsProvider;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateParamsSourceData;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RfiRdePreviewOfficialNoticeService {

    private final RequestAccountContactQueryService requestAccountContactQueryService;
    private final DecisionNotificationUsersService decisionNotificationUsersService;
    private final MrtmDocumentTemplateAccountDataCollectFromAccountService templateAccountDataCollectFromAccountService;
    private final MrtmDocumentTemplateAccountDataCollectFromEmpIssuanceService templateAccountDataCollectFromEmpIssuanceService;
    private final MrtmDocumentTemplateAccountDataCollectFromEmpVariationService templateAccountDataCollectFromEmpVariationService;
    private final DocumentTemplateOfficialNoticeParamsProvider documentTemplateOfficialNoticeParamsProvider;
    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    @Transactional(readOnly = true)
    public FileDTO generateRfiPreview(final RequestTask requestTask, final DecisionNotification decisionNotification) {
        final TemplateParams templateParams = constructTemplateParams(
                requestTask,
                decisionNotification,
                DocumentTemplateGenerationContextActionType.RFI_SUBMIT);

        return fileDocumentGenerateServiceDelegator.generateFileDocument(
                DocumentTemplateType.IN_RFI, templateParams, "Request for Further Information.pdf");
    }

    @Transactional(readOnly = true)
    public FileDTO generateRdePreview(final RequestTask requestTask, final DecisionNotification decisionNotification) {
        final TemplateParams templateParams = constructTemplateParams(
                requestTask,
                decisionNotification,
                DocumentTemplateGenerationContextActionType.RDE_SUBMIT);

        return fileDocumentGenerateServiceDelegator.generateFileDocument(
                DocumentTemplateType.IN_RDE, templateParams, "Request for Determination Extension.pdf");
    }

    private TemplateParams constructTemplateParams(final RequestTask requestTask,
                                                   final DecisionNotification decisionNotification,
                                                   final String contextActionType) {
        final Request request = requestTask.getRequest();
        final UserInfoDTO accountPrimaryContact =
                requestAccountContactQueryService.getRequestAccountPrimaryContact(request)
                        .orElseThrow(() -> new BusinessException(ErrorCode.ACCOUNT_CONTACT_TYPE_PRIMARY_CONTACT_NOT_FOUND));
        final List<String> ccRecipientsEmails =
                decisionNotificationUsersService.findUserEmails(decisionNotification);

        return documentTemplateOfficialNoticeParamsProvider.constructTemplateParams(
                DocumentTemplateParamsSourceData.builder()
                        .contextActionType(contextActionType)
                        .request(request)
                        .signatory(decisionNotification.getSignatory())
                        .accountPrimaryContact(accountPrimaryContact)
                        .toRecipientEmail(accountPrimaryContact.getEmail())
                        .ccRecipientsEmails(ccRecipientsEmails)
                        .accountData(collectAccountData(requestTask))
                        .build());
    }

    private MrtmDocumentTemplateAccountData collectAccountData(final RequestTask requestTask) {
        final String requestType = requestTask.getRequest().getType().getCode();

        if (MrtmRequestType.EMP_ISSUANCE.equals(requestType)
                && requestTask.getPayload() instanceof EmpIssuanceApplicationReviewRequestTaskPayload) {
            return templateAccountDataCollectFromEmpIssuanceService.collect(requestTask);
        }

        if (MrtmRequestType.EMP_VARIATION.equals(requestType)
                && requestTask.getPayload() instanceof EmpVariationApplicationSubmitRequestTaskPayload) {
            return templateAccountDataCollectFromEmpVariationService.collect(requestTask);
        }

        return templateAccountDataCollectFromAccountService.collect(requestTask.getRequest().getAccountId());
    }
}
