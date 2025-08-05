package uk.gov.mrtm.api.workflow.request.application.item.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.workflow.request.application.item.domain.dto.ItemAccountDTO;
import uk.gov.mrtm.api.workflow.request.application.item.domain.dto.MrtmItemDTO;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.api.account.repository.AccountRepository;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.core.domain.dto.UserRoleTypeDTO;
import uk.gov.netz.api.authorization.core.service.UserRoleTypeService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.user.core.service.auth.UserAuthService;
import uk.gov.netz.api.userinfoapi.UserInfo;
import uk.gov.netz.api.workflow.request.application.item.domain.Item;
import uk.gov.netz.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemAssigneeDTO;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemDTO;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.dto.UserInfoDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.netz.api.competentauthority.CompetentAuthorityEnum.ENGLAND;

@ExtendWith(MockitoExtension.class)
class ItemResponseCreationServiceTest {

    @InjectMocks
    private ItemResponseCreationService itemResponseCreationService;

    @Mock
    private UserAuthService userAuthService;
    @Mock
    private UserRoleTypeService userRoleTypeService;
    @Mock
    private AccountRepository accountRepository;

    private static final String REQUEST_ID_1 = "REQUEST_ID_1";
    private static final String REQUEST_TYPE_1 = "REQUEST_TYPE_1";
    private static final String REQUEST_TASK_TYPE_1 = "REQUEST_TASK_TYPE_1";
    private static final String ACCOUNT_NAME = "accountName";
    private static final String OPERATOR_1 = "OPERATOR_1";
    private static final String OPERATOR_2 = "OPERATOR_2";
    private static final String OPERATOR_1_USER_ID = "OPERATOR_1_USER_ID";
    private static final String OPERATOR_2_USER_ID = "OPERATOR_2_USER_ID";
    private static final Long ACCOUNT_ID = 1L;

