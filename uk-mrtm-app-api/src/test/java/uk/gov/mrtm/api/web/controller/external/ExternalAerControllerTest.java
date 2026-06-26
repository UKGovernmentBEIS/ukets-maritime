package uk.gov.mrtm.api.web.controller.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.mrtm.api.integration.external.aer.domain.ExternalAer;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataAnnualEmission;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataEmissions;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataEmissionsMeasurements;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataFuelConsumption;
import uk.gov.mrtm.api.integration.external.aer.domain.aggregateddata.ExternalAerAggregatedDataShipEmissions;
import uk.gov.mrtm.api.integration.external.aer.domain.reductionclaim.ExternalAerReductionClaim;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerDerogations;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerEmissionsSources;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerShipDetails;
import uk.gov.mrtm.api.integration.external.aer.domain.shipemissions.ExternalAerShipEmissions;
import uk.gov.mrtm.api.integration.external.aer.service.ExternalAerService;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelOriginTypeName;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpUncertaintyLevel;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.mrtm.api.web.controller.exception.ExternalIntegrationExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.security.AuthorizedRoleAspect;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod.BDN;

@ExtendWith(MockitoExtension.class)
class ExternalAerControllerTest {

    private static final String CONTROLLER_PATH = "/external/v1.0/accounts";
    private static final String IMO_NUMBER = "0000000";
    private static final Year YEAR = Year.now();

    @InjectMocks
    private ExternalAerController controller;

    @Mock
    private ExternalAerService externalAerService;

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
        controller = (ExternalAerController) aopProxy.getProxy();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:validatorMessages");
        messageSource.setDefaultEncoding("UTF-8");

