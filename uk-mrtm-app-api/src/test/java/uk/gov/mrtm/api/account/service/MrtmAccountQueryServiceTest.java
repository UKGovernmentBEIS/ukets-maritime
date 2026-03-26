package uk.gov.mrtm.api.account.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountViewDTO;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.account.transform.MrtmAccountMapper;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.netz.api.common.exception.BusinessException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class MrtmAccountQueryServiceTest {

    @InjectMocks
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private MrtmAccountRepository mrtmAccountRepository;

    @Mock
    private MrtmAccountMapper accountMapper;

    @Test
    void getAccountById() {
        Long accountId = 1L;
        MrtmAccount mrtmAccount = mock(MrtmAccount.class);

        when(mrtmAccountRepository.findById(accountId)).thenReturn(Optional.of(mrtmAccount));
        MrtmAccount response = mrtmAccountQueryService.getAccountById(accountId);

        assertEquals(mrtmAccount, response);

        verify(mrtmAccountRepository).findById(accountId);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void getAccountById_throws_exception() {
        Long accountId = 1L;
        when(mrtmAccountRepository.findById(accountId)).thenReturn(Optional.empty());

        BusinessException exception = assertThrows(BusinessException.class,
            () -> mrtmAccountQueryService.getAccountById(accountId));

        assertEquals(RESOURCE_NOT_FOUND, exception.getErrorCode());

        verify(mrtmAccountRepository).findById(accountId);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void getAccountByRegistryId() {
        int registryId = 1;
        MrtmAccount mrtmAccount = mock(MrtmAccount.class);

        when(mrtmAccountRepository.findByRegistryId(registryId)).thenReturn(Optional.of(mrtmAccount));
        MrtmAccount response = mrtmAccountQueryService.getAccountByRegistryId(registryId);

        assertEquals(mrtmAccount, response);

        verify(mrtmAccountRepository).findByRegistryId(registryId);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void getAccountByRegistryId_throws_exception() {
        int registryId = 1;
        when(mrtmAccountRepository.findByRegistryId(registryId)).thenReturn(Optional.empty());

        BusinessException exception = assertThrows(BusinessException.class,
            () -> mrtmAccountQueryService.getAccountByRegistryId(registryId));

        assertEquals(RESOURCE_NOT_FOUND, exception.getErrorCode());

        verify(mrtmAccountRepository).findByRegistryId(registryId);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void getAccountIdByImoNumber() {
        String imoNumber = "1234567";
        long accountId = 1L;

        when(mrtmAccountRepository.findAccountIdByImoNumber(imoNumber)).thenReturn(Optional.of(accountId));
        long response = mrtmAccountQueryService.getAccountIdByImoNumber(imoNumber);

        assertEquals(accountId, response);

        verify(mrtmAccountRepository).findAccountIdByImoNumber(imoNumber);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void getAccountIdByImoNumber_throws_exception() {
        String imoNumber = "1234567";
        when(mrtmAccountRepository.findAccountIdByImoNumber(imoNumber)).thenReturn(Optional.empty());

        BusinessException exception = assertThrows(BusinessException.class,
            () -> mrtmAccountQueryService.getAccountIdByImoNumber(imoNumber));

        assertEquals(RESOURCE_NOT_FOUND, exception.getErrorCode());

        verify(mrtmAccountRepository).findAccountIdByImoNumber(imoNumber);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void findVerificationBodyIdByImoNumber() {
        String imoNumber = "1234567";
        long vbId = 1L;

        when(mrtmAccountRepository.findVerificationBodyIdByImoNumber(imoNumber)).thenReturn(Optional.of(vbId));
        Optional<Long> response = mrtmAccountQueryService.findVerificationBodyIdByImoNumber(imoNumber);

        assertTrue(response.isPresent());
        assertEquals(vbId, response.get());

        verify(mrtmAccountRepository).findVerificationBodyIdByImoNumber(imoNumber);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void getAccountIdsByStatuses() {
        Long accountId = 1L;
        List<MrtmAccountStatus> accountStatuses = List.of(MrtmAccountStatus.LIVE);
        MrtmAccount mrtmAccount = MrtmAccount.builder().id(accountId).build();

        when(mrtmAccountRepository.findAllByStatusIn(accountStatuses)).thenReturn(List.of(mrtmAccount));
        List<Long> response = mrtmAccountQueryService.getAccountIdsByStatuses(accountStatuses);

        assertEquals(List.of(accountId), response);

        verify(mrtmAccountRepository).findAllByStatusIn(accountStatuses);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void existsAccountById() {
        Long accountId = 1L;
        when(mrtmAccountRepository.existsById(accountId)).thenReturn(true);

        assertTrue(mrtmAccountQueryService.existsAccountById(accountId));
        verify(mrtmAccountRepository).existsById(accountId);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void isExistingAccountImoNumber() {
        String imoNumber = "0000000";
        when(mrtmAccountRepository.existsByImoNumber(imoNumber)).thenReturn(true);
        assertTrue(mrtmAccountQueryService.isExistingAccountImoNumber(imoNumber));
        verify(mrtmAccountRepository).existsByImoNumber(imoNumber);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @ParameterizedTest
    @MethodSource("provideGetAccountViewDTOByIdAndUserTestArgs")
    void getAccountDTOByIdAndUser(MrtmAccount account, MrtmAccountViewDTO expectedResult,
                                  int toMrtmAccountViewDTOInvocations) {
        Long accountId = account.getId();

        when(mrtmAccountRepository.findById(accountId)).thenReturn(Optional.of(account));
        when(accountMapper.toMrtmAccountViewDTO(account)).thenReturn(expectedResult);

        final MrtmAccountViewDTO mrtmAccountViewDTO = mrtmAccountQueryService.getAccountDTOByIdAndUser(accountId);
        assertThat(mrtmAccountViewDTO).isNotNull();
        assertEquals(expectedResult, mrtmAccountViewDTO);

        verify(mrtmAccountRepository, times(1)).findById(accountId);
        verify(accountMapper, times(toMrtmAccountViewDTOInvocations)).toMrtmAccountViewDTO(account);
        verifyNoMoreInteractions(accountMapper);
    }

    @Test
    void existsByImoNumberAndId() {
        String imoNumber = "0000000";
        Long accountId = 1L;
        when(mrtmAccountRepository.existsByImoNumberAndId(imoNumber, accountId)).thenReturn(true);
        assertTrue(mrtmAccountQueryService.existsByImoNumberAndId(imoNumber, accountId));
        verify(mrtmAccountRepository).existsByImoNumberAndId(imoNumber, accountId);
        verifyNoMoreInteractions(mrtmAccountRepository);
    }

    @Test
    void findByBusinessId() {
        MrtmAccount expectedAccount = mock(MrtmAccount.class);
        String businessId = "MA12345";

        when(mrtmAccountRepository.findByBusinessId(businessId)).thenReturn(expectedAccount);

        MrtmAccount actualAccount = mrtmAccountQueryService.findByBusinessId(businessId);

        assertEquals(expectedAccount, actualAccount);
        verify(mrtmAccountRepository).findByBusinessId(businessId);
        verifyNoMoreInteractions(mrtmAccountRepository);
        verifyNoInteractions(accountMapper);
    }

    private static Stream<Arguments> provideGetAccountViewDTOByIdAndUserTestArgs() {
        Long accountId = 1L;
        MrtmAccount account = MrtmAccount.builder()
                .id(accountId)
                .name("name")
                .imoNumber("0000000")
                .businessId("MA00001")
                .address(createAddressState())
                .firstMaritimeActivityDate(LocalDate.of(2024, 6, 30))
                .status(MrtmAccountStatus.NEW)
                .build();

        MrtmAccountViewDTO generalDTO = MrtmAccountViewDTO.builder()
                .id(accountId)
                .name("name")
                .imoNumber("0000000")
            .businessId("MA00001")
                .address(createAddressStateDTO())
                .firstMaritimeActivityDate(LocalDate.of(2024, 6, 30))
                .status(MrtmAccountStatus.NEW)
                .build();

        MrtmAccountViewDTO regulatorDTO = MrtmAccountViewDTO.builder()
                .id(accountId)
                .name("name")
                .businessId("MA00001")
                .status(MrtmAccountStatus.NEW)
                .build();

        return Stream.of(
                Arguments.of(account, regulatorDTO, 1, 0),
                Arguments.of(account, generalDTO, 1, 0)
        );
    }

    private static AddressStateDTO createAddressStateDTO() {
        return AddressStateDTO.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .country("country")
                .state("state")
                .build();
    }

    private static AddressState createAddressState() {
        return AddressState.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .country("country")
                .state("state")
                .build();
    }
}
