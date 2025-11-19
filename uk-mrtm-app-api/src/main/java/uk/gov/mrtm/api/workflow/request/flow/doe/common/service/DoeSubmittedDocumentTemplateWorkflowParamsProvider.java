package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateGenerationContextActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateWorkflowParamsProvider;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;

@Component
public class DoeSubmittedDocumentTemplateWorkflowParamsProvider
    implements DocumentTemplateWorkflowParamsProvider<DoeRequestPayload> {

    @Override
    public String getContextActionType() {
        return MrtmDocumentTemplateGenerationContextActionType.DOE_SUBMIT;
    }

    @Override
    public Map<String, Object> constructParams(DoeRequestPayload requestPayload) {
        Doe doe = requestPayload.getDoe();
        Year reportingYear = requestPayload.getReportingYear();

        Map<String, Object> vars = new HashMap<>();

        vars.put("reportingYear", reportingYear);
        vars.put("totalEmissions", doe.getMaritimeEmissions().getTotalMaritimeEmissions().getTotalReportableEmissions());
        vars.put("determinationReasonDescription",
                retrieveDeterminationReasonDescription(doe.getMaritimeEmissions().getDeterminationReason().getType(), reportingYear));
        vars.put("emissionsCalculationApproachDescription",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getCalculationApproach());
        vars.put("smallIslandFerryDeduction",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getSmallIslandFerryDeduction());
        vars.put("surrenderEmissions",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getSurrenderEmissions());
        vars.put("iceClassDeduction",
                doe.getMaritimeEmissions().getTotalMaritimeEmissions().getIceClassDeduction());

        return vars;
    }

    private String retrieveDeterminationReasonDescription(DoeDeterminationReasonType dreDeterminationReasonType,
                                                          Year reportingYear) {

        return switch (dreDeterminationReasonType) {
            case VERIFIED_REPORT_NOT_SUBMITTED_IN_ACCORDANCE_WITH_ORDER -> String.format(dreDeterminationReasonType.getDescription(), reportingYear.plusYears(1));
            case CORRECTING_NON_MATERIAL_MISSTATEMENT -> String.format(dreDeterminationReasonType.getDescription(), reportingYear);
            case IMPOSING_OR_CONSIDERING_IMPOSING_CIVIL_PENALTY_IN_ACCORDANCE_WITH_ORDER -> dreDeterminationReasonType.getDescription();
        };
    }
}