        LocalValidatorFactoryBean validatorFactoryBean = new LocalValidatorFactoryBean();
        validatorFactoryBean.setValidationMessageSource(messageSource);
        validatorFactoryBean.afterPropertiesSet();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setValidator(validatorFactoryBean)
            .setControllerAdvice(
                new ExternalIntegrationExceptionControllerAdvice(),
                new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void submitAerData() throws Exception {
        AppUser appUser = AppUser.builder()
            .userId("authUserId")
            .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.SCOTLAND).build()))
            .build();
        ExternalAer emissionsMonitoringPlan = createAer();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/aer/" + YEAR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(emissionsMonitoringPlan)))
            .andExpect(status().isNoContent());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(externalAerService).submitAerData(emissionsMonitoringPlan, IMO_NUMBER, YEAR, appUser);
    }

    @Test
    void submitAerData_invalidShipTypeEnum_returnsForm1001WithIndexedPath() throws Exception {
        ObjectNode payloadNode = objectMapper.valueToTree(createAer());
        ((ObjectNode) ((ArrayNode) payloadNode.get("shipParticulars")).get(0).get("shipDetails"))
            .put("shipType", "INVALID_SHIP_TYPE");

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/aer/" + YEAR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(payloadNode)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("FORM1001"))
            .andExpect(jsonPath("$.data[0].fieldName")
                .value("shipParticulars[0].shipDetails.shipType"))
            .andExpect(jsonPath("$.data[0].message", containsString("INVALID_SHIP_TYPE")))
            .andExpect(jsonPath("$.data[0].message", containsString("Accepted values")));
    }

    @Test
    void submitAerData_allYearTrueWithFromTo_returnsForm1001WithIndexedPath() throws Exception {
        ExternalAer aer = createAer();
        aer.setShipParticulars(new LinkedHashSet<>(List.of(
            createExternalAerShipEmissions("9362267", false, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 8, 31)),
            createExternalAerShipEmissions("8812629", true, LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31))
        )));

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/aer/" + YEAR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(aer)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("FORM1001"))
            .andExpect(jsonPath("$.data[?(@.fieldName == 'shipParticulars[1].shipDetails')]").exists())
            .andExpect(jsonPath("$.data[*].message", hasItem(containsString("All year and from to dates are not mutually valid"))));
    }

    @Test
    void submitAerData_malformedJson_returnsInvalidRequestFormat() throws Exception {
        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/aer/" + YEAR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("INVALID_REQUEST_FORMAT"))
            .andExpect(jsonPath("$.data[0].fieldName").value("requestBody"))
            .andExpect(jsonPath("$.data[0].message").value("Invalid request body value"));
    }

    @Test
    void submitAerData_invalidDateFormat_returnsForm1001WithIndexedPath() throws Exception {
        ObjectNode payloadNode = objectMapper.valueToTree(createAer());
        ((ObjectNode) ((ArrayNode) payloadNode.get("shipParticulars")).get(0).get("shipDetails"))
            .put("from", "31/01/2026");

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/aer/" + YEAR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(payloadNode)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("FORM1001"))
            .andExpect(jsonPath("$.data[0].fieldName")
                .value("shipParticulars[0].shipDetails.from"))
            .andExpect(jsonPath("$.data[0].message")
                .value("from must be a valid date in format yyyy-MM-dd"));
    }

    private ExternalAer createAer() {
        ExternalAerAggregatedDataEmissionsMeasurements emissions = ExternalAerAggregatedDataEmissionsMeasurements.builder()
            .tch4eqTotal(new BigDecimal("1"))
            .tco2Total(new BigDecimal("2"))
            .tn2oeqTotal(new BigDecimal("3"))
            .build();

        return ExternalAer.builder()
            .shipParticulars(Set.of(createExternalAerShipEmissions()))
            .reductionClaim(ExternalAerReductionClaim.builder().reductionClaimApplied(false).build())
            .emissions(ExternalAerAggregatedDataEmissions.builder()
                .shipEmissions(Set.of(
                    ExternalAerAggregatedDataShipEmissions.builder()
                        .shipImoNumber("1234567")
                        .annualEmission(ExternalAerAggregatedDataAnnualEmission.builder()
                            .emissions(Set.of(ExternalAerAggregatedDataFuelConsumption.builder()
                                .amount(new BigDecimal("1"))
                                .fuelOriginCode(FuelOrigin.FOSSIL)
                                .fuelTypeCode(ExternalFuelType.METHANOL)
                                .build()))
                            .etsEmissionsBetweenUkAndNiPort(emissions)
                            .etsEmissionsWithinUkPort(emissions)
                            .etsEmissionsBetweenUkPort(emissions)
                            .build())
                        .build()))
                .build())
            .build();
    }

    private ExternalAerShipEmissions createExternalAerShipEmissions() {
        return createExternalAerShipEmissions("9876543", true, null, null);
    }

    private ExternalAerShipEmissions createExternalAerShipEmissions(
        String shipImoNumber, boolean allYear, LocalDate from, LocalDate to) {
        Set<ExternalAerFuelsAndEmissionsFactors> fuelTypes = new LinkedHashSet<>();
        fuelTypes.add(createExternalAerFuelsAndEmissionsFactors());

        return ExternalAerShipEmissions.builder()
            .shipDetails(ExternalAerShipDetails.builder()
                .shipImoNumber(shipImoNumber)
                .allYear(allYear)
                .from(from)
                .to(to)
                .name("ship details name")
                .shipType(ShipType.BULK)
                .grossTonnage(5000)
                .flag(FlagState.GR)
                .iceClassPolarCode(IceClass.IC)
                .companyNature(ReportingResponsibilityNature.ISM_COMPANY)
                .build())
            .fuelTypes(fuelTypes)
            .derogations(ExternalAerDerogations.builder().exceptionFromPerVoyageMonitoring(true).build())
            .emissionsSources(Set.of(
                ExternalAerEmissionsSources.builder()
                    .name("emissions sources name")
                    .emissionSourceTypeCode(EmissionSourceType.AUX_ENGINE)
                    .emissionSourceClassCode(EmissionSourceClass.BOILERS)
                    .fuelTypeCodes(Set.of(
                        createExternalAerFuelOriginTypeName()
                    ))
                    .monitoringMethods(Set.of(BDN))
                    .build()
            ))
            .uncertaintyLevel(Set.of(ExternalEmpUncertaintyLevel.builder()
                .monitoringMethodCode(BDN)
                .levelOfUncertaintyTypeCode(MethodApproach.DEFAULT)
                .shipSpecificUncertainty(BigDecimal.valueOf(7.5))
                .build()))
            .build();
    }

    private ExternalEmpFuelOriginTypeName createExternalAerFuelOriginTypeName() {
        return ExternalEmpFuelOriginTypeName.builder()
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .fuelTypeCode(ExternalFuelType.METHANOL)
            .otherFuelType(null)
            .build();
    }

    private ExternalAerFuelsAndEmissionsFactors createExternalAerFuelsAndEmissionsFactors() {
        return ExternalAerFuelsAndEmissionsFactors.builder()
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .fuelTypeCode(ExternalFuelType.METHANOL)
            .ttwEFCarbonDioxide(new BigDecimal("1.375"))
            .ttwEFMethane(new BigDecimal("2"))
            .ttwEFNitrousOxide(new BigDecimal("3"))
            .build();
    }
}