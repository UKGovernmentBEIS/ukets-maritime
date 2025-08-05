package uk.gov.mrtm.api.workflow.request.application.item.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemDTOResponse;
import uk.gov.netz.api.workflow.request.application.item.service.ItemResponseService;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class MrtmItemResponseService implements ItemResponseService {

    private final ItemResponseCreationService itemResponseCreationService;

    @Override
    public ItemDTOResponse toItemDTOResponse(ItemPage itemPage, Map<String, Map<String, String>> itemRequestResources, AppUser appUser) {
        return itemResponseCreationService.toItemDTOResponse(itemPage, itemRequestResources, appUser);
    }
}
