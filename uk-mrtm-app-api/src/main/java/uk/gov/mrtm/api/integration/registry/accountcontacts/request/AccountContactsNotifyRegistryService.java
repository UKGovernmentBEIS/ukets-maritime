package uk.gov.mrtm.api.integration.registry.accountcontacts.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.AccountContactsRegistryEvent;
import uk.gov.mrtm.api.integration.registry.accountcontacts.domain.RegistryAccountContactUserType;
import uk.gov.netz.api.account.service.AccountContactQueryService;
import uk.gov.netz.api.authorization.core.domain.AuthorityStatus;
import uk.gov.netz.api.authorization.core.domain.dto.AuthorityRoleDTO;
import uk.gov.netz.api.authorization.operator.service.OperatorAuthorityQueryService;
import uk.gov.netz.api.user.operator.domain.OperatorUserDTO;
import uk.gov.netz.api.user.operator.service.OperatorUserAuthService;
import uk.gov.netz.integration.model.metscontacts.MetsContactsEvent;
import uk.gov.netz.integration.model.metscontacts.MetsContactsMessage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.REQUEST_LOG_FORMAT;
import static uk.gov.mrtm.api.integration.registry.common.NotifyRegistryUtils.SERVICE_KEY;

@Log4j2
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "registry.integration.account.contacts.enabled", havingValue = "true")
public class AccountContactsNotifyRegistryService {

    private static final String INTEGRATION_POINT_KEY = "Account Contacts";

    private final MrtmAccountQueryService accountQueryService;
    private final AccountContactsSendToRegistryProducer accountContactsSendToRegistryProducer;
    private final OperatorAuthorityQueryService operatorAuthorityQueryService;
    private final AccountContactQueryService accountContactQueryService;
    private final KafkaTemplate<String, MetsContactsEvent> accountContactsKafkaTemplate;
    private final OperatorUserAuthService operatorUserAuthService;

    public void notifyRegistry(AccountContactsRegistryEvent event) {
        log.info("Sending account contacts registry event");
        HashMap<String, OperatorUserDTO> allUsers = new HashMap<>();

        for (Long accountId : event.getAccountIds()) {
            processAccount(accountId, allUsers);
        }

        log.info("Account contacts registry event sent");
    }

    private void processAccount(Long accountId, HashMap<String, OperatorUserDTO> allUsers) {
        log.info("Sending account contacts registry event for account ID: {}", accountId);

        final MrtmAccount account = accountQueryService.getAccountById(accountId);

        if (ObjectUtils.isEmpty(account.getRegistryId())) {
            log.info(
                REQUEST_LOG_FORMAT, SERVICE_KEY, accountId,
                INTEGRATION_POINT_KEY, "Cannot send account contacts to ETS Registry because Operator Id is null");

            return;
        }

        MetsContactsEvent metsContactsEvent = buildMetsContactsEvent(account, allUsers);

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, account.getRegistryId(),
            INTEGRATION_POINT_KEY, "Sending account contacts event to registry " + metsContactsEvent);

        accountContactsSendToRegistryProducer.produce(metsContactsEvent, accountContactsKafkaTemplate);

        log.info(REQUEST_LOG_FORMAT, SERVICE_KEY, accountId,
                INTEGRATION_POINT_KEY, "Account contacts event sent to registry " + metsContactsEvent);
    }

    private MetsContactsEvent buildMetsContactsEvent(MrtmAccount account, HashMap<String, OperatorUserDTO> allUsers) {
        List<MetsContactsMessage> metsContactsMessages = new ArrayList<>();

        List<AuthorityRoleDTO> authorityRoleDTOList = operatorAuthorityQueryService.
            findOperatorUserAuthorityRoleListByAccountAndStatus(account.getId(), Set.of(AuthorityStatus.ACTIVE));

        Map<String, List<String>> contactTypes = accountContactQueryService
            .findOperatorContactTypesByAccount(account.getId()).entrySet()
            .stream()
            .collect(Collectors.groupingBy(Map.Entry::getValue, Collectors.mapping(Map.Entry::getKey, Collectors.toList())));

        for(AuthorityRoleDTO authorityRoleDTO : authorityRoleDTOList) {
            List<String> accountContactTypes = contactTypes.getOrDefault(authorityRoleDTO.getUserId(), new ArrayList<>());

            OperatorUserDTO user = allUsers.computeIfAbsent(authorityRoleDTO.getUserId(), operatorUserAuthService::getUserById);
            MetsContactsMessage metsContactsMessage = buildMetsContactsMessage(user, accountContactTypes, authorityRoleDTO.getRoleCode());
            metsContactsMessages.add(metsContactsMessage);
        }

        return MetsContactsEvent.builder()
            .operatorId(String.valueOf(account.getRegistryId()))
            .details(metsContactsMessages)
            .build();
    }

    private MetsContactsMessage buildMetsContactsMessage(OperatorUserDTO operatorUserDTO,
                                                         List<String> accountContactTypes,
                                                         String roleCode) {
        return MetsContactsMessage.builder()
            .firstName(operatorUserDTO.getFirstName())
            .lastName(operatorUserDTO.getLastName())
            .email(operatorUserDTO.getEmail())
            .telephoneNumber(operatorUserDTO.getPhoneNumber().getNumber())
            .telephoneCountryCode(operatorUserDTO.getPhoneNumber().getCountryCode())
            .mobileNumber(operatorUserDTO.getMobileNumber().getNumber())
            .mobilePhoneCountryCode(operatorUserDTO.getMobileNumber().getCountryCode())
            .userType(RegistryAccountContactUserType.fromRoleCode(roleCode).name())
            .contactTypes(accountContactTypes)
            .build();
    }
}
