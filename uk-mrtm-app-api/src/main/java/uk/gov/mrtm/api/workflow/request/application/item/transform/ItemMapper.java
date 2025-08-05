package uk.gov.mrtm.api.workflow.request.application.item.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.workflow.request.application.item.domain.dto.ItemAccountDTO;
import uk.gov.mrtm.api.workflow.request.application.item.domain.dto.MrtmItemDTO;
import uk.gov.netz.api.account.domain.Account;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.application.item.domain.Item;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ItemMapper {

    @Mapping(target = "accountId", source = "id")
    @Mapping(target = "accountName", source = "name")
    ItemAccountDTO accountToItemAccountDTO(Account account);

    @Mapping(target = "itemAssignee.taskAssignee", source = "taskAssignee")
    @Mapping(target = "itemAssignee.taskAssigneeType", source = "taskAssigneeType")
    @Mapping(target = "requestType", source = "item.requestType.code")
    @Mapping(target = "taskType", source = "item.taskType.code")
    @Mapping(target = "daysRemaining", expression = "java(uk.gov.netz.api.common.utils.DateUtils.getDaysRemaining(item.getPauseDate(), item.getTaskDueDate()))")
    MrtmItemDTO itemToItemDTO(Item item, UserInfoDTO taskAssignee, String taskAssigneeType, ItemAccountDTO account);
}
