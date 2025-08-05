package uk.gov.mrtm.api.integration.registry.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum RegistryCompetentAuthorityEnum {
    EA(CompetentAuthorityEnum.ENGLAND),
    SEPA(CompetentAuthorityEnum.SCOTLAND),
    NRW(CompetentAuthorityEnum.WALES),
    DAERA(CompetentAuthorityEnum.NORTHERN_IRELAND),
    OPRED(CompetentAuthorityEnum.OPRED);

    private final CompetentAuthorityEnum competentAuthorityEnum;

    public static RegistryCompetentAuthorityEnum getCompetentAuthorityEnum(String registryCompetentAuthorityEnum) {
        return Arrays.stream(RegistryCompetentAuthorityEnum.values())
            .filter(ca -> ca.name().equals(registryCompetentAuthorityEnum))
            .findFirst()
            .orElse(null);
    }

    public static RegistryCompetentAuthorityEnum getCompetentAuthorityEnum(CompetentAuthorityEnum competentAuthorityEnum) {
        return Arrays.stream(RegistryCompetentAuthorityEnum.values())
            .filter(ca -> ca.getCompetentAuthorityEnum().equals(competentAuthorityEnum))
            .findFirst()
            .orElse(null);
    }
}
