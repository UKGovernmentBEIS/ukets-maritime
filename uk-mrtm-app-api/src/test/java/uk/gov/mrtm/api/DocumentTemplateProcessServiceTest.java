//package uk.gov.mrtm.api;
//
//import fr.opensagres.xdocreport.template.freemarker.FreemarkerTemplateEngine;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.ArgumentCaptor;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.mockito.junit.jupiter.MockitoExtension;
//import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureForm;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmpProcedureFormWithFiles;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviationDefinition;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpControlActivities;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.controlactivities.EmpOutsourcedActivities;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCapture;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpCarbonCaptureTechnologies;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpEmissions;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.EmpShipEmissions;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.ShipDetails;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.BioFuelType;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodBunker;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.DensityMethodTank;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EFuelType;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceClass;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.EmissionSourceType;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FlagState;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FossilFuelType;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.FuelOrigin;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.IceClass;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.MonitoringMethod;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ReportingResponsibilityNature;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants.ShipType;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.exemptionconditions.ExemptionConditions;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.EmpBioFuels;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.biofuel.FuelOriginBiofuelTypeName;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.EmpEFuels;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.efuel.FuelOriginEFuelTypeName;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.EmpFossilFuels;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.fuel.fossil.FuelOriginFossilTypeName;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.measurementdescription.MeasurementDescription;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.sources.EmpEmissionsSources;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.MethodApproach;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.uncertainty.UncertaintyLevel;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionCompliance;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionFactors;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissionsources.EmpEmissionSources;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpManagementProcedures;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpMonitoringReportingRole;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.monitoringreenhousegas.EmpMonitoringGreenhouseGas;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.DeclarationDocuments;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.LimitedCompanyOrganisation;
//import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
//import uk.gov.mrtm.api.workflow.request.flow.common.domain.MrtmAccountTemplateParams;
//import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
//import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
//import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
//import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
//import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
//import uk.gov.netz.api.competentauthority.CompetentAuthorityDTO;
//import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
//import uk.gov.netz.api.competentauthority.CompetentAuthorityService;
//import uk.gov.netz.api.documenttemplate.config.TemplatesConfiguration;
//import uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateFileInfoDTO;
//import uk.gov.netz.api.documenttemplate.domain.templateparams.CompetentAuthorityTemplateParams;
//import uk.gov.netz.api.documenttemplate.domain.templateparams.SignatoryTemplateParams;
//import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
//import uk.gov.netz.api.documenttemplate.domain.templateparams.WorkflowTemplateParams;
//import uk.gov.netz.api.documenttemplate.service.DocumentGeneratorRemoteClientService;
//import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateService;
//import uk.gov.netz.api.files.common.domain.dto.FileDTO;
//import uk.gov.netz.api.files.common.utils.MimeTypeUtils;
//import uk.gov.netz.api.notification.template.CustomFreeMarkerConfiguration;
//
//import java.io.IOException;
//import java.math.BigDecimal;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.Year;
//import java.time.ZoneId;
//import java.util.Arrays;
//import java.util.Date;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.UUID;
//
//import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
//import static org.mockito.ArgumentMatchers.eq;
//import static org.mockito.Mockito.times;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.when;
//
//@ExtendWith(MockitoExtension.class)
//class DocumentTemplateProcessServiceTest {

// TODO convert to IT. Use for dev purposes for now

