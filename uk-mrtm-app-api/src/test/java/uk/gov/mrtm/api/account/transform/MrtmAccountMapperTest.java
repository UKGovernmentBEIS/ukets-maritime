package uk.gov.mrtm.api.account.transform;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.test.util.ReflectionTestUtils;
import uk.gov.mrtm.api.account.domain.AccountReportingStatus;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.MrtmEmissionTradingScheme;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountViewDTO;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MrtmAccountMapperTest {

    private final MrtmAccountMapper mrtmAccountMapper = Mappers.getMapper(MrtmAccountMapper.class);
    private final AddressStateMapper addressStateMapper = Mappers.getMapper(AddressStateMapper.class);

    @BeforeEach
    void init() {
        ReflectionTestUtils.setField(mrtmAccountMapper, "addressStateMapper", addressStateMapper);
    }

    @Test
    void toMrtmAccount() {
        Long accountId = 10L;
        String accountName = "accountName";
        String imoNumber = "0000000";
        LocalDate firstMaritimeActivityDate = LocalDate.of(2022, 12, 11);
        MrtmEmissionTradingScheme emissionTradingScheme = MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME;

        AccountReportingStatus reportingStatusEntry1 = AccountReportingStatus.builder()
                .status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT)
                .year(Year.now())
                .build();

        AccountReportingStatus reportingStatusEntry2 = AccountReportingStatus.builder()
                .status(MrtmAccountReportingStatus.EXEMPT)
                .reason("reason for exempt")
                .year(Year.now())
                .build();

        MrtmAccount mrtmAccount = MrtmAccount.builder()
                .id(accountId)
                .name(accountName)
                .emissionTradingScheme(emissionTradingScheme)
                .imoNumber(imoNumber)
                .status(MrtmAccountStatus.NEW)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .businessId("businessId")
                .firstMaritimeActivityDate(firstMaritimeActivityDate)
                .address(AddressState.builder().line1("line1").city("city").country("country").postcode("postcode").build())
                .reportingStatusList(List.of(reportingStatusEntry2, reportingStatusEntry1)) // Ensure history list is populated
                .build();

        MrtmAccountViewDTO expected = MrtmAccountViewDTO.builder()
                .id(accountId)
                .name(accountName)
                .imoNumber(imoNumber)
                .businessId("businessId")
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .firstMaritimeActivityDate(firstMaritimeActivityDate)
                .status(MrtmAccountStatus.NEW)
                .address(AddressStateDTO.builder().line1("line1").city("city").country("country").postcode("postcode").build())
                .build();

        final MrtmAccountViewDTO actual = mrtmAccountMapper.toMrtmAccountViewDTO(mrtmAccount);

        assertEquals(expected, actual);
    }

    @Test
    void toMrtmAccountViewDTO() {

        Long accountId = 10L;
        String accountName = "accountName";
        String imoNumber = "0000000";
        LocalDate firstMaritimeActivityDate = LocalDate.of(2022, 12, 11);
        MrtmEmissionTradingScheme emissionTradingScheme = MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME;

        AccountReportingStatus reportingStatusEntry1 = AccountReportingStatus.builder()
                .status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT)
                .year(Year.now())
                .build();

        AccountReportingStatus reportingStatusEntry2 = AccountReportingStatus.builder()
                .status(MrtmAccountReportingStatus.EXEMPT)
                .reason("reason for exempt")
                .year(Year.now())
                .build();

        MrtmAccount mrtmAccount = MrtmAccount.builder()
                .id(accountId)
                .name(accountName)
                .emissionTradingScheme(emissionTradingScheme)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .imoNumber(imoNumber)
                .status(MrtmAccountStatus.NEW)
                .businessId("businessId")
                .firstMaritimeActivityDate(firstMaritimeActivityDate)
                .address(AddressState.builder().line1("line1").city("city").country("country").postcode("postcode").build())
                .reportingStatusList(List.of(reportingStatusEntry2, reportingStatusEntry1))
                .build();

        MrtmAccountViewDTO expected = MrtmAccountViewDTO.builder()
                .id(accountId)
                .name(accountName)
                .imoNumber(imoNumber)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .businessId("businessId")
                .firstMaritimeActivityDate(firstMaritimeActivityDate)
                .status(MrtmAccountStatus.NEW)
                .address(AddressStateDTO.builder().line1("line1").city("city").country("country").postcode("postcode").build())
                .build();

        final MrtmAccountViewDTO actual = mrtmAccountMapper.toMrtmAccountViewDTO(mrtmAccount);

        assertEquals(expected, actual);
    }

    @Test
    void toAccountViewDTOIgnoreReportingStatusReason() {
        Long accountId = 10L;
        String accountName = "accountName";
        MrtmEmissionTradingScheme emissionTradingScheme = MrtmEmissionTradingScheme.UK_MARITIME_EMISSION_TRADING_SCHEME;
        String imoNumber = "crcoCode";
        LocalDate commencementDate = LocalDate.of(2022, 12, 11);

        MrtmAccount mrtmAccount = MrtmAccount.builder()
                .id(accountId)
                .name(accountName)
                .emissionTradingScheme(emissionTradingScheme)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .businessId("businessId")
                .imoNumber(imoNumber)
                .firstMaritimeActivityDate(commencementDate)
                .status(MrtmAccountStatus.NEW)
                .address(AddressState.builder().line1("line1").city("city").country("country").postcode("postcode").build())
                .build();

        MrtmAccountViewDTO expected = MrtmAccountViewDTO.builder()
                .id(accountId)
                .name(accountName)
                .imoNumber(imoNumber)
                .competentAuthority(CompetentAuthorityEnum.ENGLAND)
                .businessId("businessId")
                .firstMaritimeActivityDate(commencementDate)
                .status(MrtmAccountStatus.NEW)
                .address(AddressStateDTO.builder().line1("line1").city("city").country("country").postcode("postcode").build())
                .build();

        final MrtmAccountViewDTO actual = mrtmAccountMapper.toMrtmAccountViewDTO(mrtmAccount);

        assertEquals(expected, actual);
    }
}
