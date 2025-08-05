package uk.gov.mrtm.api.integration.registry.setoperator.validate;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.registry.common.RegistryCompetentAuthorityEnum;
import uk.gov.netz.integration.model.error.IntegrationEventError;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;
import uk.gov.netz.integration.model.operator.OperatorUpdateEvent;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SetOperatorRequestValidator {

    private final MrtmAccountQueryService mrtmAccountQueryService;

    public List<IntegrationEventErrorDetails> validate(OperatorUpdateEvent event) {
        List<IntegrationEventErrorDetails> errors = new ArrayList<>();

        if (StringUtils.isEmpty(event.getEmitterId())) {
            errors.add(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0201, "Emitter Id"));
        }

        if (RegistryCompetentAuthorityEnum.getCompetentAuthorityEnum(event.getRegulator()) == null) {
            errors.add(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0201, "Regulator authority"));
        }

        if (event.getOperatorId() == null || !event.getOperatorId().toString().matches("^\\d{7}$")) {
            errors.add(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0201, "Operator Id"));
        }

        if (!errors.isEmpty()) {
            return errors;
        }

        MrtmAccount accountByBusinessId = mrtmAccountQueryService.findByBusinessId(event.getEmitterId());
        if (accountByBusinessId == null) {
            errors.add(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0202, event.getEmitterId()));
        }

        if (accountByBusinessId != null
            && accountByBusinessId.getRegistryId() != null) {
            errors.add(new IntegrationEventErrorDetails(IntegrationEventError.ERROR_0203, event.getOperatorId().toString()));
        }

        return errors;
    }
}
