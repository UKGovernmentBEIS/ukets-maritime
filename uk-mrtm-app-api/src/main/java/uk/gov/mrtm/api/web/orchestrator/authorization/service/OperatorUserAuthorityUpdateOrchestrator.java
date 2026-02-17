package uk.gov.mrtm.api.web.orchestrator.authorization.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.core.domain.Authority;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.core.repository.AuthorityRepository;
import uk.gov.netz.api.user.operator.domain.OperatorUserDTO;
import uk.gov.netz.api.user.operator.service.OperatorUserManagementService;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OperatorUserAuthorityUpdateOrchestrator {

    private final OperatorUserManagementService operatorUserManagementService;
    private final ApplicationEventPublisher publisher;
    private final AuthorityRepository authorityRepository;

    @Transactional
    public void updateOperatorUserByAccountAndId(Long accountId, String userId, OperatorUserDTO operatorUserDTO) {
        operatorUserManagementService.updateOperatorUserByAccountAndId(accountId, userId, operatorUserDTO);

        Set<Long> accountIds = authorityRepository.findByUserIdAndStatus(userId, AuthorityStatus.ACTIVE)
            .stream()
            .map(Authority::getAccountId)
            .collect(Collectors.toSet());

        publisher.publishEvent(AccountContactsRegistryEvent.builder().accountIds(accountIds).build());
    }

    @Transactional
    public void updateOperatorUser(AppUser appUser, OperatorUserDTO operatorUserDTO) {
        operatorUserManagementService.updateOperatorUser(appUser, operatorUserDTO);

        Set<Long> accountIds = appUser.getAuthorities()
            .stream()
            .map(AppAuthority::getAccountId)
            .collect(Collectors.toSet());

        publisher.publishEvent(AccountContactsRegistryEvent.builder().accountIds(accountIds).build());
    }
}
