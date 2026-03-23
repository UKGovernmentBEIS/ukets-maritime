package uk.gov.mrtm.api.workflow.request.flow.common.jsonprovider;

import com.fasterxml.jackson.databind.jsontype.NamedType;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.integration.external.common.MrtmStagingPayloadType;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.netz.api.common.config.jackson.JsonSubTypesProvider;

import java.util.List;

@Component
public class MrtmStagingPayloadTypesProvider implements JsonSubTypesProvider {
    @Override
    public List<NamedType> getTypes() {
        return List.of(
            new NamedType(StagingAer.class, MrtmStagingPayloadType.AER_STAGING_PAYLOAD),
            new NamedType(StagingEmissionsMonitoringPlan.class, MrtmStagingPayloadType.EMP_STAGING_PAYLOAD)
        );
    }
}
