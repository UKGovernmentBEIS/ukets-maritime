package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentTemplateEmpParamsSourceData;
import uk.gov.mrtm.api.workflow.request.flow.common.service.DocumentTemplateEmpParamsProvider;
import uk.gov.mrtm.api.workflow.request.flow.common.service.EmpCreateDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpCreateDocumentServiceTest {

    @InjectMocks
    private EmpCreateDocumentService service;

    @Mock
    private FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    @Mock
    private DocumentTemplateEmpParamsProvider empParamsProvider;

    @Test
    void generateDocumentAsync() throws InterruptedException, ExecutionException {
        final EmpVariationRequestInfo empVariationRequestInfo = mock(EmpVariationRequestInfo.class);
        final EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
                .build();
        final Request request = Request.builder().id("1")
            .requestResources(List.of(RequestResource.builder().resourceId("100").resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload)
            .build();
        final EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder().build();
        final EmissionsMonitoringPlanDTO empDto =
                EmissionsMonitoringPlanDTO.builder().id("empId").consolidationNumber(1).empContainer(empContainer).build();

        LocalDateTime empSubmissionDate = LocalDateTime.now();
        LocalDateTime empEndDate = LocalDateTime.now().plusDays(1);

        final String signatory = "signatory";
        final DocumentTemplateEmpParamsSourceData sourceData = DocumentTemplateEmpParamsSourceData
                .builder()
                .request(request)
                .signatory(signatory)
                .empContainer(empContainer)
                .variationRequestInfoList(List.of(empVariationRequestInfo))
                .consolidationNumber(1)
                .empEndDate(empEndDate)
                .empSubmissionDate(empSubmissionDate)
                .build();
        final TemplateParams empParams = TemplateParams.builder().build();

        String fileUuid = UUID.randomUUID().toString();
        FileInfoDTO generatedDoc = FileInfoDTO.builder()
                .name("genFile")
                .uuid(fileUuid)
                .build();

        when(empParamsProvider.constructTemplateParams(sourceData)).thenReturn(empParams);
        when(fileDocumentGenerateServiceDelegator.generateAndSaveFileDocumentAsync(MrtmDocumentTemplateType.EMP, empParams, "empId v1.pdf"))
                .thenReturn(CompletableFuture.completedFuture(generatedDoc));

        CompletableFuture<FileInfoDTO> result = service.generateDocumentAsync(request, signatory, empDto,
            MrtmDocumentTemplateType.EMP, List.of(empVariationRequestInfo), empSubmissionDate, empEndDate);

        assertThat(result.get()).isEqualTo(generatedDoc);

        verify(empParamsProvider, times(1)).constructTemplateParams(sourceData);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateAndSaveFileDocumentAsync(
                MrtmDocumentTemplateType.EMP,
                empParams,
                "empId v1.pdf"
        );
    }

    @Test
    void generateDocumentWithParams() {

        final EmissionsMonitoringPlanDTO empEntityDto = EmissionsMonitoringPlanDTO.builder()
            .id("empId").consolidationNumber(1).build();
        final TemplateParams permitParams = TemplateParams.builder().build();

        service.generateDocumentWithParams(empEntityDto, MrtmDocumentTemplateType.EMP, permitParams);

        verify(fileDocumentGenerateServiceDelegator, times(1)).generateFileDocument(
            MrtmDocumentTemplateType.EMP,
            permitParams,
            "empId v1.pdf"
        );
    }
}
