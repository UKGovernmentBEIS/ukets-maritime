package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanIdentifierGenerator;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentTemplateEmpParamsSourceData;
import uk.gov.mrtm.api.workflow.request.flow.common.service.DocumentTemplateEmpParamsProvider;
import uk.gov.mrtm.api.workflow.request.flow.common.service.EmpCreateDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.LinkedHashSet;

@Service
@AllArgsConstructor
public class EmpPreviewCreateEmpDocumentService {


    private final EmissionsMonitoringPlanQueryService empQueryService;
    private final EmpCreateDocumentService empCreateDocumentService;
    private final EmissionsMonitoringPlanIdentifierGenerator generator;
    private final DocumentTemplateEmpParamsProvider empParamsProvider;

    public FileDTO getFile(final DecisionNotification decisionNotification,
                           final Request request,
                           final Long accountId,
                           final EmissionsMonitoringPlan emp,
                           final Map<UUID, String> attachments,
                           final List<EmpVariationRequestInfo> variationRequestInfoList,
                           final int consolidationNumber,
                           final LocalDateTime empSubmissionDate,
                           final LocalDateTime endDate) {

        final String signatory = decisionNotification.getSignatory();

        final EmissionsMonitoringPlanDTO empDto = this.createEmpDto(accountId, emp, attachments, consolidationNumber);

        //sorting
        Set<EmpShipEmissions> empShipEmissionsSet = empDto.getEmpContainer().getEmissionsMonitoringPlan().getEmissions().getShips();
        Set<EmpShipEmissions> sorted = (Set<EmpShipEmissions>) empShipEmissionsSet.stream().sorted()
                .collect(Collectors.toCollection(LinkedHashSet::new));
        empDto.getEmpContainer().getEmissionsMonitoringPlan().getEmissions().setShips(sorted);

        final TemplateParams empParams = constructTemplateParams(request, signatory, empDto, variationRequestInfoList,
                consolidationNumber, empSubmissionDate, endDate);

        return empCreateDocumentService.generateDocumentWithParams(empDto, MrtmDocumentTemplateType.EMP, empParams);
    }

    private EmissionsMonitoringPlanDTO createEmpDto(final Long accountId,
                                                    final EmissionsMonitoringPlan emp,
                                                    final Map<UUID, String> attachments,
                                                    final int newConsolidationNumber) {

        // in case of variation the emp id exists, otherwise it has to be generated
        final String empId = empQueryService.getEmpIdByAccountId(accountId).orElse(generator.generate(accountId));
        
        return EmissionsMonitoringPlanDTO.builder()
            .id(empId)
            .empContainer(
                EmissionsMonitoringPlanContainer.builder()
                    .emissionsMonitoringPlan(emp)
                    .empAttachments(attachments)
                    .build())
            .consolidationNumber(newConsolidationNumber)
            .accountId(accountId)
            .build();
    }

    protected TemplateParams constructTemplateParams(final Request request,
                                                     final String signatory,
                                                     final EmissionsMonitoringPlanDTO emp,
                                                     final List<EmpVariationRequestInfo> variationRequestInfoList,
                                                     final int consolidationNumber,
                                                     final LocalDateTime empSubmissionDate,
                                                     final LocalDateTime empEndDate) {

        final TemplateParams templateParams = empParamsProvider.constructTemplateParams(
            DocumentTemplateEmpParamsSourceData.builder()
                .request(request)
                .signatory(signatory)
                .empContainer(emp.getEmpContainer())
                .consolidationNumber(consolidationNumber)
                .variationRequestInfoList(variationRequestInfoList)
                .empEndDate(empEndDate)
                .empSubmissionDate(empSubmissionDate)
                .build()
        );

        // emp id has to be set explicitly as it might not exist in the database yet (e.g. issuance)
        templateParams.getAccountParams()
            .setName(emp.getEmpContainer().getEmissionsMonitoringPlan().getOperatorDetails().getOperatorName());

        return templateParams;
    }
}
