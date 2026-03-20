package uk.gov.mrtm.api.integration.external.verification.transform;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerRecommendedImprovements;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerSiteVisit;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerUncorrectedMisstatements;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerUncorrectedNonCompliances;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerUncorrectedNonConformities;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerVerification;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerVerificationDecision;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerification;
import uk.gov.mrtm.api.reporting.domain.common.AerVerificationReferencePrefix;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.mrtm.api.reporting.domain.verification.AerInPersonSiteVisit;
import uk.gov.mrtm.api.reporting.domain.verification.AerNotVerifiedDecision;
import uk.gov.mrtm.api.reporting.domain.verification.AerRecommendedImprovements;
import uk.gov.mrtm.api.reporting.domain.verification.AerSiteVisit;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedMisstatements;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonCompliances;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonConformities;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecision;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifiedSatisfactoryDecision;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerifiedSatisfactoryWithCommentsDecision;
import uk.gov.mrtm.api.reporting.domain.verification.AerVirtualSiteVisit;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface ExternalAerVerificationMapper {

    @Mapping(target = "opinionStatement.siteVisit", source = "external.opinionStatement.siteVisit", qualifiedByName = "mapSiteVisit")
    @Mapping(target = "overallDecision", source = "external.overallDecision", qualifiedByName = "mapOverallDecision")
    @Mapping(target = "materialityLevel", source = "external.informationOfOpinionRelevance")
    @Mapping(target = "payloadType", source = "payloadType")
    StagingAerVerification toStagingAerVerification(ExternalAerVerification external, String payloadType);

    @Mapping(target = "visitDates", source = "siteVisitDetails")
    AerInPersonSiteVisit toAerInPersonSiteVisit(ExternalAerSiteVisit external);

    @Mapping(target = "reason", source = "inPersonVisitReason")
    AerVirtualSiteVisit toAerVirtualSiteVisit(ExternalAerSiteVisit external);

    @Named("mapSiteVisit")
    default AerSiteVisit map(ExternalAerSiteVisit external) {
        return switch (external.getType()) {
            case IN_PERSON -> toAerInPersonSiteVisit(external);
            case VIRTUAL -> toAerVirtualSiteVisit(external);
        };
    }

    AerVerifiedSatisfactoryDecision toAerVerifiedSatisfactoryDecision(ExternalAerVerificationDecision external);

    @Mapping(target = "reasons", source = "comments")
    AerVerifiedSatisfactoryWithCommentsDecision toAerVerifiedSatisfactoryWithCommentsDecision(ExternalAerVerificationDecision external);

    AerNotVerifiedDecision toAerNotVerifiedDecision(ExternalAerVerificationDecision external);

    @Named("mapOverallDecision")
    default AerVerificationDecision map(ExternalAerVerificationDecision external) {
        return switch (external.getType()) {
            case VERIFIED_AS_SATISFACTORY -> toAerVerifiedSatisfactoryDecision(external);
            case VERIFIED_AS_SATISFACTORY_WITH_COMMENTS -> toAerVerifiedSatisfactoryWithCommentsDecision(external);
            case NOT_VERIFIED -> toAerNotVerifiedDecision(external);
        };
    }

    @AfterMapping
    default void setAerUncorrectedMisstatementsReference(@MappingTarget AerUncorrectedMisstatements target,
                                                         ExternalAerUncorrectedMisstatements source) {

        if (source.getExist()) {
            int i = 1;
            for (UncorrectedItem uncorrectedItem : target.getUncorrectedMisstatements()) {
                uncorrectedItem.setReference(AerVerificationReferencePrefix.UNCORRECTED_MISSTATEMENTS.getPrefix() + i++);
            }
        }
    }

    @AfterMapping
    default void setAerUncorrectedNonConformities(@MappingTarget AerUncorrectedNonConformities target,
                                                  ExternalAerUncorrectedNonConformities source) {

        if (source.getExist()) {
            int i = 1;
            for (UncorrectedItem uncorrectedItem : target.getUncorrectedNonConformities()) {
                uncorrectedItem.setReference(AerVerificationReferencePrefix.UNCORRECTED_NON_CONFORMITIES.getPrefix() + i++);
            }
        }

        if (source.getExistPriorYearIssues()) {
            int j = 1;
            for (VerifierComment verifierComment : target.getPriorYearIssues()) {
                verifierComment.setReference(AerVerificationReferencePrefix.PRIOR_YEAR_ISSUES.getPrefix() + j++);
            }
        }
    }

    @AfterMapping
    default void setAerUncorrectedNonCompliances(@MappingTarget AerUncorrectedNonCompliances target,
                                                 ExternalAerUncorrectedNonCompliances source) {

        if (source.getExist()) {
            int i = 1;
            for (UncorrectedItem uncorrectedItem : target.getUncorrectedNonCompliances()) {
                uncorrectedItem.setReference(AerVerificationReferencePrefix.UNCORRECTED_NON_COMPLIANCES.getPrefix() + i++);
            }
        }
    }

    @AfterMapping
    default void setAerRecommendedImprovements(@MappingTarget AerRecommendedImprovements target,
                                               ExternalAerRecommendedImprovements source) {

        if (source.getExist()) {
            int i = 1;
            for (VerifierComment verifierComment : target.getRecommendedImprovements()) {
                verifierComment.setReference(AerVerificationReferencePrefix.RECOMMENDED_IMPROVEMENTS.getPrefix() + i++);
            }
        }
    }

}
