package uk.gov.mrtm.api.web.orchestrator.verificationbody.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmEmissionTradingScheme;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.user.verifier.service.VerifierUserInvitationService;
import uk.gov.netz.api.verificationbody.domain.dto.VerificationBodyInfoDTO;
import uk.gov.netz.api.verificationbody.service.VerificationBodyCreationService;
import uk.gov.mrtm.api.web.orchestrator.verificationbody.dto.VerificationBodyCreationDTO;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class VerificationBodyAndUserOrchestrator {

    private final VerificationBodyCreationService verificationBodyCreationService;
    private final VerifierUserInvitationService verifierUserInvitationService;

    @Transactional
    public VerificationBodyInfoDTO createVerificationBody(AppUser appUser, VerificationBodyCreationDTO verificationBodyCreationDTO) {

        verificationBodyCreationDTO.getVerificationBody().setEmissionTradingSchemes(Set.of(MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME.getName()));
        VerificationBodyInfoDTO verificationBodyInfoDTO =
            verificationBodyCreationService.createVerificationBody(verificationBodyCreationDTO.getVerificationBody());

        verifierUserInvitationService.inviteVerifierAdminUser(appUser,
            verificationBodyCreationDTO.getAdminVerifierUserInvitation(),
            verificationBodyInfoDTO.getId());

        return verificationBodyInfoDTO;
    }
}
