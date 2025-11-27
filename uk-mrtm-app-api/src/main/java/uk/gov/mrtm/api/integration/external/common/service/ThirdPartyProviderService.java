package uk.gov.mrtm.api.integration.external.common.service;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderDTO;

import java.util.List;

@Component
public interface ThirdPartyProviderService {

    ThirdPartyDataProviderDTO getThirdPartyDataProviderInfo(Long requestTaskId);

    List<String> getTypes();

}
