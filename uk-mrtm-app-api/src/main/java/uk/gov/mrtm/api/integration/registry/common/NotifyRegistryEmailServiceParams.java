package uk.gov.mrtm.api.integration.registry.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.integration.model.error.IntegrationEventErrorDetails;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotifyRegistryEmailServiceParams {

    private Account account;
    private String emitterId;
    private String correlationId;
    private List<IntegrationEventErrorDetails> errorsForMail;
    private String recipient;
    private boolean isFordway;
    private String templateName;
    private String integrationPoint;
    private Map<String, String> fields;
}
