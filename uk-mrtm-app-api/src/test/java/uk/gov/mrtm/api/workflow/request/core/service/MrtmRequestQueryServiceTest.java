package uk.gov.mrtm.api.workflow.request.core.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestHistoryCategory;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class MrtmRequestQueryServiceTest {

    @InjectMocks
    private MrtmRequestQueryService mrtmRequestQueryService;

    @Mock
    private RequestQueryService requestQueryService;

    @ParameterizedTest
    @MethodSource("validScenarios")
    void findRequestDetailsBySearchCriteria(String roleType, MrtmRequestHistoryCategory historyCategory) {
        RequestSearchCriteria criteria = RequestSearchCriteria.builder()
            .historyCategory(historyCategory.name())
            .build();

        AppUser appUser = AppUser.builder().roleType(roleType).build();

        mrtmRequestQueryService.findRequestDetailsBySearchCriteria(criteria, appUser);

        verify(requestQueryService).findRequestDetailsBySearchCriteria(criteria);
        verifyNoMoreInteractions(requestQueryService);
    }

    public static Stream<Arguments> validScenarios() {
        return Stream.of(
            Arguments.of(RoleTypeConstants.OPERATOR, MrtmRequestHistoryCategory.PERMIT),
            Arguments.of(RoleTypeConstants.VERIFIER, MrtmRequestHistoryCategory.PERMIT),
            Arguments.of(RoleTypeConstants.REGULATOR, MrtmRequestHistoryCategory.PERMIT),

            Arguments.of(RoleTypeConstants.OPERATOR, MrtmRequestHistoryCategory.REPORTING),
            Arguments.of(RoleTypeConstants.VERIFIER, MrtmRequestHistoryCategory.REPORTING),
            Arguments.of(RoleTypeConstants.REGULATOR, MrtmRequestHistoryCategory.REPORTING),

            Arguments.of(RoleTypeConstants.REGULATOR, MrtmRequestHistoryCategory.CA),

            Arguments.of(RoleTypeConstants.REGULATOR, MrtmRequestHistoryCategory.NON_COMPLIANCE)
            );
    }

    @ParameterizedTest
    @MethodSource("invalidScenarios")
    void findRequestDetailsBySearchCriteria_throws_exception(String roleType, MrtmRequestHistoryCategory historyCategory) {
        RequestSearchCriteria criteria = RequestSearchCriteria.builder()
            .historyCategory(historyCategory.name())
            .build();

        AppUser appUser = AppUser.builder().roleType(roleType).build();

        BusinessException be = assertThrows(BusinessException.class,
            () -> mrtmRequestQueryService.findRequestDetailsBySearchCriteria(criteria, appUser));

        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.ROLE_NOT_ALLOWED_FOR_HISTORY_CATEGORY);

        verifyNoInteractions(requestQueryService);
    }

    public static Stream<Arguments> invalidScenarios() {
        return Stream.of(
            Arguments.of(RoleTypeConstants.OPERATOR, MrtmRequestHistoryCategory.NON_COMPLIANCE),
            Arguments.of(RoleTypeConstants.VERIFIER, MrtmRequestHistoryCategory.NON_COMPLIANCE),

            Arguments.of(RoleTypeConstants.OPERATOR, MrtmRequestHistoryCategory.CA),
            Arguments.of(RoleTypeConstants.VERIFIER, MrtmRequestHistoryCategory.CA)
        );
    }
}