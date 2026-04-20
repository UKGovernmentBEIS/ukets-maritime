package uk.gov.mrtm.api.integration.external.aer.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.ExternalBusinessException;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAer;
import uk.gov.mrtm.api.reporting.domain.aggregateddata.AerAggregatedData;
import uk.gov.mrtm.api.reporting.domain.emissions.AerEmissions;
import uk.gov.mrtm.api.reporting.domain.smf.AerSmf;
import uk.gov.mrtm.api.reporting.validation.AerEmissionsValidator;
import uk.gov.mrtm.api.reporting.validation.AerShipAggregatedDataValidator;
import uk.gov.mrtm.api.reporting.validation.AerSmfValidator;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerValidationResult;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExternalAerValidatorTest {

    @InjectMocks
    private ExternalAerValidator validator;

    @Mock
    private AerEmissionsValidator aerEmissionsValidator;
    @Mock
    private AerShipAggregatedDataValidator aerShipAggregatedDataValidator;
    @Mock
    private AerSmfValidator aerSmfValidator;
    @Mock
    private AerValidatorService aerValidatorService;

    @Test
    void validate() {
        StagingAer staging = mock(StagingAer.class);
        AerEmissions emissions = mock(AerEmissions.class);
        AerAggregatedData aggregatedData = mock(AerAggregatedData.class);
        AerSmf smf = mock(AerSmf.class);

        when(aerSmfValidator.validate(smf, emissions)).thenReturn(AerValidationResult.validAer());
        when(aerEmissionsValidator.validate(emissions)).thenReturn(AerValidationResult.validAer());
        when(aerShipAggregatedDataValidator.validate(aggregatedData, emissions, Collections.emptySet(), Collections.emptySet()))
            .thenReturn(AerValidationResult.validAer());

        when(staging.getEmissions()).thenReturn(emissions);
        when(staging.getSmf()).thenReturn(smf);
        when(staging.getAggregatedData()).thenReturn(aggregatedData);

        validator.validate(staging);

        verify(aerSmfValidator).validate(smf, emissions);
        verify(aerEmissionsValidator).validate(emissions);
        verify(aerShipAggregatedDataValidator)
            .validate(aggregatedData, emissions, Collections.emptySet(), Collections.emptySet());
        verify(aerValidatorService).validateStagingAer(staging);

        verifyNoMoreInteractions(aerEmissionsValidator, aerShipAggregatedDataValidator, aerSmfValidator,
            aerValidatorService);
    }

    @Test
    void validate_is_invalid() {
        StagingAer staging = mock(StagingAer.class);
        AerEmissions emissions = mock(AerEmissions.class);
        AerAggregatedData aggregatedData = mock(AerAggregatedData.class);
        AerSmf smf = mock(AerSmf.class);

        AerValidationResult aggregatedDataError = AerValidationResult.builder()
            .valid(false)
            .aerViolations(List.of(new AerViolation("a", AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_FUEL_NAME, "b")))
            .build();
        AerValidationResult smfError = AerValidationResult.builder()
            .valid(false)
            .aerViolations(List.of(new AerViolation("c", AerViolation.ViolationMessage.FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES, "d")))
            .build();
        AerValidationResult emissionsError = AerValidationResult.builder()
            .valid(false)
            .aerViolations(List.of(new AerViolation("e", AerViolation.ViolationMessage.DUPLICATE_EMISSIONS_SOURCE_NAME, "f")))
            .build();

        when(aerSmfValidator.validate(smf, emissions)).thenReturn(smfError);
        when(aerEmissionsValidator.validate(emissions)).thenReturn(emissionsError);
        when(aerShipAggregatedDataValidator.validate(aggregatedData, emissions, Collections.emptySet(), Collections.emptySet()))
            .thenReturn(aggregatedDataError);

        when(staging.getEmissions()).thenReturn(emissions);
        when(staging.getSmf()).thenReturn(smf);
        when(staging.getAggregatedData()).thenReturn(aggregatedData);


        ExternalBusinessException be =
            assertThrows(ExternalBusinessException.class, () -> validator.validate(staging));

        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_AER);
        assertThat(be.getData()).hasSize(3);
        assertEquals(be.getData()[0].getFieldName(), "c");
        assertEquals(be.getData()[0].getMessage(), "AER fuel type not associated with any emission source | ErrorData: [d]");
        assertEquals(be.getData()[1].getFieldName(), "e");
        assertEquals(be.getData()[1].getMessage(), "AER contains multiple emission sources with the same name about the same ship | ErrorData: [f]");
        assertEquals(be.getData()[2].getFieldName(), "a");
        assertEquals(be.getData()[2].getMessage(), "AER contains multiple fuel records with the same name about the same ship | ErrorData: [b]");

        verify(aerSmfValidator).validate(smf, emissions);
        verify(aerEmissionsValidator).validate(emissions);
        verify(aerShipAggregatedDataValidator)
            .validate(aggregatedData, emissions, Collections.emptySet(), Collections.emptySet());

        verifyNoMoreInteractions(aerEmissionsValidator, aerShipAggregatedDataValidator, aerSmfValidator,
            aerValidatorService);
        verifyNoMoreInteractions(aerValidatorService);
    }

    @Test
    void validate_staging_is_invalid() {
        StagingAer staging = mock(StagingAer.class);
        AerEmissions emissions = mock(AerEmissions.class);
        AerAggregatedData aggregatedData = mock(AerAggregatedData.class);
        AerSmf smf = mock(AerSmf.class);

        when(aerSmfValidator.validate(smf, emissions)).thenReturn(AerValidationResult.validAer());
        when(aerEmissionsValidator.validate(emissions)).thenReturn(AerValidationResult.validAer());
        when(aerShipAggregatedDataValidator.validate(aggregatedData, emissions, Collections.emptySet(), Collections.emptySet()))
            .thenReturn(AerValidationResult.validAer());
        when(staging.getEmissions()).thenReturn(emissions);
        when(staging.getSmf()).thenReturn(smf);
        when(staging.getAggregatedData()).thenReturn(aggregatedData);
        doThrow(new BusinessException(ErrorCode.INTERNAL_SERVER)).when(aerValidatorService).validateStagingAer(staging);

        BusinessException be = assertThrows(BusinessException.class, () -> validator.validate(staging));

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INTERNAL_SERVER);

        verify(aerSmfValidator).validate(smf, emissions);
        verify(aerEmissionsValidator).validate(emissions);
        verify(aerShipAggregatedDataValidator)
            .validate(aggregatedData, emissions, Collections.emptySet(), Collections.emptySet());
        verify(aerValidatorService).validateStagingAer(staging);

        verifyNoMoreInteractions(aerValidatorService, aerEmissionsValidator, aerShipAggregatedDataValidator, aerSmfValidator);
    }

}