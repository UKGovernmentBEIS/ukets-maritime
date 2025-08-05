package uk.gov.mrtm.api.workflow.request.application.item.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.application.item.domain.ItemPage;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemDTOResponse;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MrtmItemResponseServiceTest {

    @InjectMocks
    private MrtmItemResponseService mrtmItemResponseService;

    @Mock
    private ItemResponseCreationService itemResponseCreationService;

    @Test
    void toItemDTOResponse_operator_same_assignee() {
        ItemPage itemPage = mock(ItemPage.class);
        AppUser appUser = mock(AppUser.class);
        ItemDTOResponse itemDTOResponse = mock(ItemDTOResponse.class);
        Map<String, Map<String, String>> itemRequestResources = mock(HashMap.class);

        when(itemResponseCreationService.toItemDTOResponse(itemPage, itemRequestResources, appUser)).thenReturn(itemDTOResponse);

        ItemDTOResponse response = mrtmItemResponseService.toItemDTOResponse(itemPage, itemRequestResources, appUser);

        assertEquals(itemDTOResponse, response);
        verify(itemResponseCreationService).toItemDTOResponse(itemPage, itemRequestResources, appUser);
        verifyNoMoreInteractions(itemResponseCreationService);
    }
}
