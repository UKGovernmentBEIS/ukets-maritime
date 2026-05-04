package uk.gov.mrtm.api.workflow.request.flow.common.jsonprovider;

import com.fasterxml.jackson.databind.jsontype.NamedType;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.mireport.system.MrtmMiReportType;
import uk.gov.netz.api.common.config.jackson.JsonSubTypesProvider;
import uk.gov.netz.api.mireport.system.EmptyMiReportSystemParams;

import java.util.List;

@Component
public class MrtmMiReportParamsTypesProvider implements JsonSubTypesProvider {
    @Override
    public List<NamedType> getTypes() {
        return List.of(
                new NamedType(EmptyMiReportSystemParams.class, MrtmMiReportType.LIST_OF_VERIFICATION_BODY_USERS)

        );
    }
}
