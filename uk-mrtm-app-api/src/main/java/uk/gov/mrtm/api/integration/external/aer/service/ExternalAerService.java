package uk.gov.mrtm.api.integration.external.aer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.aer.domain.ExternalAer;
import uk.gov.netz.api.authorization.core.domain.AppUser;

import java.time.Year;

@Component
@RequiredArgsConstructor
public class ExternalAerService {

    @Transactional
    public void submitAerData(ExternalAer external, String companyImoNumber, Year year, AppUser appUser) {
    }
}
