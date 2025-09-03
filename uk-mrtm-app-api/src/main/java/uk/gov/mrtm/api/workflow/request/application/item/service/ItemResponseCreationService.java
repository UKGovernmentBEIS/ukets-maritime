package uk.gov.mrtm.api.workflow.request.application.item.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.application.item.domain.dto.ItemAccountDTO;
import uk.gov.mrtm.api.workflow.request.application.item.transform.ItemMapper;
import uk.gov.netz.api.account.repository.AccountRepository;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.core.service.UserRoleTypeService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfo;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.application.item.domain.Item;
import uk.gov.netz.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemDTOResponse;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemResponseCreationService {

    private final UserAuthService userAuthService;
    private final UserRoleTypeService userRoleTypeService;
    private final AccountRepository accountRepository;
    private static final ItemMapper ITEM_MAPPER = Mappers.getMapper(ItemMapper.class);

    public ItemDTOResponse toItemDTOResponse(ItemPage itemPage, Map<String, Map<String, String>> itemRequestResources, AppUser appUser) {
        //get user info from keycloak for the task assignee ids
        Map<String, UserInfoDTO> users = getUserInfoForItemAssignees(appUser, itemPage);
        //get accounts for operator or regulator
        Map<String, ItemAccountDTO> accounts = getAccounts(itemRequestResources);

        List<ItemDTO> itemDTOs = itemPage.getItems().stream().map(i -> {
            UserInfoDTO taskAssignee = i.getTaskAssigneeId() != null
                ? users.get(i.getTaskAssigneeId())
                : null;
            String taskAssigneeType = getRoleTypeForItemAssignee(i.getTaskAssigneeId());
            ItemAccountDTO account = accounts.get(itemRequestResources.get(i.getRequestId()).get(ResourceType.ACCOUNT));

            return ITEM_MAPPER.itemToItemDTO(i,
                taskAssignee,
                taskAssigneeType,
                account);
        }).collect(Collectors.toList());

        return ItemDTOResponse.builder()
            .items(itemDTOs)
            .totalItems(itemPage.getTotalItems())
            .build();
    }

    private Map<String, UserInfoDTO> getUserInfoForItemAssignees(AppUser appUser, ItemPage itemPage) {
        Set<String> userIds = itemPage.getItems().stream()
            .map(Item::getTaskAssigneeId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        if (CollectionUtils.isEmpty(userIds)) {
            return Collections.emptyMap();
        }

        //if the assignee of all items is the appUser
        if (userIds.size() == 1 && userIds.contains(appUser.getUserId())) {
            return Map.of(appUser.getUserId(),
                    UserInfoDTO.builder().firstName(appUser.getFirstName()).lastName(appUser.getLastName()).build());
        }

        return userAuthService.getUsers(new ArrayList<>(userIds)).stream()
            .collect(Collectors.toMap(
                UserInfo::getId,
                u -> UserInfoDTO.builder().firstName(u.getFirstName()).lastName(u.getLastName()).build()));
    }

    private Map<String, ItemAccountDTO> getAccounts(Map<String, Map<String, String>> itemRequestResources) {
        List<Long> accountIds = itemRequestResources.values()
            .stream()
            .map(resource -> resource.get(ResourceType.ACCOUNT))
            .filter(Objects::nonNull)
            .map(Long::parseLong)
            .toList();

        if (CollectionUtils.isEmpty(accountIds)) {
            return Collections.emptyMap();
        }

        return accountRepository.findAllByIdIn(accountIds).stream()
            .map(ITEM_MAPPER::accountToItemAccountDTO)
            .collect(Collectors.toMap(itemAccountDTO -> itemAccountDTO.getAccountId().toString(), a -> a));
    }

    private String getRoleTypeForItemAssignee(String assignee) {
        return assignee != null ? userRoleTypeService.getUserRoleTypeByUserId(assignee).getRoleType() : null;
    }
}
