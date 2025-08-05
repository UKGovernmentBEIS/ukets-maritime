package uk.gov.mrtm.api.web.config.swagger;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.workflow.request.application.item.domain.dto.MrtmItemDTO;
import uk.gov.netz.api.swagger.SwaggerSchemasAbstractProvider;

@Component
public class MrtmAccountPayloadSchemasProvider extends SwaggerSchemasAbstractProvider {

    @Override
    public void afterPropertiesSet() {
        // this is needed in order to generate swagger implementation for MrtmItemDTO
        addResolvedShemas(MrtmItemDTO.class.getSimpleName(), MrtmItemDTO.class);
        addResolvedShemas(MrtmAccountStatus.class.getSimpleName(), MrtmAccountStatus.class);
    }
}