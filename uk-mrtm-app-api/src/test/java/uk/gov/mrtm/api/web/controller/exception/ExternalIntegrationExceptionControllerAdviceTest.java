package uk.gov.mrtm.api.web.controller.exception;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.validation.Violation;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class ExternalIntegrationExceptionControllerAdviceTest {

    private static final String REQUEST_BODY_FIELD = "requestBody";
    private static final String GENERIC_JSON_MAPPING_MESSAGE = "Invalid request body value";

    private static final String PROPERTY =
        "feature-flag.external.integration.form-validation-improvements.enabled";

    private final ExternalIntegrationExceptionControllerAdvice advice =
        new ExternalIntegrationExceptionControllerAdvice();

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
        .withConfiguration(AutoConfigurations.of())
        .withUserConfiguration(AdviceConfiguration.class);

    @Test
    void advice_notRegisteredWhenFeatureFlagDisabled() {
        contextRunner
            .withPropertyValues(PROPERTY + "=false")
            .run(context -> assertThat(context)
                .doesNotHaveBean(ExternalIntegrationExceptionControllerAdvice.class));
    }

    @Test
    void advice_registeredWhenFeatureFlagEnabled() {
        contextRunner
            .withPropertyValues(PROPERTY + "=true")
            .run(context -> assertThat(context)
                .hasSingleBean(ExternalIntegrationExceptionControllerAdvice.class));
    }

    @Test
    void advice_registeredByDefaultWhenPropertyMissing() {
        contextRunner.run(context -> assertThat(context)
            .hasSingleBean(ExternalIntegrationExceptionControllerAdvice.class));
    }

    @Test
    void handleMethodArgumentNotValid_success_returnsFormValidationWithMappedViolations() throws NoSuchMethodException {
        MethodArgumentNotValidException exception =
            methodArgumentNotValidException("ships[0].imoNumber", "must not be null");

        var response = advice.handleMethodArgumentNotValid(exception);

        assertThat(response).isNotNull();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getCode()).isEqualTo(ErrorCode.FORM_VALIDATION.getCode());
        assertThat(response.getBody().getData()).hasSize(1);
        assertThat(response.getBody().getData()[0].getFieldName()).isEqualTo("ships[0].imoNumber");
        assertThat(response.getBody().getData()[0].getMessage()).isEqualTo("must not be null");
    }

    @Test
    void handleMethodArgumentNotValid_mapperThrows_usesFallbackAndStillReturnsFormValidation() throws NoSuchMethodException {
        MethodArgumentNotValidException exception =
            methodArgumentNotValidException("ships[0].imoNumber", "must not be null");
        Violation[] fallbackViolations = {
            new Violation("ships[0].imoNumber", "must not be null")
        };

        try (MockedStatic<FormValidationViolationMapper> mapper =
                 Mockito.mockStatic(FormValidationViolationMapper.class)) {
            mapper.when(() -> FormValidationViolationMapper.fromMethodArgumentNotValid(exception))
                .thenThrow(new RuntimeException("mapping failed"));
            mapper.when(() -> FormValidationViolationMapper.fallbackFromMethodArgumentNotValid(exception))
                .thenReturn(fallbackViolations);

            var response = advice.handleMethodArgumentNotValid(exception);

            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getCode()).isEqualTo(ErrorCode.FORM_VALIDATION.getCode());
            assertThat(response.getBody().getCode()).isNotEqualTo(ErrorCode.INVALID_REQUEST_FORMAT.getCode());
            assertThat(response.getBody().getData()).containsExactly(fallbackViolations);
        }
    }

    @Test
    void handleMethodArgumentNotValid_mapperAndFallbackThrow_returnsFormValidationWithEmptyViolations()
        throws NoSuchMethodException {
        MethodArgumentNotValidException exception =
            methodArgumentNotValidException("ships[0].imoNumber", "must not be null");

        try (MockedStatic<FormValidationViolationMapper> mapper =
                 Mockito.mockStatic(FormValidationViolationMapper.class)) {
            mapper.when(() -> FormValidationViolationMapper.fromMethodArgumentNotValid(exception))
                .thenThrow(new RuntimeException("mapping failed"));
            mapper.when(() -> FormValidationViolationMapper.fallbackFromMethodArgumentNotValid(exception))
                .thenThrow(new RuntimeException("fallback failed"));

            var response = advice.handleMethodArgumentNotValid(exception);

            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getCode()).isEqualTo(ErrorCode.FORM_VALIDATION.getCode());
            assertThat(response.getBody().getCode()).isNotEqualTo(ErrorCode.INVALID_REQUEST_FORMAT.getCode());
            assertThat(response.getBody().getData()).isEmpty();
        }
    }

    @Test
    void handleHttpMessageNotReadable_mapperReturnsViolations_returnsFormValidation() {
        HttpMessageNotReadableException exception = new HttpMessageNotReadableException("Invalid enum value");
        Violation[] mappedViolations = {
            new Violation("shipParticulars[0].fuelTypes[0].methodDensityBunkerCode", "Invalid value 'TEST'")
        };

        try (MockedStatic<FormValidationViolationMapper> mapper =
                 Mockito.mockStatic(FormValidationViolationMapper.class)) {
            mapper.when(() -> FormValidationViolationMapper.fromHttpMessageNotReadable(exception))
                .thenReturn(Optional.of(mappedViolations));

            var response = advice.handleHttpMessageNotReadable(exception);

            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getCode()).isEqualTo(ErrorCode.FORM_VALIDATION.getCode());
            assertThat(response.getBody().getData()).containsExactly(mappedViolations);
        }
    }

    @Test
    void handleHttpMessageNotReadable_mapperReturnsEmpty_returnsInvalidRequestFormatWithRequestBody() {
        HttpMessageNotReadableException exception = new HttpMessageNotReadableException("Malformed JSON");

        try (MockedStatic<FormValidationViolationMapper> mapper =
                 Mockito.mockStatic(FormValidationViolationMapper.class, Mockito.CALLS_REAL_METHODS)) {
            mapper.when(() -> FormValidationViolationMapper.fromHttpMessageNotReadable(exception))
                .thenReturn(Optional.empty());

            var response = advice.handleHttpMessageNotReadable(exception);

            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getCode()).isEqualTo(ErrorCode.INVALID_REQUEST_FORMAT.getCode());
            assertThat(response.getBody().getCode()).isNotEqualTo(ErrorCode.FORM_VALIDATION.getCode());
            assertThat(response.getBody().getData()).hasSize(1);
            assertThat(response.getBody().getData()[0].getFieldName()).isEqualTo(REQUEST_BODY_FIELD);
            assertThat(response.getBody().getData()[0].getMessage()).isEqualTo(GENERIC_JSON_MAPPING_MESSAGE);
        }
    }

    @Test
    void handleHttpMessageNotReadable_mapperThrows_returnsInvalidRequestFormatWithRequestBody() {
        HttpMessageNotReadableException exception = new HttpMessageNotReadableException("parse failed");

        try (MockedStatic<FormValidationViolationMapper> mapper =
                 Mockito.mockStatic(FormValidationViolationMapper.class, Mockito.CALLS_REAL_METHODS)) {
            mapper.when(() -> FormValidationViolationMapper.fromHttpMessageNotReadable(exception))
                .thenThrow(new RuntimeException("mapping failed"));

            var response = advice.handleHttpMessageNotReadable(exception);

            assertThat(response).isNotNull();
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
            assertThat(response.getBody()).isNotNull();
            assertThat(response.getBody().getCode()).isEqualTo(ErrorCode.INVALID_REQUEST_FORMAT.getCode());
            assertThat(response.getBody().getCode()).isNotEqualTo(ErrorCode.FORM_VALIDATION.getCode());
            assertThat(response.getBody().getData()).hasSize(1);
            assertThat(response.getBody().getData()[0].getFieldName()).isEqualTo(REQUEST_BODY_FIELD);
            assertThat(response.getBody().getData()[0].getMessage()).isEqualTo(GENERIC_JSON_MAPPING_MESSAGE);
        }
    }

    private static MethodArgumentNotValidException methodArgumentNotValidException(String field, String message)
        throws NoSuchMethodException {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "target");
        bindingResult.addError(new FieldError("target", field, null, false, null, null, message));
        MethodParameter parameter = new MethodParameter(Object.class.getMethod("toString"), -1);
        return new MethodArgumentNotValidException(parameter, bindingResult);
    }

    @Configuration
    @Import(ExternalIntegrationExceptionControllerAdvice.class)
    static class AdviceConfiguration {
    }
}
