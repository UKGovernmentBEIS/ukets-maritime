package uk.gov.mrtm.api.web.config.swagger;

import org.springframework.stereotype.Component;
import uk.gov.netz.api.mireport.customreport.CustomMiReportParams;
import uk.gov.netz.api.mireport.domain.EmptyMiReportParams;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.netz.api.swagger.SwaggerSchemasAbstractProvider;

@Component
public class MiReportParamsSchemasProvider extends SwaggerSchemasAbstractProvider {

    @Override
    public void afterPropertiesSet() {
        addResolvedShemas(ExecutedRequestActionsMiReportParams.class.getSimpleName(), ExecutedRequestActionsMiReportParams.class);
        addResolvedShemas(OutstandingRegulatorRequestTasksMiReportParams.class.getSimpleName(), OutstandingRegulatorRequestTasksMiReportParams.class);
        addResolvedShemas(CustomMiReportParams.class.getSimpleName(), CustomMiReportParams.class);
        addResolvedShemas(EmptyMiReportParams.class.getSimpleName(), EmptyMiReportParams.class);
    }

}
