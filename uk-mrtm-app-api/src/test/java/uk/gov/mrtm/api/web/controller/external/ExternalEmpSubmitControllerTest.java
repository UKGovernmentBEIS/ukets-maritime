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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureFormWithFiles;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpMonitoringReportingRole;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.datagaps.ExternalEmpDataGaps;
import uk.gov.mrtm.api.integration.external.emp.domain.delegatedresponsibility.ExternalEmpDelegatedResponsibility;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpControlActivitiesProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpEmissionFactorsProcedure;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpEmissionsProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpFuelConsumptionProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpManagementProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpOutsourcedActivitiesProcedure;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpProcedureForm;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpProcedures;
import uk.gov.mrtm.api.integration.external.emp.domain.procedures.ExternalEmpReductionClaimProcedure;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpCarbonCapture;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpEmissionsSources;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpExemptionConditions;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelOriginTypeName;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpFuelsAndEmissionsFactors;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpMeasurementDescription;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpShipDetails;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpShipEmissions;
import uk.gov.mrtm.api.integration.external.emp.domain.shipemissions.ExternalEmpUncertaintyLevel;
import uk.gov.mrtm.api.integration.external.emp.enums.ExternalFuelType;
import uk.gov.mrtm.api.integration.external.emp.service.ExternalEmpSubmitService;
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
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod.BDN;

@ExtendWith(MockitoExtension.class)
class ExternalEmpSubmitControllerTest {

    private static final String CONTROLLER_PATH = "/external/v1.0/accounts";
    private static final String IMO_NUMBER = "0000000";

    @InjectMocks
    private ExternalEmpSubmitController controller;

