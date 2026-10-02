package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.files.documents.service.storage.FileDocumentStorageService;
import uk.gov.netz.api.notificationapi.mail.domain.EmailData;
import uk.gov.netz.api.notificationapi.mail.domain.EmailNotificationTemplateData;
import uk.gov.netz.api.notificationapi.mail.service.NotificationEmailService;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.utils.NotificationTemplateConstants;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpOfficialNoticeSendServiceTest {

    @InjectMocks
    private EmpOfficialNoticeSendService service;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;
    @Mock
    private NotificationEmailService<EmailNotificationTemplateData> notificationEmailService;
    @Mock
    private FileDocumentStorageService fileDocumentStorageService;
    @Mock
    private CompetentAuthorityService competentAuthorityService;

    @ParameterizedTest
    @MethodSource
    void mixedOverloadsSupportEveryFileCombination(List<String> expectedCc, List<String> bcc, boolean attachments, boolean links) {
        DeliveryTestData testData = prepareDeliveryTestData(true, attachments || links);
        List<FileInfoDTO> attachedFiles = attachments ? List.of(testData.fileInfo()) : List.of();
        List<FileInfoDTO> linkedFiles = links ? List.of(testData.fileInfo()) : List.of();
        List<String> cc = List.of(testData.primaryContact().getEmail(), "cc@email");
        String template = "template";

        service.sendOfficialNotice(attachedFiles, linkedFiles, testData.request(), cc, bcc, template);

        ArgumentCaptor<EmailData<EmailNotificationTemplateData>> captured = ArgumentCaptor.forClass(EmailData.class);;
        verify(notificationEmailService).notifyRecipients(captured.capture(), eq(List.of(testData.primaryContact().getEmail())),
            eq(expectedCc), eq(bcc));
        EmailData<EmailNotificationTemplateData> email = captured.getValue();
        Map<String, byte[]> expectedFiles = Map.of(testData.fileInfo().getName(), testData.file().getFileContent());
        assertThat(email.getAttachments()).containsExactlyInAnyOrderEntriesOf(attachments ? expectedFiles : Map.of());
        assertThat(email.getLinkedFiles()).containsExactlyInAnyOrderEntriesOf(links ? expectedFiles : Map.of());
        assertTemplateData(email, testData, template);
        if (attachments || links) {
            verifySharedDependencies(testData);
        } else {
            verifyNoInteractions(fileDocumentStorageService);
        }
    }

    public static Stream<Arguments> mixedOverloadsSupportEveryFileCombination() {
        return Stream.of(
            Arguments.of(List.of("cc@email"), List.of(), true, true),
            Arguments.of(List.of("cc@email"), List.of(), true, false),
            Arguments.of(List.of("cc@email"), List.of(), false, true),
            Arguments.of(List.of("cc@email"), List.of(), false, false),

            Arguments.of(List.of("cc@email"), List.of(), true, true),
            Arguments.of(List.of("cc@email"), List.of(), true, false),
            Arguments.of(List.of("cc@email"), List.of(), false, true),
            Arguments.of(List.of("cc@email"), List.of(), false, false),

            Arguments.of(List.of("cc@email"), List.of("bcc@email"), true, true),
            Arguments.of(List.of("cc@email"), List.of("bcc@email"), true, false),
            Arguments.of(List.of("cc@email"), List.of("bcc@email"), false, true),
            Arguments.of(List.of("cc@email"), List.of("bcc@email"), false, false)
        );
    }

    private DeliveryTestData prepareDeliveryTestData(boolean sameServiceContact, boolean loadFile) {
        FileInfoDTO fileInfo = FileInfoDTO.builder()
            .name("offDoc.pdf")
            .uuid(UUID.randomUUID().toString())
            .build();
        FileDTO file = FileDTO.builder().fileContent("content".getBytes()).build();
        Request request = Request.builder()
            .id("1")
            .type(RequestType.builder().code("DUMMY_REQUEST_TYPE").build())
            .build();
        addCaResourceToRequest(CompetentAuthorityEnum.ENGLAND, request);
            UserInfoDTO primaryContact = buildUser("fn", "ln", "primary@email", "primaryUserId");
        UserInfoDTO serviceContact = sameServiceContact
            ? primaryContact
            : buildUser("ab", "cd", "service@email", "serviceUserId");
        CompetentAuthorityDTO competentAuthority = CompetentAuthorityDTO.builder()
            .id(CompetentAuthorityEnum.ENGLAND)
            .name("competentAuthority")
            .email("competent@authority.com")
            .build();

        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request))
            .thenReturn(Optional.of(primaryContact));
        when(requestAccountContactQueryService.getRequestAccountServiceContact(request))
            .thenReturn(Optional.of(serviceContact));
        if (loadFile) {
            when(fileDocumentStorageService.getFileDTO(fileInfo.getUuid())).thenReturn(file);
        }
        when(competentAuthorityService.getCompetentAuthorityDTO(CompetentAuthorityEnum.ENGLAND))
            .thenReturn(competentAuthority);

        return new DeliveryTestData(
            request, fileInfo, file, primaryContact, serviceContact, competentAuthority);
    }


    private void verifySharedDependencies(DeliveryTestData testData) {
        verify(requestAccountContactQueryService, times(2)).getRequestAccountPrimaryContact(testData.request());
        verify(requestAccountContactQueryService, times(2)).getRequestAccountServiceContact(testData.request());
        verify(fileDocumentStorageService, times(1)).getFileDTO(testData.fileInfo().getUuid());
        verify(competentAuthorityService, times(1))
            .getCompetentAuthorityDTO(CompetentAuthorityEnum.ENGLAND);
    }

    private void assertTemplateData(EmailData<EmailNotificationTemplateData> emailData,
                                    DeliveryTestData testData, String template) {
        assertThat(emailData.getNotificationTemplateData()).isEqualTo(
            EmailNotificationTemplateData.builder()
                .templateName(template)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .templateParams(Map.of(
                    NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT,
                    testData.primaryContact().getFullName(),
                    NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT_FIRST_NAME,
                    testData.primaryContact().getFirstName(),
                    NotificationTemplateConstants.ACCOUNT_PRIMARY_CONTACT_LAST_NAME,
                    testData.primaryContact().getLastName(),
                    NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT,
                    testData.serviceContact().getFullName(),
                    NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT_FIRST_NAME,
                    testData.serviceContact().getFirstName(),
                    NotificationTemplateConstants.ACCOUNT_SERVICE_CONTACT_LAST_NAME,
                    testData.serviceContact().getLastName(),
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_EMAIL,
                    testData.competentAuthority().getEmail(),
                    NotificationTemplateConstants.COMPETENT_AUTHORITY_NAME,
                    testData.competentAuthority().getName()))
                .build());
    }

    private UserInfoDTO buildUser(String firstName, String lastName, String email, String userId) {
        return UserInfoDTO.builder()
            .firstName(firstName)
            .lastName(lastName)
            .email(email)
            .userId(userId)
            .build();
    }

    private void addCaResourceToRequest(CompetentAuthorityEnum competentAuthority, Request request) {
        RequestResource caResource = RequestResource.builder()
            .resourceType(ResourceType.CA)
            .resourceId(competentAuthority.name())
            .request(request)
            .build();
        request.getRequestResources().add(caResource);
    }

    private record DeliveryTestData(
        Request request,
        FileInfoDTO fileInfo,
        FileDTO file,
        UserInfoDTO primaryContact,
        UserInfoDTO serviceContact,
        CompetentAuthorityDTO competentAuthority) {
    }
}