    @Test
    void toItemDTOResponse_operator_same_assignee() {
        String userRoleType = RoleTypeConstants.OPERATOR;
        AppUser appUser = buildUser(OPERATOR_1_USER_ID, OPERATOR_1, OPERATOR_1);
        Account account = buildAccount();
        Item item = buildItem(OPERATOR_1_USER_ID);
        Map<String, String> requestResources = Map.of(ResourceType.ACCOUNT, ACCOUNT_ID.toString());
        Map<String, Map<String, String>> itemRequestResources = Map.of(REQUEST_ID_1, requestResources);


        ItemPage itemPage = ItemPage.builder().items(List.of(item)).totalItems(1L).build();

        ItemDTO expectedItemDTO = buildItemDTO(
                item,
                UserInfoDTO.builder().firstName(OPERATOR_1).lastName(OPERATOR_1).build(),
                userRoleType);

        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
                .items(List.of(expectedItemDTO))
                .totalItems(1L)
                .build();

        // Mock
        when(accountRepository.findAllByIdIn(List.of(ACCOUNT_ID))).thenReturn(List.of(account));
        when(userRoleTypeService.getUserRoleTypeByUserId(OPERATOR_1_USER_ID))
                .thenReturn(UserRoleTypeDTO.builder().roleType(userRoleType).build());

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemResponseCreationService.toItemDTOResponse(itemPage, itemRequestResources, appUser);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);
        verify(userRoleTypeService).getUserRoleTypeByUserId(OPERATOR_1_USER_ID);
        verify(userAuthService, never()).getUsers(anyList());
        verify(accountRepository).findAllByIdIn(List.of(ACCOUNT_ID));
        verifyNoMoreInteractions(userAuthService, userRoleTypeService, accountRepository);
    }

    @Test
    void toItemDTOResponse_operator_different_assignee() {
        AppUser appUser = buildUser(OPERATOR_1_USER_ID, OPERATOR_1, OPERATOR_1);
        Account account = buildAccount();
        Item item = buildItem(OPERATOR_2_USER_ID);
        Map<String, String> requestResources = Map.of(ResourceType.ACCOUNT, ACCOUNT_ID.toString());
        Map<String, Map<String, String>> itemRequestResources = Map.of(REQUEST_ID_1, requestResources);

        ItemPage itemPage = ItemPage.builder().items(List.of(item)).totalItems(1L).build();

        ItemDTO expectedItemDTO = buildItemDTO(
                item,
                UserInfoDTO.builder().firstName(OPERATOR_2).lastName(OPERATOR_2).build(),
                RoleTypeConstants.OPERATOR);

        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
                .items(List.of(expectedItemDTO))
                .totalItems(1L)
                .build();

        // Mock
        when(userAuthService.getUsers(List.of(item.getTaskAssigneeId()))).thenReturn(
                List.of(UserInfo.builder().id(OPERATOR_2_USER_ID).firstName(OPERATOR_2).lastName(OPERATOR_2).build()));
        when(userRoleTypeService.getUserRoleTypeByUserId(OPERATOR_2_USER_ID))
                .thenReturn(UserRoleTypeDTO.builder().roleType(RoleTypeConstants.OPERATOR).build());
        when(accountRepository.findAllByIdIn(List.of(ACCOUNT_ID))).thenReturn(List.of(account));

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemResponseCreationService.toItemDTOResponse(itemPage, itemRequestResources, appUser);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);
        verify(userRoleTypeService).getUserRoleTypeByUserId(OPERATOR_2_USER_ID);
        verify(userAuthService).getUsers(List.of(item.getTaskAssigneeId()));
        verify(accountRepository).findAllByIdIn(List.of(ACCOUNT_ID));
        verifyNoMoreInteractions(userAuthService, userRoleTypeService, accountRepository);
    }

    @Test
    void toItemDTOResponse_empty_list_of_users() {
        AppUser appUser = buildUser(OPERATOR_1_USER_ID, OPERATOR_1, OPERATOR_1);
        Item item = buildItem(null);
        Map<String, String> requestResources = Map.of(ResourceType.CA, CompetentAuthorityEnum.ENGLAND.name());
        Map<String, Map<String, String>> itemRequestResources = Map.of(REQUEST_ID_1, requestResources);

        ItemPage itemPage = ItemPage.builder().items(List.of(item)).totalItems(1L).build();

        ItemDTO expectedItemDTO = buildItemDTO(
                item,
                null,
                RoleTypeConstants.OPERATOR);

        ItemDTOResponse expectedItemDTOResponse = ItemDTOResponse.builder()
                .items(List.of(expectedItemDTO))
                .totalItems(1L)
                .build();

        // Invoke
        ItemDTOResponse actualItemDTOResponse = itemResponseCreationService.toItemDTOResponse(itemPage, itemRequestResources, appUser);

        // Assert
        assertEquals(expectedItemDTOResponse, actualItemDTOResponse);
        verifyNoInteractions(userAuthService, userRoleTypeService, accountRepository);
    }

    private AppUser buildUser(String userId, String firstName, String lastName) {
        return AppUser.builder()
                .userId(userId)
                .firstName(firstName)
                .lastName(lastName)
                .roleType(RoleTypeConstants.OPERATOR)
                .build();
    }

    private Item buildItem(String assigneeId) {
        return Item.builder()
                .creationDate(LocalDateTime.now())
                .requestId(REQUEST_ID_1)
                .requestType(RequestType.builder().code(REQUEST_TYPE_1).build())
                .taskId(1L)
                .taskType(RequestTaskType.builder().code(REQUEST_TASK_TYPE_1).build())
                .taskAssigneeId(assigneeId)
                .taskDueDate(LocalDate.of(2021, 1, 1))
                .pauseDate(LocalDate.of(2020,12,31))
                .build();
    }

    private MrtmItemDTO buildItemDTO(Item item, UserInfoDTO taskAssignee, String roleType) {
        return MrtmItemDTO.builder()
                .creationDate(item.getCreationDate())
                .requestId(item.getRequestId())
                .requestType(REQUEST_TYPE_1)
                .taskId(item.getTaskId())
                .taskType(REQUEST_TASK_TYPE_1)
                .itemAssignee(taskAssignee != null ?
                        ItemAssigneeDTO.builder()
                                .taskAssignee(taskAssignee)
                                .taskAssigneeType(roleType)
                                .build() : null)
                .account(taskAssignee != null ?
                        ItemAccountDTO.builder()
                        .accountId(ACCOUNT_ID)
                        .accountName(ACCOUNT_NAME)
                        .competentAuthority(ENGLAND)
                        .build() : null)
                .daysRemaining(1L)
                .build();
    }

    private Account buildAccount() {
        return MrtmAccount.builder()
                .id(ACCOUNT_ID)
                .name(ACCOUNT_NAME)
                .competentAuthority(ENGLAND)
                .build();
    }
}
