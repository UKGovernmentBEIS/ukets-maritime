package uk.gov.mrtm.api.web.config.swagger;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.mireport.verificationbodyusers.MaritimeVerificationBodyUsersMiReportResult;
import uk.gov.netz.api.mireport.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactsMiReportResult;
import uk.gov.netz.api.mireport.accountuserscontacts.AccountsUsersContactsMiReportResult;
import uk.gov.netz.api.mireport.customreport.CustomMiReportResult;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestActionsMiReportResult;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTasksMiReportResult;
import uk.gov.netz.api.swagger.SwaggerSchemasAbstractProvider;

@Component
public class MiReportResultTypesSchemasProvider extends SwaggerSchemasAbstractProvider {

    @Override
    public void afterPropertiesSet() {
        addResolvedShemas(AccountsUsersContactsMiReportResult.class.getSimpleName(), AccountsUsersContactsMiReportResult.class);
        addResolvedShemas(ExecutedRequestActionsMiReportResult.class.getSimpleName(), ExecutedRequestActionsMiReportResult.class);
        addResolvedShemas(OutstandingRequestTasksMiReportResult.class.getSimpleName(), OutstandingRequestTasksMiReportResult.class);
        addResolvedShemas(AccountAssignedRegulatorSiteContactsMiReportResult.class.getSimpleName(), AccountAssignedRegulatorSiteContactsMiReportResult.class);
        addResolvedShemas(CustomMiReportResult.class.getSimpleName(), CustomMiReportResult.class);
        addResolvedShemas(MaritimeVerificationBodyUsersMiReportResult.class.getSimpleName(), MaritimeVerificationBodyUsersMiReportResult.class);
    }

}
