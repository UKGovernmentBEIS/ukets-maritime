package uk.gov.mrtm.api.web.controller.guidance;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.format.support.FormattingConversionService;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.guidance.sections.domain.dto.GuidanceSectionDTO;
import uk.gov.netz.api.guidance.sections.domain.dto.GuidanceSectionsResponseDTO;
import uk.gov.netz.api.guidance.sections.domain.dto.SaveGuidanceSectionDTO;
import uk.gov.netz.api.guidance.sections.service.GuidanceSectionService;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.security.AuthorizedRoleAspect;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class GuidanceSectionControllerTest {
    private static final String CONTROLLER_PATH = "/v1.0/guidance-sections";

    @InjectMocks
    private GuidanceSectionController controller;

    @Mock
    private GuidanceSectionService guidanceSectionService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory factory = new AspectJProxyFactory(controller);
        factory.addAspect(aspect);
        factory.addAspect(authorizedRoleAspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(factory);
        controller = (GuidanceSectionController) aopProxy.getProxy();

        FormattingConversionService conversionService = new FormattingConversionService();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setConversionService(conversionService)
                .build();
    }

    @Test
    void getGuidanceSections() throws Exception {
        final AppUser user = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).build();
        final GuidanceSectionDTO dto = GuidanceSectionDTO.builder().id(1L).name("Section A").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(guidanceSectionService.getGuidanceSections(user)).thenReturn(GuidanceSectionsResponseDTO.builder()
                .guidanceSections(Map.of(CompetentAuthorityEnum.ENGLAND, List.of(dto)))
                .editable(true)
                .build());

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.guidanceSections['ENGLAND'][0].id").value(1L))
                .andExpect(jsonPath("$.guidanceSections['ENGLAND'][0].name").value("Section A"))
                .andExpect(jsonPath("$.editable").value(true));

        verify(guidanceSectionService).getGuidanceSections(user);
    }

    @Test
    void getGuidanceSections_forbidden() throws Exception {
        final AppUser user = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(roleAuthorizationService)
                .evaluate(eq(user), any(String[].class));

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verifyNoInteractions(guidanceSectionService);
    }

    @Test
    void getGuidanceSectionById() throws Exception {
        final AppUser user = AppUser.builder().roleType(RoleTypeConstants.OPERATOR).build();
        final GuidanceSectionDTO dto = GuidanceSectionDTO.builder().id(1L).name("Section A").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(guidanceSectionService.getGuidanceSectionById(1L, user)).thenReturn(dto);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(print())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Section A"));

        verify(guidanceSectionService).getGuidanceSectionById(1L, user);
    }

    @Test
    void getGuidanceSectionById_forbidden() throws Exception {
        Long sectionId = 1L;
        final AppUser user = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(user, "getGuidanceSectionById", Long.toString(sectionId), null, null);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "/" + sectionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verifyNoInteractions(guidanceSectionService);
    }

    @Test
    void createGuidanceSection() throws Exception {
        final AppUser user = AppUser.builder().roleType(RoleTypeConstants.VERIFIER).build();
        final SaveGuidanceSectionDTO saveDto = SaveGuidanceSectionDTO.builder().name("New Section").displayOrderNo(1).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(guidanceSectionService.createGuidanceSection(user, saveDto)).thenReturn(99L);

        mockMvc.perform(MockMvcRequestBuilders.post(CONTROLLER_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveDto)))
                .andExpect(status().isCreated())
                .andExpect(content().string("99"));

        verify(guidanceSectionService).createGuidanceSection(user, saveDto);
    }

    @Test
    void updateGuidanceSection() throws Exception {
        final AppUser user = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).build();
        final SaveGuidanceSectionDTO saveDto = SaveGuidanceSectionDTO.builder().name("Updated Section").displayOrderNo(1).build();
        final GuidanceSectionDTO dto = GuidanceSectionDTO.builder().id(1L).name("Updated Section").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(guidanceSectionService.updateGuidanceSection(1L, saveDto, user)).thenReturn(dto);

        mockMvc.perform(MockMvcRequestBuilders.put(CONTROLLER_PATH + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Updated Section"));

        verify(guidanceSectionService).updateGuidanceSection(1L, saveDto, user);
    }

    @Test
    void deleteGuidanceSection() throws Exception {
        final AppUser user = AppUser.builder().roleType(RoleTypeConstants.OPERATOR).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.delete(CONTROLLER_PATH + "/1"))
                .andExpect(status().isNoContent());

        verify(guidanceSectionService).deleteGuidanceSection(1L);
    }

}