//
//    private static FreemarkerTemplateEngine freemarkerTemplateEngine;
//
//    @Mock
//    private DocumentGeneratorRemoteClientService documentGeneratorClientService;
//
//    @BeforeAll
//    public static void init() {
//        CustomFreeMarkerConfiguration customFreeMarkerConfiguration = new CustomFreeMarkerConfiguration();
//        freemarker.template.Configuration freemarkerConfig = customFreeMarkerConfiguration.freemarkerConfig();
//
//        TemplatesConfiguration templatesConfiguration = new TemplatesConfiguration();
//        freemarkerTemplateEngine = templatesConfiguration.freemarkerTemplateEngine(freemarkerConfig);
//    }
//
//
//    @Test
//    void generate_emp() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path empTemplateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK monitoring plan_template_maritime_v2.docx");
//        final FileDTO empTemplateFile = createFile(empTemplateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final EmissionsMonitoringPlanContainer empContainer = getEmissionsMonitoringPlanContainer();
//
//        final TemplateParams templateParams = buildTemplateParams(ca, signatoryUser, signatureFile, Map.of(
//                "empContainer", empContainer,
//                "variationRequestInfoList", List.of(
//                    EmpVariationRequestInfo.builder()
//                        .id("ABC-123")
//                        .submissionDate(LocalDateTime.now())
//                        .endDate(LocalDateTime.now().plusDays(1))
//                        .metadata(EmpVariationRequestMetadata
//                            .builder()
//                            .empConsolidationNumber(2)
//                            .summary("BBBB")
//                            .build()
//                        )
//                .build()),
//                "consolidationNumber", 24)
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(empTemplateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_emp_variation_op_led_approval_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK_Maritime_EMP Variation Approve Notice_V2.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "ccRecipients", List.of("cc recipient 1", "cc recipient 2"),
//                        "toRecipient", "to recipient",
//                        "empConsolidationNumber", 24,
//                        "variationScheduleItems", List.of("variation scheduled item 1",
//                                "variation scheduled item 2",
//                                "variation scheduled item 3")
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empApprovedOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_emp_variation_reg_led_approval_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK_Maritime_EMP_Variation_Regulator_Led.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                "ccRecipients", List.of("cc recipient 1", "cc recipient 2"),
//                "toRecipient", "to recipient",
//                "reason", "test reason",
//                "empConsolidationNumber", 24,
//                "variationScheduleItems", List.of("variation scheduled item 1",
//                    "variation scheduled item 2",
//                    "variation scheduled item 3")
//            )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//            .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empApprovedRegLedOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//
//    @Test
//    void generate_emp_variation_op_led_rejected_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK_Maritime_EMP Variation Refusal Notice_V2.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "ccRecipients", List.of("cc recipient 1", "cc recipient 2"),
//                        "toRecipient", "to recipient",
//                        "rejectionReason", "Rejection reason",
//                        "summary", "Summary"
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empRejectedOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_emp_variation_op_led_deemed_withdrawn_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK_Maritime_EMP Variation Withdrawn_Notice_V2.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "ccRecipients", List.of("cc recipient 1", "cc recipient 2")
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empDeemedWithdrawnOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_rde_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "Request for deadline extension.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//        Date extensionDate = Date.from(LocalDate.now().plusDays(10).atStartOfDay(ZoneId.systemDefault()).toInstant());
//        Date deadlineDate = Date.from(LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "ccRecipients", List.of("cc recipient 1", "cc recipient 2"),
//                        "toRecipient", "to recipient",
//                        "extensionDate", extensionDate,
//                        "deadline", deadlineDate
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
//       /* File outputFile = new File("rdeOfficialNoticeOutput.docx");
//        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
//            outputStream.write(postProcessedDocumentCaptor.getValue());
//        }*/
//    }
//
//    @Test
//    void generate_rfi_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "Request for further information.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//        Date extensionDate = Date.from(LocalDate.now().plusDays(10).atStartOfDay(ZoneId.systemDefault()).toInstant());
//        Date deadlineDate = Date.from(LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant());
//        List<String> questions = Arrays.asList("question1");
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "ccRecipients", List.of("cc recipient 1", "cc recipient 2"),
//                        "toRecipient", "to recipient",
//                        "extensionDate", extensionDate,
//                        "deadline", deadlineDate,
//                        "questions", questions
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
//       /* File outputFile = new File("rfiOfficialNoticeOutput.docx");
//        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
//            outputStream.write(postProcessedDocumentCaptor.getValue());
//        }*/
//    }
//
//
//    @Test
//    void generate_emp_approved_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK_Maritime_EMP Issuance Approve Notice.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                "ccRecipients", List.of("cc recipient 1", "cc recipient 2")
//            )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//            .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empApprovedOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_emp_deemed_withdrawn_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK_Maritime_EMP Issuance Withdrawn Notice.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                "ccRecipients", List.of("cc recipient 1", "cc recipient 2")
//            )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//            .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empDeemedWithdrawnOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_emp_notification_approved_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "EMP_Notification_template_accepted.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "ccRecipients", List.of("cc recipient 1", "cc recipient 2"),
//                        "officialNotice", "official notice"
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empAcceptedOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_emp_batch_variation_official_letter() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "UK_Maritime_EMP_Batch_Variation_Notice_V3.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "toRecipient", "to recipient",
//                        "empConsolidationNumber", 24,
//                        "summary", "summary"
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("empBatchVariationOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_doe() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "DoE_and_EFSN_Notice_Maritime_v2.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "totalEmissions", BigDecimal.TEN,
//                        "reportingYear", Year.of(2022),
//                        "determinationReasonDescription", String.format(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT.getDescription(), Year.of(2022)),
//                        "emissionsCalculationApproachDescription", "someCalculationApproach",
//                        "smallIslandFerryDeduction", BigDecimal.TEN,
//                        "surrenderEmissions", BigDecimal.TWO,
//                        "iceClassDeduction", BigDecimal.ONE
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("doeOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_doe_efsn() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "Maritime_EFSN_v2.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "totalEmissions", BigDecimal.TEN,
//                        "reportingYear", Year.of(2022),
//                        "determinationReasonDescription", String.format(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT.getDescription(), Year.of(2022)),
//                        "emissionsCalculationApproachDescription", "someCalculationApproach",
//                        "smallIslandFerryDeduction", BigDecimal.TEN,
//                        "surrenderEmissions", BigDecimal.TWO,
//                        "iceClassDeduction", BigDecimal.ONE
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("doeOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    @Test
//    void generate_vir() throws Exception {
//        String fileNameToGenerate = "fileNameToGenerate";
//        final CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
//        final String signatoryUser = "Signatory user full name";
//        final Path templateFilePath = Paths.get("src", "main", "resources", "templates", "ca", "england", "Maritime_Verifier_Improvement_Report_Response_v1.docx");
//        final FileDTO templateFile = createFile(templateFilePath);
//
//        final Path signatureFilePath = Paths.get("src", "test", "resources", "files", "signatures", "signature_valid.bmp");
//        final FileDTO signatureFile = createFile(signatureFilePath);
//
//        RegulatorImprovementResponse regulatorImprovementResponse = RegulatorImprovementResponse.builder()
//                .improvementRequired(true)
//                .improvementComments("someImprovementComments")
//                .improvementDeadline(LocalDate.of(2025, 3, 10))
//                .operatorActions("Some operator actions")
//                .build();
//
//        final TemplateParams templateParams = buildTemplateParamsForOfficialNotice(ca, signatoryUser, signatureFile, Map.of(
//                        "ccRecipients", List.of("cc recipient 1", "cc recipient 2"),
//                        "toRecipient", "to recipient",
//                "regulatorReviewResponse", RegulatorReviewResponse.builder()
//                        .regulatorImprovementResponses(Map.of("K1", regulatorImprovementResponse))
//                        .reportSummary("someReportSummary")
//                        .build()
//                )
//        );
//
//        byte[] resultExpected = "some bytes".getBytes();
//        when(documentGeneratorClientService.generateDocument(Mockito.any(byte[].class), Mockito.eq(fileNameToGenerate))).thenReturn(resultExpected);
//
//        assertDoesNotThrow(() -> new FileDocumentGenerateService(documentGeneratorClientService, freemarkerTemplateEngine)
//                .generateFileDocumentFromTemplate(getDocumentTemplateFileInfo(templateFile), templateParams, fileNameToGenerate));
//
//        ArgumentCaptor<byte[]> postProcessedDocumentCaptor = ArgumentCaptor.forClass(byte[].class);
//        verify(documentGeneratorClientService, times(1)).generateDocument(postProcessedDocumentCaptor.capture(), eq(fileNameToGenerate));
//
////        File outputFile = new File("virOfficialNoticeOutput.docx");
////        try (FileOutputStream outputStream = new FileOutputStream(outputFile)) {
////            outputStream.write(postProcessedDocumentCaptor.getValue());
////        }
//    }
//
//    private FileDTO createFile(Path sampleFilePath) throws IOException {
//        byte[] bytes = Files.readAllBytes(sampleFilePath);
//        return FileDTO.builder()
//                .fileContent(bytes)
//                .fileName(sampleFilePath.getFileName().toString())
//                .fileSize(sampleFilePath.toFile().length())
//                .fileType(MimeTypeUtils.detect(bytes, sampleFilePath.getFileName().toString()))
//                .build();
//    }
//
//    private TemplateParams buildTemplateParams(CompetentAuthorityEnum ca, String signatoryUser, FileDTO signatureFile,
//                                               Map<String, Object> params) {
//        CompetentAuthorityDTO caDto = CompetentAuthorityDTO.builder().id(ca).email("email").name("name").build();
//        return TemplateParams.builder()
//                .competentAuthorityParams(CompetentAuthorityTemplateParams.builder()
//                        .competentAuthority(caDto)
//                        .logo(CompetentAuthorityService.getCompetentAuthorityLogo(ca))
//                        .build())
//                .competentAuthorityCentralInfo("ca central info")
//                .signatoryParams(SignatoryTemplateParams.builder()
//                        .fullName(signatoryUser)
//                        .signature(signatureFile.getFileContent())
//                        .jobTitle("Project Manager")
//                        .build())
//                .accountParams(MrtmAccountTemplateParams.builder()
//                        .name("account name")
//                        .location("Account ethnikis  \nAccount street number 125 \nAccount postal code 15126")
//                        .primaryContact("primary contact")
//                        .primaryContactEmail("primary contact email")
//                        .serviceContact("service contact")
//                        .serviceContactEmail("service contact email")
//                        .build())
//                .permitId("UK-E-IN-12345")
//                .workflowParams(WorkflowTemplateParams.builder()
//                        .requestId("123")
//                        .requestType("PERMIT_VARIATION") //("PERMIT_ISSUANCE")
//                        .requestTypeInfo("your permit variation")
//                        .requestSubmissionDate(new Date())
//                        .requestEndDate(LocalDateTime.of(1998, 1, 1, 1, 1))
//                        .build())
//                .params(params)
//                .build();
//    }
//
//    private TemplateParams buildTemplateParamsForOfficialNotice(CompetentAuthorityEnum ca, String signatoryUser, FileDTO signatureFile,
//                                                                Map<String, Object> params) {
//        CompetentAuthorityDTO caDto = CompetentAuthorityDTO.builder().id(ca).email("email").name("name").build();
//        return TemplateParams.builder()
//                .competentAuthorityParams(CompetentAuthorityTemplateParams.builder()
//                        .competentAuthority(caDto)
//                        .logo(CompetentAuthorityService.getCompetentAuthorityLogo(ca))
//                        .build())
//                .competentAuthorityCentralInfo("ca central info")
//                .signatoryParams(SignatoryTemplateParams.builder()
//                        .fullName(signatoryUser)
//                        .signature(signatureFile.getFileContent())
//                        .jobTitle("Project Manager")
//                        .build())
//                .accountParams(MrtmAccountTemplateParams.builder()
//                        .name("account name")
//                        .primaryContact("primary contact")
//                        .primaryContactEmail("primary contact email")
//                        .serviceContact("service contact")
//                        .serviceContactEmail("service contact email")
//                        .serviceContactFirstName("FirstName")
//                        .imoNumber("0000000")
//                        .location("Account ethnikis  \nAccount street number 125 \nAccount postal code 15126")
//                        .build())
//                .permitId("UK-E-IN-12345")
//                .workflowParams(WorkflowTemplateParams.builder()
//                        .requestId("123")
//                        .requestType("PERMIT_VARIATION") //("PERMIT_ISSUANCE")
//                        .requestTypeInfo("your permit variation")
//                        .requestSubmissionDate(new Date())
//                        .requestEndDate(LocalDateTime.of(1998, 1, 1, 1, 1))
//                        .build())
//                .params(params)
//                .build();
//    }
//
//    private EmissionsMonitoringPlanContainer getEmissionsMonitoringPlanContainer() {
//        final UUID uuid1 = UUID.randomUUID();
//        final UUID uuid2 = UUID.randomUUID();
//        final UUID uuid3 = UUID.randomUUID();
//        final UUID uuid4 = UUID.randomUUID();
//        final UUID uuid5 = UUID.randomUUID();
//        final UUID uuid6 = UUID.randomUUID();
//        final UUID uuid7 = UUID.randomUUID();
//        final UUID uuid8 = UUID.randomUUID();
//        final UUID uuid9 = UUID.randomUUID();
//
//        return EmissionsMonitoringPlanContainer.builder()
//            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
//                .operatorDetails(EmpOperatorDetails.builder()
//                    .imoNumber("0000025")
//                    .operatorName("operator name")
//                    .contactAddress(AddressStateDTO.builder()
//                        .line1("contact address line 1")
//                        .line2("contact address line 2")
//                        .country("contact address country")
//                        .city("contact address city")
//                        .state("contact address state")
//                        .postcode("contact address postcode")
//                        .build())
//                    .declarationDocuments(DeclarationDocuments.builder()
//                        .exist(true)
//                        .documents(Set.of(uuid1))
//                        .build())
//                    .organisationStructure(LimitedCompanyOrganisation.builder()
//                        .legalStatusType(OrganisationLegalStatusType.LIMITED_COMPANY)
//                        .registrationNumber("Limited company registration number")
//                        .registeredAddress(AddressStateDTO.builder()
//                            .line1("line1")
//                            .city("city")
//                            .state("state")
//                            .postcode("1234")
//                            .country("country")
//                            .build())
//                        .evidenceFiles(Set.of(uuid3, uuid4))
//                        .build())
//                    .activityDescription("""
//                                        activity description
//
//                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum tincidunt magna. Vestibulum nunc lacus, dapibus eu dui eu, venenatis fringilla tortor. Curabitur viverra blandit risus, ac scelerisque ligula vestibulum sed. Maecenas finibus felis at tellus eleifend, molestie ultricies justo maximus. Integer sagittis lectus id nibh imperdiet, mattis congue erat ultrices. Morbi non pretium libero. Integer vel magna nulla. Curabitur nec risus est. Nunc tortor erat, pellentesque sit amet finibus a, sollicitudin ac nisi. Curabitur tincidunt dolor non efficitur pharetra. Mauris elementum, enim sit amet tempor cursus, justo tortor fermentum eros, quis efficitur dui orci sit amet massa. Integer sit amet elit viverra, dictum nibh scelerisque, consequat tellus. Morbi sollicitudin rutrum fermentum. Nullam sed justo vitae purus aliquam bibendum quis vel nibh. Nulla dictum congue nibh, ac sodales turpis aliquam sit amet. Aenean tortor est, facilisis sed mauris sit amet, congue efficitur metus.
//                                        In ac posuere mauris, id blandit magna. Donec tempor nulla nunc, a ultrices nulla malesuada ac. Nunc viverra pulvinar nulla, non condimentum justo imperdiet non. Vestibulum eget libero quis ligula consectetur ultrices. Praesent tincidunt hendrerit tortor, nec vestibulum ligula placerat eget. Duis ac semper nulla, quis convallis ligula. Donec non eros at justo rutrum facilisis eu ac metus. Duis enim justo, convallis in lacus vel, condimentum dapibus turpis. Aenean nec molestie lorem. Duis imperdiet posuere turpis, tempus convallis arcu mattis non. Pellentesque sed enim ut neque tempus congue eget eget erat. Cras condimentum malesuada ex, vitae fringilla elit lacinia vitae. Cras sed commodo dolor, at tristique metus. Nunc dapibus, enim sit amet dapibus semper, velit est ultrices magna, lobortis feugiat arcu ligula sed dolor.
//                                        Aliquam nec ligula ipsum. Duis sit amet neque ut eros fermentum pharetra. Nunc imperdiet faucibus dignissim. Phasellus vitae tincidunt erat. In nec ex eu est porta venenatis. In feugiat cursus commodo. Praesent at dolor imperdiet, sollicitudin ipsum vel, sollicitudin nisi. Maecenas eget lorem nec arcu tincidunt faucibus. Nam lacinia mollis magna, non congue ante volutpat at. Mauris laoreet nibh sit amet eros ultrices, in ornare lectus facilisis.
//                                                                                 """)
//                    .build())
//                .controlActivities(EmpControlActivities.builder()
//                    .qualityAssurance(EmpProcedureForm.builder()
//                        .reference("Quality assurance procedure reference")
//                        .description("Quality assurance procedure description")
//                        .responsiblePersonOrPosition("Quality assurance responsible department")
//                        .recordsLocation("Quality assurance records location")
//                        .itSystemUsed("Quality assurance IT system")
//                        .build())
//                    .internalReviews(EmpProcedureForm.builder()
//                        .reference("Internal reviews procedure reference")
//                        .description("Internal reviews procedure description")
//                        .responsiblePersonOrPosition("Internal reviews responsible department")
//                        .recordsLocation("Internal reviews records location")
//                        .itSystemUsed("Internal reviews IT system")
//                        .build())
//                    .corrections(EmpProcedureForm.builder()
//                        .reference("Corrections procedure reference")
//                        .description("Corrections procedure description")
//                        .responsiblePersonOrPosition("Corrections responsible department")
//                        .recordsLocation("Corrections records location")
//                        .itSystemUsed("Corrections IT system")
//                        .build())
//                    .outsourcedActivities(EmpOutsourcedActivities.builder()
//                        .exist(true)
//                        .details(EmpProcedureForm.builder()
//                            .reference("Outsourced Activities procedure reference")
//                            .description("Outsourced Activities procedure description")
//                            .responsiblePersonOrPosition("Outsourced Activities responsible department")
//                            .recordsLocation("Outsourced Activities records location")
//                            .itSystemUsed("Outsourced Activities IT system")
//                            .build())
//                        .build())
//                    .documentation(EmpProcedureForm.builder()
//                        .reference("Documentation procedure reference")
//                        .description("Documentation procedure description")
//                        .responsiblePersonOrPosition("Documentation responsible department")
//                        .recordsLocation("Documentation records location")
//                        .itSystemUsed("Documentation IT system")
//                        .build())
//                    .build())
//                .sources(EmpEmissionSources.builder()
//                    .emissionFactors(EmpEmissionFactors.builder()
//                        .exist(false)
//                        .factors(EmpProcedureForm.builder()
//                            .reference("Factors procedure reference")
//                            .description("Factors procedure description")
//                            .responsiblePersonOrPosition("Factors responsible department")
//                            .recordsLocation("Factors records location")
//                            .itSystemUsed("Factors IT system")
//                            .build())
//                        .build())
//                    .emissionCompliance(EmpEmissionCompliance.builder()
//                        .exist(true)
//                        .criteria(EmpProcedureForm.builder()
//                            .reference("Criteria procedure reference")
//                            .description("Criteria procedure description")
//                            .responsiblePersonOrPosition("Criteria responsible department")
//                            .recordsLocation("Criteria records location")
//                            .itSystemUsed("Criteria IT system")
//                            .build())
//                        .build())
//                    .listCompletion(EmpProcedureForm.builder()
//                        .reference("List completion procedure reference")
//                        .description("List completion procedure description")
//                        .responsiblePersonOrPosition("List completion responsible department")
//                        .recordsLocation("List completion records location")
//                        .itSystemUsed("List completion IT system")
//                        .build())
//                    .build())
//                .greenhouseGas(EmpMonitoringGreenhouseGas.builder()
//                    .fuel(EmpProcedureForm.builder()
//                        .reference("Fuel procedure reference")
//                        .description("Fuel procedure description")
//                        .responsiblePersonOrPosition("Fuel responsible department")
//                        .recordsLocation("Fuel records location")
//                        .itSystemUsed("Fuel IT system")
//                        .build())
//                    .crossChecks(EmpProcedureForm.builder()
//                        .reference("Cross checks procedure reference")
//                        .description("Cross checks procedure description")
//                        .responsiblePersonOrPosition("Cross checks responsible department")
//                        .recordsLocation("Cross checks records location")
//                        .itSystemUsed("Cross checks IT system")
//                        .build())
//                    .information(EmpProcedureForm.builder()
//                        .reference("Information procedure reference")
//                        .description("Information procedure description")
//                        .responsiblePersonOrPosition("Information responsible department")
//                        .recordsLocation("Information records location")
//                        .itSystemUsed("Information IT system")
//                        .build())
//                    .qaEquipment(EmpProcedureForm.builder()
//                        .reference("QA equipment procedure reference")
//                        .description("QA equipment procedure description")
//                        .responsiblePersonOrPosition("QA equipment responsible department")
//                        .recordsLocation("QA equipment records location")
//                        .itSystemUsed("QA equipment IT system")
//                        .build())
//                    .voyages(EmpProcedureForm.builder()
//                        .reference("Voyages procedure reference")
//                        .description("Voyages procedure description")
//                        .responsiblePersonOrPosition("Voyages responsible department")
//                        .recordsLocation("Voyages records location")
//                        .itSystemUsed("Voyages IT system")
//                        .build())
//                    .build())
//                .emissions(EmpEmissions.builder()
//                    .ships(Set.of(EmpShipEmissions.builder()
//                                .details(ShipDetails.builder()
//                                    .imoNumber("0000001")
//                                    .name("ship1")
//                                    .type(ShipType.BULK)
//                                    .grossTonnage(10000)
//                                    .flagState(FlagState.GR)
//                                    .iceClass(IceClass.PC1)
//                                    .natureOfReportingResponsibility(ReportingResponsibilityNature.SHIPOWNER)
//                                    .build())
//                                .fuelsAndEmissionsFactors(Set.of(EmpFossilFuels.builder()
//                                        .origin(FuelOrigin.FOSSIL)
//                                        .name("fossil fuel name")
//                                        .carbonDioxide(BigDecimal.valueOf(3.114))
//                                        .methane(BigDecimal.valueOf(8.765))
//                                        .nitrousOxide(BigDecimal.valueOf(23.5678))
//                                        .sustainableFraction(BigDecimal.ZERO)
//                                        .densityMethodBunker(DensityMethodBunker.FUEL_SUPPLIER)
//                                        .densityMethodTank(DensityMethodTank.MEASUREMENT_SYSTEMS)
//                                        .type(FossilFuelType.HFO)
//                                        .build(),
//                                    EmpBioFuels.builder()
//                                        .origin(FuelOrigin.BIOFUEL)
//                                        .name("bio fuel name")
//                                        .carbonDioxide(BigDecimal.valueOf(3.151))
//                                        .methane(BigDecimal.valueOf(2.765))
//                                        .nitrousOxide(BigDecimal.valueOf(26.5678))
//                                        .sustainableFraction(BigDecimal.ZERO)
//                                        .densityMethodBunker(DensityMethodBunker.ON_BOARD_MEASUREMENT_SYSTEMS)
//                                        .densityMethodTank(DensityMethodTank.LABORATORY_TEST)
//                                        .type(BioFuelType.OTHER)
//                                        .build())
//                                )
//                                .emissionsSources(Set.of(EmpEmissionsSources.builder()
//                                            .referenceNumber("Emission source ref number 1")
//                                            .name("Emission source name 1")
//                                            .type(EmissionSourceType.MAIN_ENGINE)
//                                            .sourceClass(EmissionSourceClass.FUEL_CELLS)
//                                            .fuelDetails(Set.of(FuelOriginFossilTypeName.builder()
//                                                        .origin(FuelOrigin.FOSSIL)
//                                                        .type(FossilFuelType.HFO)
//                                                        .methaneSlip(new BigDecimal("1.1"))
//                                                        .name("fossil fuel Details name 1")
//                                                        .build(),
//                                                    FuelOriginBiofuelTypeName.builder()
//                                                        .origin(FuelOrigin.BIOFUEL)
//                                                        .type(BioFuelType.ETHANOL)
//                                                        .methaneSlip(new BigDecimal("2.2"))
//                                                        .name("bio fuel Details name 2")
//                                                        .build()
//                                                )
//                                            )
//                                            .monitoringMethod(Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK))
//                                            .build(),
//                                        EmpEmissionsSources.builder()
//                                            .referenceNumber("Emission source ref number 2")
//                                            .name("Emission source name 2")
//                                            .type(EmissionSourceType.BOILER)
//                                            .fuelDetails(Set.of(FuelOriginFossilTypeName.builder()
//                                                        .origin(FuelOrigin.FOSSIL)
//                                                        .type(FossilFuelType.HFO)
//                                                        .name("fossil fuel Details name 12")
//                                                        .build(),
//                                                    FuelOriginBiofuelTypeName.builder()
//                                                        .origin(FuelOrigin.BIOFUEL)
//                                                        .type(BioFuelType.ETHANOL)
//                                                        .name("bio fuel Details name 22")
//                                                        .build()
//                                                )
//                                            )
//                                            .monitoringMethod(Set.of(MonitoringMethod.FLOW_METERS, MonitoringMethod.DIRECT))
//                                            .build()
//                                    )
//                                )
//                                .uncertaintyLevel(Set.of(
//                                        UncertaintyLevel.builder()
//                                            .monitoringMethod(MonitoringMethod.BDN)
//                                            .methodApproach(MethodApproach.DEFAULT)
//                                            .value(BigDecimal.valueOf(7.5))
//                                            .build(),
//                                        UncertaintyLevel.builder()
//                                            .monitoringMethod(MonitoringMethod.DIRECT)
//                                            .methodApproach(MethodApproach.SHIP_SPECIFIC)
//                                            .value(BigDecimal.valueOf(9.15))
//                                            .build()
//                                    )
//                                )
//                                .carbonCapture(EmpCarbonCapture.builder()
//                                    .exist(Boolean.FALSE)
//                                    .technologies(EmpCarbonCaptureTechnologies.builder()
//                                        .description("""
//                                                                                Carbon capture technologies description
//
//                                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum tincidunt magna. Vestibulum nunc lacus, dapibus eu dui eu, venenatis fringilla tortor. Curabitur viverra blandit risus, ac scelerisque ligula vestibulum sed. Maecenas finibus felis at tellus eleifend, molestie ultricies justo maximus. Integer sagittis lectus id nibh imperdiet, mattis congue erat ultrices. Morbi non pretium libero. Integer vel magna nulla. Curabitur nec risus est. Nunc tortor erat, pellentesque sit amet finibus a, sollicitudin ac nisi. Curabitur tincidunt dolor non efficitur pharetra. Mauris elementum, enim sit amet tempor cursus, justo tortor fermentum eros, quis efficitur dui orci sit amet massa. Integer sit amet elit viverra, dictum nibh scelerisque, consequat tellus. Morbi sollicitudin rutrum fermentum. Nullam sed justo vitae purus aliquam bibendum quis vel nibh. Nulla dictum congue nibh, ac sodales turpis aliquam sit amet. Aenean tortor est, facilisis sed mauris sit amet, congue efficitur metus.
//                                                                                In ac posuere mauris, id blandit magna. Donec tempor nulla nunc, a ultrices nulla malesuada ac. Nunc viverra pulvinar nulla, non condimentum justo imperdiet non. Vestibulum eget libero quis ligula consectetur ultrices. Praesent tincidunt hendrerit tortor, nec vestibulum ligula placerat eget. Duis ac semper nulla, quis convallis ligula. Donec non eros at justo rutrum facilisis eu ac metus. Duis enim justo, convallis in lacus vel, condimentum dapibus turpis. Aenean nec molestie lorem. Duis imperdiet posuere turpis, tempus convallis arcu mattis non. Pellentesque sed enim ut neque tempus congue eget eget erat. Cras condimentum malesuada ex, vitae fringilla elit lacinia vitae. Cras sed commodo dolor, at tristique metus. Nunc dapibus, enim sit amet dapibus semper, velit est ultrices magna, lobortis feugiat arcu ligula sed dolor.
//                                                                                Aliquam nec ligula ipsum. Duis sit amet neque ut eros fermentum pharetra. Nunc imperdiet faucibus dignissim. Phasellus vitae tincidunt erat. In nec ex eu est porta venenatis. In feugiat cursus commodo. Praesent at dolor imperdiet, sollicitudin ipsum vel, sollicitudin nisi. Maecenas eget lorem nec arcu tincidunt faucibus. Nam lacinia mollis magna, non congue ante volutpat at. Mauris laoreet nibh sit amet eros ultrices, in ornare lectus facilisis.
//                                                                                                                         """)
//                                        .technologyEmissionSources(Set.of("Technology emission source 1",
//                                                "Technology emission source 2"
//                                            )
//                                        )
//                                        .build())
//                                    .build())
//                                .measurements(Set.of(MeasurementDescription.builder()
//                                        .name("measurement description name 1")
//                                        .emissionSources(Set.of("Emission source name 1",
//                                                "Emission source name 2"
//                                            )
//                                        )
//                                        .build()
//                                    )
//                                )
//                                .exemptionConditions(ExemptionConditions.builder()
//                                    .exist(Boolean.FALSE)
//                                    .minVoyages(400)
//                                    .build())
//                                .build(),
//                            EmpShipEmissions.builder()
//                                .details(ShipDetails.builder()
//                                    .imoNumber("0000002")
//                                    .name("ship2")
//                                    .type(ShipType.COMB)
//                                    .grossTonnage(25000)
//                                    .flagState(FlagState.AE)
//                                    .iceClass(IceClass.PC2)
//                                    .natureOfReportingResponsibility(ReportingResponsibilityNature.ISM_COMPANY)
//                                    .build())
//                                .fuelsAndEmissionsFactors(Set.of(EmpEFuels.builder()
//                                        .origin(FuelOrigin.RFNBO)
//                                        .name("efuel name")
//                                        .carbonDioxide(BigDecimal.valueOf(3.114))
//                                        .methane(BigDecimal.valueOf(8.765))
//                                        .nitrousOxide(BigDecimal.valueOf(23.5678))
//                                        .sustainableFraction(BigDecimal.ZERO)
//                                        .densityMethodBunker(DensityMethodBunker.ON_BOARD_MEASUREMENT_SYSTEMS)
//                                        .densityMethodTank(DensityMethodTank.LABORATORY_TEST)
//                                        .type(EFuelType.E_DIESEL)
//                                        .build(),
//                                    EmpBioFuels.builder()
//                                        .origin(FuelOrigin.BIOFUEL)
//                                        .name("bio fuel name 2")
//                                        .carbonDioxide(BigDecimal.valueOf(3.151))
//                                        .methane(BigDecimal.valueOf(7.134))
//                                        .nitrousOxide(BigDecimal.valueOf(67.893))
//                                        .sustainableFraction(BigDecimal.ZERO)
//                                        .densityMethodBunker(DensityMethodBunker.ON_BOARD_MEASUREMENT_SYSTEMS)
//                                        .densityMethodTank(DensityMethodTank.LABORATORY_TEST)
//                                        .type(BioFuelType.BIO_LNG)
//                                        .build())
//                                )
//                                .emissionsSources(Set.of(EmpEmissionsSources.builder()
//                                            .referenceNumber("Emission source ref number 1")
//                                            .name("Emission source name 1")
//                                            .type(EmissionSourceType.MAIN_ENGINE)
//                                            .fuelDetails(Set.of(FuelOriginEFuelTypeName.builder()
//                                                        .origin(FuelOrigin.RFNBO)
//                                                        .type(EFuelType.E_DIESEL)
//                                                        .name("efuel Details name 1")
//                                                        .build(),
//                                                    FuelOriginBiofuelTypeName.builder()
//                                                        .origin(FuelOrigin.BIOFUEL)
//                                                        .type(BioFuelType.ETHANOL)
//                                                        .name("bio fuel Details name 2")
//                                                        .build()
//                                                )
//                                            )
//                                            .monitoringMethod(Set.of(MonitoringMethod.BDN, MonitoringMethod.BUNKER_TANK))
//                                            .build(),
//                                        EmpEmissionsSources.builder()
//                                            .referenceNumber("Emission source ref number 2")
//                                            .name("Emission source name 2")
//                                            .type(EmissionSourceType.BOILER)
//                                            .sourceClass(EmissionSourceClass.LNG_LBSI)
//                                            .fuelDetails(Set.of(FuelOriginEFuelTypeName.builder()
//                                                        .origin(FuelOrigin.RFNBO)
//                                                        .type(EFuelType.E_DIESEL)
//                                                        .methaneSlip(new BigDecimal("12"))
//                                                        .name("efuel Details name 12")
//                                                        .build(),
//                                                    FuelOriginBiofuelTypeName.builder()
//                                                        .origin(FuelOrigin.BIOFUEL)
//                                                        .type(BioFuelType.ETHANOL)
//                                                        .methaneSlip(new BigDecimal("22"))
//                                                        .name("bio fuel Details name 22")
//                                                        .build()
//                                                )
//                                            )
//                                            .monitoringMethod(Set.of(MonitoringMethod.FLOW_METERS, MonitoringMethod.DIRECT))
//                                            .build()
//                                    )
//                                )
//                                .uncertaintyLevel(Set.of(
//                                        UncertaintyLevel.builder()
//                                            .monitoringMethod(MonitoringMethod.BDN)
//                                            .methodApproach(MethodApproach.DEFAULT)
//                                            .value(BigDecimal.valueOf(7.5))
//                                            .build(),
//                                        UncertaintyLevel.builder()
//                                            .monitoringMethod(MonitoringMethod.DIRECT)
//                                            .methodApproach(MethodApproach.SHIP_SPECIFIC)
//                                            .value(BigDecimal.valueOf(9.15))
//                                            .build()
//                                    )
//                                )
//                                .carbonCapture(EmpCarbonCapture.builder()
//                                    .exist(Boolean.TRUE)
//                                    .technologies(EmpCarbonCaptureTechnologies.builder()
//                                        .description("""
//                                                                                Carbon capture technologies description 2
//
//                                                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum tincidunt magna. Vestibulum nunc lacus, dapibus eu dui eu, venenatis fringilla tortor. Curabitur viverra blandit risus, ac scelerisque ligula vestibulum sed. Maecenas finibus felis at tellus eleifend, molestie ultricies justo maximus. Integer sagittis lectus id nibh imperdiet, mattis congue erat ultrices. Morbi non pretium libero. Integer vel magna nulla. Curabitur nec risus est. Nunc tortor erat, pellentesque sit amet finibus a, sollicitudin ac nisi. Curabitur tincidunt dolor non efficitur pharetra. Mauris elementum, enim sit amet tempor cursus, justo tortor fermentum eros, quis efficitur dui orci sit amet massa. Integer sit amet elit viverra, dictum nibh scelerisque, consequat tellus. Morbi sollicitudin rutrum fermentum. Nullam sed justo vitae purus aliquam bibendum quis vel nibh. Nulla dictum congue nibh, ac sodales turpis aliquam sit amet. Aenean tortor est, facilisis sed mauris sit amet, congue efficitur metus.
//                                                                                In ac posuere mauris, id blandit magna. Donec tempor nulla nunc, a ultrices nulla malesuada ac. Nunc viverra pulvinar nulla, non condimentum justo imperdiet non. Vestibulum eget libero quis ligula consectetur ultrices. Praesent tincidunt hendrerit tortor, nec vestibulum ligula placerat eget. Duis ac semper nulla, quis convallis ligula. Donec non eros at justo rutrum facilisis eu ac metus. Duis enim justo, convallis in lacus vel, condimentum dapibus turpis. Aenean nec molestie lorem. Duis imperdiet posuere turpis, tempus convallis arcu mattis non. Pellentesque sed enim ut neque tempus congue eget eget erat. Cras condimentum malesuada ex, vitae fringilla elit lacinia vitae. Cras sed commodo dolor, at tristique metus. Nunc dapibus, enim sit amet dapibus semper, velit est ultrices magna, lobortis feugiat arcu ligula sed dolor.
//                                                                                Aliquam nec ligula ipsum. Duis sit amet neque ut eros fermentum pharetra. Nunc imperdiet faucibus dignissim. Phasellus vitae tincidunt erat. In nec ex eu est porta venenatis. In feugiat cursus commodo. Praesent at dolor imperdiet, sollicitudin ipsum vel, sollicitudin nisi. Maecenas eget lorem nec arcu tincidunt faucibus. Nam lacinia mollis magna, non congue ante volutpat at. Mauris laoreet nibh sit amet eros ultrices, in ornare lectus facilisis.
//                                                                                                                         """)
//                                        .technologyEmissionSources(Set.of("Technology emission source 1",
//                                                "Technology emission source 2"
//                                            )
//                                        )
//                                        .build())
//                                    .build())
//                                .measurements(Set.of(MeasurementDescription.builder()
//                                        .name("measurement description name 1")
//                                        .emissionSources(Set.of("Emission source name 1",
//                                                "Emission source name 2"
//                                            )
//                                        )
//                                        .build()
//                                    )
//                                )
//                                .exemptionConditions(ExemptionConditions.builder()
//                                    .exist(Boolean.TRUE)
//                                    .minVoyages(700)
//                                    .build())
//                                .build()
//                        )
//                    )
//                    .build())
//                .dataGaps(EmpDataGaps.builder()
//                    .dataSources("data sources")
//                    .formulaeUsed("formulae used")
//                    .responsiblePersonOrPosition("responsible person")
//                    .fuelConsumptionEstimationMethod("Fuel Consumption Estimation Method")
//                    .recordsLocation("records location")
//                    .itSystemUsed("IT system used")
//                    .build())
//                .managementProcedures(EmpManagementProcedures.builder()
//                    .monitoringReportingRoles(List.of(EmpMonitoringReportingRole.builder()
//                            .jobTitle("job title 1")
//                            .mainDuties("""
//                                                        main duty 1
//                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum tincidunt magna. Vestibulum nunc lacus, dapibus eu dui eu, venenatis fringilla tortor. Curabitur viverra blandit risus, ac scelerisque ligula vestibulum sed. Maecenas finibus felis at tellus eleifend, molestie ultricies justo maximus. Integer sagittis lectus id nibh imperdiet, mattis congue erat ultrices. Morbi non pretium libero. Integer vel magna nulla. Curabitur nec risus est. Nunc tortor erat, pellentesque sit amet finibus a, sollicitudin ac nisi. Curabitur tincidunt dolor non efficitur pharetra. Mauris elementum, enim sit amet tempor cursus, justo tortor fermentum eros, quis efficitur dui orci sit amet massa. Integer sit amet elit viverra, dictum nibh scelerisque, consequat tellus. Morbi sollicitudin rutrum fermentum. Nullam sed justo vitae purus aliquam bibendum quis vel nibh. Nulla dictum congue nibh, ac sodales turpis aliquam sit amet. Aenean tortor est, facilisis sed mauris sit amet, congue efficitur metus.
//                                                        In ac posuere mauris, id blandit magna. Donec tempor nulla nunc, a ultrices nulla malesuada ac. Nunc viverra pulvinar nulla, non condimentum justo imperdiet non. Vestibulum eget libero quis ligula consectetur ultrices. Praesent tincidunt hendrerit tortor, nec vestibulum ligula placerat eget. Duis ac semper nulla, quis convallis ligula. Donec non eros at justo rutrum facilisis eu ac metus. Duis enim justo, convallis in lacus vel, condimentum dapibus turpis. Aenean nec molestie lorem. Duis imperdiet posuere turpis, tempus convallis arcu mattis non. Pellentesque sed enim ut neque tempus congue eget eget erat. Cras condimentum malesuada ex, vitae fringilla elit lacinia vitae. Cras sed commodo dolor, at tristique metus. Nunc dapibus, enim sit amet dapibus semper, velit est ultrices magna, lobortis feugiat arcu ligula sed dolor.
//                                                        Aliquam nec ligula ipsum. Duis sit amet neque ut eros fermentum pharetra. Nunc imperdiet faucibus dignissim. Phasellus vitae tincidunt erat. In nec ex eu est porta venenatis. In feugiat cursus commodo. Praesent at dolor imperdiet, sollicitudin ipsum vel, sollicitudin nisi. Maecenas eget lorem nec arcu tincidunt faucibus. Nam lacinia mollis magna, non congue ante volutpat at. Mauris laoreet nibh sit amet eros ultrices, in ornare lectus facilisis.
//                                                                                                                        """)
//                            .build(),
//                        EmpMonitoringReportingRole.builder()
//                            .jobTitle("job title 2")
//                            .mainDuties("main duty 2")
//                            .build()))
//                    .regularCheckOfAdequacy(EmpProcedureForm.builder()
//                        .reference("CheckOfAdequacy responsibilities procedure reference")
//                        .description("CheckOfAdequacy responsibilities procedure description")
//                        .responsiblePersonOrPosition("CheckOfAdequacy responsibilities responsible department")
//                        .recordsLocation("CheckOfAdequacy responsibilities records location")
//                        .itSystemUsed("CheckOfAdequacy responsibilities IT system")
//                        .build())
//                    .dataFlowActivities(EmpProcedureFormWithFiles.builder()
//                        .reference("dataFlow responsibilities procedure reference")
//                        .description("dataFlow responsibilities procedure description")
//                        .responsiblePersonOrPosition("dataFlow responsibilities responsible department")
//                        .recordsLocation("dataFlow responsibilities records location")
//                        .itSystemUsed("dataFlow responsibilities IT system")
//                        .files(Set.of(uuid7, uuid8))
//                        .build())
//                    .riskAssessmentProcedures(EmpProcedureFormWithFiles.builder()
//                        .reference("riskAssessment activities procedure reference")
//                        .description("riskAssessment activities procedure description")
//                        .responsiblePersonOrPosition("riskAssessment activities responsible department")
//                        .recordsLocation("riskAssessment activities records location")
//                        .itSystemUsed("riskAssessment activities IT system")
//                        .files(Set.of(uuid9))
//                        .build())
//                    .build()
//                )
//                .abbreviations(EmpAbbreviations.builder()
//                    .exist(true)
//                    .abbreviationDefinitions(List.of(EmpAbbreviationDefinition.builder()
//                            .abbreviation("abbreviation 1")
//                            .definition("""
//                                                        definition 1
//                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum tincidunt magna. Vestibulum nunc lacus, dapibus eu dui eu, venenatis fringilla tortor. Curabitur viverra blandit risus, ac scelerisque ligula vestibulum sed. Maecenas finibus felis at tellus eleifend, molestie ultricies justo maximus. Integer sagittis lectus id nibh imperdiet, mattis congue erat ultrices. Morbi non pretium libero. Integer vel magna nulla. Curabitur nec risus est. Nunc tortor erat, pellentesque sit amet finibus a, sollicitudin ac nisi. Curabitur tincidunt dolor non efficitur pharetra. Mauris elementum, enim sit amet tempor cursus, justo tortor fermentum eros, quis efficitur dui orci sit amet massa. Integer sit amet elit viverra, dictum nibh scelerisque, consequat tellus. Morbi sollicitudin rutrum fermentum. Nullam sed justo vitae purus aliquam bibendum quis vel nibh. Nulla dictum congue nibh, ac sodales turpis aliquam sit amet. Aenean tortor est, facilisis sed mauris sit amet, congue efficitur metus.
//                                                        In ac posuere mauris, id blandit magna. Donec tempor nulla nunc, a ultrices nulla malesuada ac. Nunc viverra pulvinar nulla, non condimentum justo imperdiet non. Vestibulum eget libero quis ligula consectetur ultrices. Praesent tincidunt hendrerit tortor, nec vestibulum ligula placerat eget. Duis ac semper nulla, quis convallis ligula. Donec non eros at justo rutrum facilisis eu ac metus. Duis enim justo, convallis in lacus vel, condimentum dapibus turpis. Aenean nec molestie lorem. Duis imperdiet posuere turpis, tempus convallis arcu mattis non. Pellentesque sed enim ut neque tempus congue eget eget erat. Cras condimentum malesuada ex, vitae fringilla elit lacinia vitae. Cras sed commodo dolor, at tristique metus. Nunc dapibus, enim sit amet dapibus semper, velit est ultrices magna, lobortis feugiat arcu ligula sed dolor.
//                                                        Aliquam nec ligula ipsum. Duis sit amet neque ut eros fermentum pharetra. Nunc imperdiet faucibus dignissim. Phasellus vitae tincidunt erat. In nec ex eu est porta venenatis. In feugiat cursus commodo. Praesent at dolor imperdiet, sollicitudin ipsum vel, sollicitudin nisi. Maecenas eget lorem nec arcu tincidunt faucibus. Nam lacinia mollis magna, non congue ante volutpat at. Mauris laoreet nibh sit amet eros ultrices, in ornare lectus facilisis.
//                                                                                                                """)
//                            .build(),
//                        EmpAbbreviationDefinition.builder()
//                            .abbreviation("abbreviation 2")
//                            .definition("definition 2")
//                            .build()))
//                    .build())
//                .additionalDocuments(AdditionalDocuments.builder()
//                    .exist(true)
//                    .documents(Set.of(uuid5, uuid6))
//                    .build())
//                .build())
//            .empAttachments(
//                Map.of(uuid1, "file1",
//                    uuid2, "file2",
//                    uuid3, "file3",
//                    uuid4, "file4",
//                    uuid5, "file5",
//                    uuid6, "file6",
//                    uuid7, "file7",
//                    uuid8, "file8",
//                    uuid9, "file9"
//                )
//            )
//            .build();
//    }
//
//    private DocumentTemplateFileInfoDTO getDocumentTemplateFileInfo(FileDTO file) {
//        return DocumentTemplateFileInfoDTO.builder().processRequired(true).convertRequired(true).file(file).build();
//    }
//
//}