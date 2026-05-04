package uk.gov.mrtm.api.web.controller.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerComplianceMonitoringReporting;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerDataGapsMethodologies;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerEmissionsReductionClaimVerification;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerEtsComplianceRules;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerInformationOfOpinionRelevance;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerOpinionStatement;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerRecommendedImprovements;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerSiteVisit;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerUncorrectedMisstatements;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerUncorrectedNonCompliances;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerUncorrectedNonConformities;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerVerification;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerVerificationDecision;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerVerificationTeamDetails;
import uk.gov.mrtm.api.integration.external.verification.domain.ExternalAerVerifierContact;
import uk.gov.mrtm.api.integration.external.verification.service.ExternalAerVerificationService;
import uk.gov.mrtm.api.reporting.domain.verification.AerAccreditationReferenceDocumentType;
import uk.gov.mrtm.api.reporting.domain.verification.AerSiteVisitType;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecisionType;
import uk.gov.mrtm.api.reporting.domain.verification.NonConformities;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.security.AuthorizedRoleAspect;

import java.time.Year;
import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ExternalAerVerificationControllerTest {

    private static final String CONTROLLER_PATH = "/external/v1.0/accounts";
    private static final String IMO_NUMBER = "0000000";
    private static final Year YEAR = Year.now();

    @InjectMocks
    private ExternalAerVerificationController controller;

    @Mock
    private ExternalAerVerificationService externalAerVerificationService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);
        aspectJProxyFactory.addAspect(authorizedRoleAspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        controller = (ExternalAerVerificationController) aopProxy.getProxy();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void submitAerVerificationData() throws Exception {
        AppUser appUser = AppUser.builder()
            .userId("authUserId")
            .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.SCOTLAND).build()))
            .build();
        ExternalAerVerification aerVerificationData = createAerVerification();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/aer/" + YEAR + "/verification")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(aerVerificationData)))
            .andExpect(status().isNoContent());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(externalAerVerificationService).submitAerVerificationData(aerVerificationData, IMO_NUMBER, YEAR, appUser);
    }

    private ExternalAerVerification createAerVerification() {

        return ExternalAerVerification.builder()
            .verifierContact(ExternalAerVerifierContact.builder()
                .email("a@a.a")
                .name("name")
                .phoneNumber("phoneNumber")
                .build()
            )
            .verificationTeamDetails(ExternalAerVerificationTeamDetails.builder()
                .leadEtsAuditor("leadEtsAuditor")
                .etsAuditors("etsAuditors")
                .etsTechnicalExperts("etsTechnicalExperts")
                .independentReviewer("independentReviewer")
                .technicalExperts("technicalExperts")
                .authorisedSignatoryName("authorisedSignatoryName")
                .build())
            .opinionStatement(ExternalAerOpinionStatement.builder()
                .emissionsCorrect(true)
                .additionalChangesNotCovered(false)
                .siteVisit(ExternalAerSiteVisit.builder()
                    .type(AerSiteVisitType.VIRTUAL)
                    .inPersonVisitReason("inPersonVisitReason")
                    .build())
                .build())
            .uncorrectedNonCompliances(ExternalAerUncorrectedNonCompliances.builder()
                .exist(false)
                .build())
            .uncorrectedMisstatements(ExternalAerUncorrectedMisstatements.builder()
                .exist(false)
                .build()
            )
            .overallDecision(ExternalAerVerificationDecision
                .builder()
                .type(AerVerificationDecisionType.VERIFIED_AS_SATISFACTORY)
                .build())
            .uncorrectedNonConformities(ExternalAerUncorrectedNonConformities.builder()
                .exist(false)
                .existPriorYearIssues(false)
                .build())
            .recommendedImprovements(ExternalAerRecommendedImprovements.builder()
                .exist(false)
                .build())
            .emissionsReductionClaimVerification(ExternalAerEmissionsReductionClaimVerification.builder()
                .smfBatchClaimsReviewed(true)
                .reviewResults("reviewResults")
                .noDoubleCountingConfirmation("noDoubleCountingConfirmation")
                .evidenceAllCriteriaMetExist(true)
                .complianceWithEmpRequirementsExist(true)
                .build())
            .informationOfOpinionRelevance(ExternalAerInformationOfOpinionRelevance.builder()
                .materialityDetails("materialityDetails")
                .accreditationReferenceDocumentTypes(Set.of(AerAccreditationReferenceDocumentType.SI_2020_1265))
                .build())
            .etsComplianceRules(ExternalAerEtsComplianceRules.builder()
                .monitoringPlanRequirementsMet(true)
                .etsOrderRequirementsMet(true)
                .detailSourceDataVerified(true)
                .partOfSiteVerification("partOfSiteVerification")
                .controlActivitiesDocumented(true)
                .proceduresMonitoringPlanDocumented(true)
                .dataVerificationCompleted(true)
                .monitoringApproachAppliedCorrectly(true)
                .methodsApplyingMissingDataUsed(true)
                .competentAuthorityGuidanceMet(true)
                .nonConformities(NonConformities.YES)
                .build())
            .complianceMonitoringReporting(ExternalAerComplianceMonitoringReporting.builder()
                .accuracyCompliant(true)
                .completenessCompliant(true)
                .consistencyCompliant(true)
                .comparabilityCompliant(true)
                .transparencyCompliant(true)
                .integrityCompliant(true)
                .build())
            .dataGapsMethodologies(ExternalAerDataGapsMethodologies.builder()
                .methodRequired(false)
                .build())
            .build();
    }
}