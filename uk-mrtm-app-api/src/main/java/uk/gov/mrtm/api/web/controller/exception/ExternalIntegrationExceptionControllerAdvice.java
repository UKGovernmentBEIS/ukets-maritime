package uk.gov.mrtm.api.web.controller.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import uk.gov.mrtm.api.web.controller.external.ExternalAerController;
import uk.gov.mrtm.api.web.controller.external.ExternalAerVerificationController;
import uk.gov.mrtm.api.web.controller.external.ExternalEmpSubmitController;
import uk.gov.mrtm.api.web.controller.external.ExternalEmpViewController;
import uk.gov.mrtm.api.web.util.ErrorUtil;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.validation.Violation;

import java.util.Optional;

/**
 * External integration API error handling for improved FORM1001 field paths and enum messages.
 * Takes precedence over {@link ExceptionControllerAdvice} for external supplier controllers only.
 * Disable via {@code feature-flag.external.integration.form-validation-improvements.enabled=false}.
 */
@ControllerAdvice(assignableTypes = {
    ExternalEmpSubmitController.class,
    ExternalEmpViewController.class,
    ExternalAerController.class,
    ExternalAerVerificationController.class
})
@Order(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnProperty(
    name = "feature-flag.external.integration.form-validation-improvements.enabled",
    havingValue = "true",
    matchIfMissing = true)
@Log4j2
public class ExternalIntegrationExceptionControllerAdvice {

    private static final Violation[] EMPTY_VIOLATIONS = new Violation[0];

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<ExternalErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        log.warn("External API method argument not valid: {}", exception.getMessage());

        try {
            Violation[] violations = FormValidationViolationMapper.fromMethodArgumentNotValid(exception);
            return ErrorUtil.getExternalErrorResponse(violations, ErrorCode.FORM_VALIDATION);
        } catch (Exception mappingException) {
            log.error("Failed to map external FORM1001 violations; using Spring field paths", mappingException);
            try {
                return ErrorUtil.getExternalErrorResponse(
                        FormValidationViolationMapper.fallbackFromMethodArgumentNotValid(exception),
                        ErrorCode.FORM_VALIDATION);
            } catch (Exception fallbackException) {
                log.error("Failed to build fallback FORM1001 violations", fallbackException);
                return ErrorUtil.getExternalErrorResponse(EMPTY_VIOLATIONS, ErrorCode.FORM_VALIDATION);
            }
        }
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    public ResponseEntity<ExternalErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException exception) {
        log.warn("External API invalid request body: {}", exception.getMessage());

        try {
            Optional<Violation[]> violations =
                    FormValidationViolationMapper.fromHttpMessageNotReadable(exception);
            if (violations.isPresent()) {
                return ErrorUtil.getExternalErrorResponse(violations.get(), ErrorCode.FORM_VALIDATION);
            }
        } catch (Exception mappingException) {
            log.error("Failed to map external request body parse error; using default invalid request format response", mappingException);
        }

        return ErrorUtil.getExternalErrorResponse(
                FormValidationViolationMapper.fallbackFromHttpMessageNotReadable(exception),
                ErrorCode.INVALID_REQUEST_FORMAT);
    }
}
