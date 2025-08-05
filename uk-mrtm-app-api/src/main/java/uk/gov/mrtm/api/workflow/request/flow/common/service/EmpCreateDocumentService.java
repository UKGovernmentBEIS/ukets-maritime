package uk.gov.mrtm.api.workflow.request.flow.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentTemplateEmpParamsSourceData;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
public class EmpCreateDocumentService {

    private final FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;
    private final DocumentTemplateEmpParamsProvider empParamsProvider;

    public FileDTO generateDocumentWithParams(final EmissionsMonitoringPlanDTO empDto,
                                              final String type,
                                              final TemplateParams empParams) {

        final String fileName = constructFileName(empDto);
        return fileDocumentGenerateServiceDelegator.generateFileDocument(type, empParams, fileName);
    }

    public CompletableFuture<FileInfoDTO> generateDocumentAsync(final Request request, final String signatory,
                                                                final EmissionsMonitoringPlanDTO empDto,
                                                                final String documentTemplateType,
                                                                final List<EmpVariationRequestInfo> empVariationRequestInfo,
                                                                final LocalDateTime empSubmissionDate,
                                                                final LocalDateTime empEndDate) {
        final EmissionsMonitoringPlanContainer empContainer = empDto.getEmpContainer();
        final TemplateParams empParams = constructTemplateParams(request, signatory, empDto,
            empContainer, empVariationRequestInfo, empSubmissionDate, empEndDate);

        final String fileName = constructFileName(empDto);
        return fileDocumentGenerateServiceDelegator.generateAndSaveFileDocumentAsync(
                documentTemplateType,
                empParams,
                fileName
        );
    }

    private TemplateParams constructTemplateParams(final Request request, final String signatory,
                                                   final EmissionsMonitoringPlanDTO empDto,
                                                   final EmissionsMonitoringPlanContainer empContainer,
                                                   final List<EmpVariationRequestInfo> empVariationRequestInfo,
                                                   final LocalDateTime empSubmissionDate,
                                                   final LocalDateTime empEndDate) {
        return empParamsProvider.constructTemplateParams(
                DocumentTemplateEmpParamsSourceData.builder()
                    .request(request)
                    .signatory(signatory)
                    .empContainer(empContainer)
                    .variationRequestInfoList(empVariationRequestInfo)
                    .consolidationNumber(empDto.getConsolidationNumber())
                    .empSubmissionDate(empSubmissionDate)
                    .empEndDate(empEndDate)
                    .build());
    }

    private String constructFileName(final EmissionsMonitoringPlanDTO empDto) {
        return empDto.getId() + " v" + empDto.getConsolidationNumber() + ".pdf";
    }
}
