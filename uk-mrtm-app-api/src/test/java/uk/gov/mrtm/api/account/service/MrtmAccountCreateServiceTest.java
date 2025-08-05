package uk.gov.mrtm.api.account.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountCreatedEvent;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.MrtmEmissionTradingScheme;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.enumeration.AccountSearchKey;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.account.transform.MrtmAccountMapper;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.account.service.AccountSearchAdditionalKeywordService;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MrtmAccountCreateServiceTest {

    @InjectMocks
    private MrtmAccountCreateService mrtmAccountCreateService;

    @Mock
    private MrtmAccountRepository mrtmAccountRepository;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private AccountSearchAdditionalKeywordService accountSearchAdditionalKeywordService;

    @Mock
    private MrtmAccountMapper mrtmAccountMapper;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Captor
    ArgumentCaptor<MrtmAccount> accountCaptor;

    @Captor
    ArgumentCaptor<MrtmAccountCreatedEvent> eventArgumentCaptor;

    @ParameterizedTest
    @MethodSource("createMaritimeAccountScenarios")
    void createMaritimeAccount(LocalDate firstMaritimeActivity, List<Year> expectedYears) {
        Long accountId = 1L;
        String businessId = "MA00001";
        String accountName = "Account name";
        String imoNumber = "0000000";
        String line1 = "line1";
        String city = "city";
        String country = "country";
        String postcode = "postcode";
        String state = "state";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        MrtmEmissionTradingScheme emissionTradingScheme = MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME;
        MrtmAccountStatus status = MrtmAccountStatus.NEW;

        final MrtmAccountDTO accountCreationDTO = MrtmAccountDTO.builder()
                .name(accountName)
                .imoNumber(imoNumber)
                .address(AddressStateDTO.builder()
                        .line1(line1)
                        .city(city)
                        .country(country)
                        .postcode(postcode)
                        .state(state)
                        .build())
                .firstMaritimeActivityDate(firstMaritimeActivity)
                .build();

        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(competentAuthority).build()))
                .build();

        final MrtmAccount mrtmAccount = MrtmAccount.builder()
                .id(accountId)
                .name(accountName)
                .businessId(businessId)
                .emissionTradingScheme(emissionTradingScheme)
                .imoNumber(imoNumber)
                .status(status)
                .address(AddressState.builder()
                        .line1(line1)
                        .city(city)
                        .country(country)
                        .postcode(postcode)
                        .state(state)
                        .build())
                .firstMaritimeActivityDate(firstMaritimeActivity)
                .build();

        when(mrtmAccountQueryService.isExistingAccountImoNumber(imoNumber)).thenReturn(false);
        when(mrtmAccountRepository.generateId()).thenReturn(accountId);
        when(mrtmAccountMapper.toMrtmAccount(accountCreationDTO, accountId, status, emissionTradingScheme,
                competentAuthority, businessId)).thenReturn(mrtmAccount);

        mrtmAccountCreateService.createMaritimeAccount(accountCreationDTO, appUser);

        verify(mrtmAccountQueryService).isExistingAccountImoNumber(imoNumber);
        verify(mrtmAccountRepository).generateId();
        verify(accountSearchAdditionalKeywordService)
                .storeKeywordsForAccount(accountId, getSearchKeywords(accountName, imoNumber, businessId));
        verify(mrtmAccountMapper).toMrtmAccount(accountCreationDTO, accountId, status,
                emissionTradingScheme, competentAuthority, businessId);
        verify(eventPublisher).publishEvent(eventArgumentCaptor.capture());

        verify(mrtmAccountRepository).save(accountCaptor.capture());
        assertEquals(accountName, accountCaptor.getValue().getName());
        assertEquals(imoNumber, accountCaptor.getValue().getImoNumber());
        assertEquals(status, accountCaptor.getValue().getStatus());
        assertEquals(businessId, accountCaptor.getValue().getBusinessId());
        assertEquals(accountId, accountCaptor.getValue().getId());
        assertEquals(accountId, eventArgumentCaptor.getValue().getAccountId());
        assertEquals(expectedYears, eventArgumentCaptor.getValue().getReportingYears());

        verifyNoMoreInteractions(accountSearchAdditionalKeywordService, eventPublisher);
    }

    private static Stream<Arguments> createMaritimeAccountScenarios() {
        return Stream.of(
            Arguments.of(LocalDate.of(Year.now().getValue(), 4, 26), List.of(Year.now())),
            Arguments.of(LocalDate.of(Year.now().plusYears(1).getValue(), 4, 26), List.of(Year.now())),
            Arguments.of(LocalDate.of(Year.now().minusYears(1).getValue(), 4, 26), List.of(Year.now().minusYears(1), Year.now()))
        );
    }

    @Test
    void createMaritimeAccount_imo_number_exists() {
        String accountName = "Account name";
        String imoNumber = "0000000";
        LocalDate firstMaritimeActivity = LocalDate.of(2023, 4, 26);
        String line1 = "line1";
        String city = "city";
        String country = "country";
        String postcode = "postcode";
        String state = "state";
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;


        final MrtmAccountDTO accountCreationDTO = MrtmAccountDTO.builder()
                .name(accountName)
                .imoNumber(imoNumber)
                .address(AddressStateDTO.builder()
                        .line1(line1)
                        .city(city)
                        .country(country)
                        .postcode(postcode)
                        .state(state)
                        .build())
                .firstMaritimeActivityDate(firstMaritimeActivity)
                .build();

        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(competentAuthority).build()))
                .build();

        when(mrtmAccountQueryService.isExistingAccountImoNumber(imoNumber)).thenReturn(true);

        BusinessException be = assertThrows(BusinessException.class,
                () ->mrtmAccountCreateService.createMaritimeAccount(accountCreationDTO, appUser));

        assertEquals(MrtmErrorCode.IMO_NUMBER_ALREADY_RELATED_WITH_ANOTHER_ACCOUNT, be.getErrorCode());


        verify(mrtmAccountQueryService).isExistingAccountImoNumber(imoNumber);
        verifyNoInteractions(mrtmAccountRepository, mrtmAccountMapper, accountSearchAdditionalKeywordService, eventPublisher);
    }

    private Map<String, String> getSearchKeywords(String accountName, String imoNumber, String businessId) {
        return Map.of(
            AccountSearchKey.ACCOUNT_NAME.name(), accountName,
            AccountSearchKey.IMO_NUMBER.name(), imoNumber,
            AccountSearchKey.BUSINESS_ID.name(), businessId);
    }
}
