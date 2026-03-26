package uk.gov.mrtm.api.workflow.request.flow.common.jsonprovider;

import com.fasterxml.jackson.databind.jsontype.NamedType;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.mireport.system.MrtmMiReportType;
import uk.gov.mrtm.api.mireport.system.verificationbodyusers.MaritimeVerificationBodyUsersMiReportResult;
import uk.gov.netz.api.common.config.jackson.JsonSubTypesProvider;

import java.util.List;

@Component
public class MrtmMiReportResultTypesProvider implements JsonSubTypesProvider {
    @Override
    public List<NamedType> getTypes() {
        return List.of(
                new NamedType(MaritimeVerificationBodyUsersMiReportResult.class, MrtmMiReportType.LIST_OF_VERIFICATION_BODY_USERS)
                );
    }
}
