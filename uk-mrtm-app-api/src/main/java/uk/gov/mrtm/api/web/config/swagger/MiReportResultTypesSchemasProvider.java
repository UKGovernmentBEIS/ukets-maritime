package uk.gov.mrtm.api.web.config.swagger;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.mireport.system.verificationbodyusers.MaritimeVerificationBodyUsersMiReportResult;
import uk.gov.netz.api.mireport.system.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactsMiReportResult;
import uk.gov.netz.api.mireport.system.accountuserscontacts.AccountsUsersContactsMiReportResult;
import uk.gov.netz.api.mireport.system.executedactions.ExecutedRequestActionsMiReportResult;
import uk.gov.netz.api.mireport.system.outstandingrequesttasks.OutstandingRequestTasksMiReportResult;
import uk.gov.netz.api.swagger.SwaggerSchemasAbstractProvider;

@Component
public class MiReportResultTypesSchemasProvider extends SwaggerSchemasAbstractProvider {

    @Override
    public void afterPropertiesSet() {
        addResolvedShemas(AccountsUsersContactsMiReportResult.class.getSimpleName(), AccountsUsersContactsMiReportResult.class);
        addResolvedShemas(ExecutedRequestActionsMiReportResult.class.getSimpleName(), ExecutedRequestActionsMiReportResult.class);
        addResolvedShemas(OutstandingRequestTasksMiReportResult.class.getSimpleName(), OutstandingRequestTasksMiReportResult.class);
        addResolvedShemas(AccountAssignedRegulatorSiteContactsMiReportResult.class.getSimpleName(), AccountAssignedRegulatorSiteContactsMiReportResult.class);
        addResolvedShemas(MaritimeVerificationBodyUsersMiReportResult.class.getSimpleName(), MaritimeVerificationBodyUsersMiReportResult.class);
    }

}