    @Mock
    private ExternalEmpSubmitService externalEmpSubmitService;

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
        controller = (ExternalEmpSubmitController) aopProxy.getProxy();
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
    void submitEmissionsMonitoringPlanData() throws Exception {
        AppUser appUser = AppUser.builder()
            .userId("authUserId")
            .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.SCOTLAND).build()))
            .build();
        ExternalEmissionsMonitoringPlan emissionsMonitoringPlan =  createExternalEmissionsMonitoringPlan();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/emp")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(emissionsMonitoringPlan)))
            .andExpect(status().isNoContent());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(externalEmpSubmitService).submitEmissionsMonitoringPlanData(emissionsMonitoringPlan, IMO_NUMBER, appUser);
    }

    @Test
    void submitEmissionsMonitoringPlanData_missingNestedField_returnsForm1001WithIndexedPath() throws Exception {
        ExternalEmissionsMonitoringPlan plan = createExternalEmissionsMonitoringPlan();
        plan.getShipParticulars().iterator().next().getShipDetails().setCompanyNature(null);

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/emp")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(plan)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("FORM1001"))
            .andExpect(jsonPath("$.data[?(@.fieldName == 'shipParticulars[0].shipDetails.companyNature')]").exists());
    }

    @Test
    void submitEmissionsMonitoringPlanData_invalidEnumInNestedList_returnsForm1001WithIndexedPath() throws Exception {
        ObjectNode payloadNode = objectMapper.valueToTree(createExternalEmissionsMonitoringPlan());
        ObjectNode fuelNode = (ObjectNode) ((ArrayNode) payloadNode.get("shipParticulars")).get(0)
            .get("fuelTypes").get(0);
        fuelNode.put("methodDensityBunkerCode", "INVALID_BUNKER_CODE");

        mockMvc.perform(
                MockMvcRequestBuilders.put(CONTROLLER_PATH + "/" + IMO_NUMBER + "/emp")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(payloadNode)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("FORM1001"))
            .andExpect(jsonPath("$.data[0].fieldName")
                .value("shipParticulars[0].fuelTypes[0].methodDensityBunkerCode"))
            .andExpect(jsonPath("$.data[0].message")
                .value(org.hamcrest.Matchers.containsString("INVALID_BUNKER_CODE")));
    }

    private ExternalEmissionsMonitoringPlan createExternalEmissionsMonitoringPlan() {
        return ExternalEmissionsMonitoringPlan.builder()
            .shipParticulars(Set.of(createExternalEmpShipEmissions()))
            .delegatedResponsibility(createExternalEmpDelegatedResponsibility())
            .procedures(createExternalEmpProcedures())
            .dataGaps(createExternalEmpDataGaps())
            .build();
    }

    private ExternalEmpDataGaps createExternalEmpDataGaps() {
        return ExternalEmpDataGaps.builder()
            .formulaeUsed("formulaeUsed")
            .fuelConsumptionEstimationMethod("fuelConsumptionEstimationMethod")
            .responsiblePerson("responsiblePerson")
            .dataSources("dataSources")
            .locationOfRecords("locationOfRecords")
            .itSystem("itSystem")
            .build();
    }

    private ExternalEmpProcedures createExternalEmpProcedures() {
        return ExternalEmpProcedures.builder()
            .emissionsProcedures(ExternalEmpEmissionsProcedures.builder()
                .emissionSourcesProcedure(createExternalEmpProcedureForm("emissionSourcesProcedure"))
                .emissionFactorsProcedure(ExternalEmpEmissionFactorsProcedure.builder()
                    .defaultFactorsUsed(true)
                    .build())
                .reductionClaimProcedure(ExternalEmpReductionClaimProcedure.builder()
                    .emissionsReductionClaimExists(false)
                    .build())
                .build())
            .fuelConsumptionProcedures(ExternalEmpFuelConsumptionProcedures.builder()
                .fuelBunkeredAndInTanksProcedure(createExternalEmpProcedureForm("fuelBunkeredAndInTanksProcedure"))
                .bunkeringCrossChecksProcedure(createExternalEmpProcedureForm("bunkeringCrossChecksProcedure"))
                .informationManagementProcedure(createExternalEmpProcedureForm("informationManagementProcedure"))
                .equipmentQualityAssuranceProcedure(createExternalEmpProcedureForm("equipmentQualityAssuranceProcedure"))
                .voyagesCompletenessProcedure(createExternalEmpProcedureForm("voyagesCompletenessProcedure"))
                .build())
            .managementProcedures(ExternalEmpManagementProcedures.builder()
                .monitoringReportingRoles(List.of(EmpMonitoringReportingRole.builder()
                    .jobTitle("jobTitle")
                    .mainDuties("mainDuties")
                    .build()))
                .adequacyCheckProcedure(createExternalEmpProcedureForm("adequacyCheckProcedure"))
                .dataFlowActivitiesProcedure(createExternalEmpProcedureForm("dataFlowActivitiesProcedure"))
                .riskAssessmentProcedure(createExternalEmpProcedureForm("riskAssessmentProcedure"))
                .build())
            .controlActivitiesProcedures(ExternalEmpControlActivitiesProcedures.builder()
                .qaItProcedure(createExternalEmpProcedureForm("qaItProcedure"))
                .dataReviewProcedure(createExternalEmpProcedureForm("dataReviewProcedure"))
                .correctionsProcedure(createExternalEmpProcedureForm("correctionsProcedure"))
                .outsourcedActivitiesProcedure(ExternalEmpOutsourcedActivitiesProcedure.builder()
                    .outsourcedActivitiesExists(false)
                    .build())
                .documentationProcedure(createExternalEmpProcedureForm("documentationProcedure"))
                .build())
            .build();
    }

    private ExternalEmpDelegatedResponsibility createExternalEmpDelegatedResponsibility() {
        return ExternalEmpDelegatedResponsibility.builder()
            .delegatedResponsibilityUsed(false)
            .registeredOwners(new HashSet<>())
            .build();
    }

    private ExternalEmpShipEmissions createExternalEmpShipEmissions() {
        Set<ExternalEmpFuelsAndEmissionsFactors> fuelTypes = new LinkedHashSet<>();
        fuelTypes.add(createExternalEmpFuelsAndEmissionsFactors());


        return ExternalEmpShipEmissions.builder()
            .shipDetails(ExternalEmpShipDetails.builder()
                .shipImoNumber("9876543")
                .name("ship details name")
                .shipType(ShipType.BULK)
                .grossTonnage(5000)
                .flag(FlagState.GR)
                .iceClassPolarCode(IceClass.IC)
                .companyNature(ReportingResponsibilityNature.ISM_COMPANY)
                .build())
            .fuelTypes(fuelTypes)
            .emissionsSources(Set.of(
                ExternalEmpEmissionsSources.builder()
                    .name("emissions sources name")
                    .emissionSourceTypeCode(EmissionSourceType.AUX_ENGINE)
                    .emissionSourceClassCode(EmissionSourceClass.BOILERS)
                    .fuelTypeCodes(Set.of(
                        createExternalEmpFuelOriginTypeName()
                    ))
                    .monitoringMethods(Set.of(MonitoringMethod.BDN))
                    .identificationNumber("identificationNumber")
                    .build()
            ))
            .uncertaintyLevel(Set.of(ExternalEmpUncertaintyLevel.builder()
                .monitoringMethodCode(BDN)
                .levelOfUncertaintyTypeCode(MethodApproach.DEFAULT)
                .shipSpecificUncertainty(BigDecimal.valueOf(7.5))
                .build()))
            .ccsCcu(ExternalEmpCarbonCapture.builder()
                .captureAndStorageApplied(false)
                .build())
            .measuringEquipment(Set.of(
                ExternalEmpMeasurementDescription.builder()
                    .name("measuring equipment name")
                    .technicalDescription("technical description")
                    .emissionSourceName(Set.of("measuring equipment emission source name"))
                    .build()
            ))
            .conditionsOfExemption(ExternalEmpExemptionConditions.builder()
                .derogationCodeUsed(false)
                .build())
            .build();
    }

    private ExternalEmpFuelOriginTypeName createExternalEmpFuelOriginTypeName() {
        return ExternalEmpFuelOriginTypeName.builder()
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .fuelTypeCode(ExternalFuelType.METHANOL)
            .otherFuelType(null)
            .build();
    }

    private ExternalEmpFuelsAndEmissionsFactors createExternalEmpFuelsAndEmissionsFactors() {
        return ExternalEmpFuelsAndEmissionsFactors.builder()
            .fuelOriginCode(FuelOrigin.FOSSIL)
            .fuelTypeCode(ExternalFuelType.METHANOL)
            .ttwEFCarbonDioxide(new BigDecimal("1.375"))
            .ttwEFMethane(new BigDecimal("2"))
            .ttwEFNitrousOxide(new BigDecimal("3"))
            .methodDensityBunkerCode(DensityMethodBunker.LABORATORY_TEST)
            .methodDensityTankCode(DensityMethodTank.FUEL_SUPPLIER)
            .build();
    }

    private ExternalEmpProcedureForm createExternalEmpProcedureForm(String source) {
        return ExternalEmpProcedureForm.builder()
            .referenceExistingProcedure(source + "referenceExistingProcedure")
            .versionExistingProcedure(source + "versionExistingProcedure")
            .description(source + "description")
            .responsiblePerson(source + "responsiblePerson")
            .locationOfRecords(source + "locationOfRecords")
            .itSystem(source + "itSystem")
            .build();
    }
}