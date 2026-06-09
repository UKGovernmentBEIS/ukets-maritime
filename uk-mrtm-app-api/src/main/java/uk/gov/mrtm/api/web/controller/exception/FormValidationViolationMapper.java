package uk.gov.mrtm.api.web.controller.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import uk.gov.netz.api.common.validation.Violation;

import org.springframework.validation.FieldError;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Builds integrator-friendly {@link Violation}s for bean-validation and Jackson parse errors.
 */
@UtilityClass
public class FormValidationViolationMapper {

    private static final String GENERIC_JSON_MAPPING_MESSAGE = "Invalid request body value";
    private static final String REQUEST_BODY_FIELD = "requestBody";

    /**
     * Maps {@link MethodArgumentNotValidException} to violations using Spring field paths,
     * with indexed paths for SpEL / class-level errors ({@code rejectedValue} identity) and
     * null field-level {@code @NotNull} errors on {@code []} paths.
     */
    public static Violation[] fromMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        BindingResult bindingResult = exception.getBindingResult();

        if (!bindingResult.getFieldErrors().isEmpty()) {
            Map<String, Integer> nullLeafOccurrenceCounts = new HashMap<>();
            return bindingResult.getFieldErrors().stream()
                .map(fieldError -> new Violation(
                    resolveFieldPath(fieldError, bindingResult, nullLeafOccurrenceCounts),
                    fieldError.getDefaultMessage()))
                .toArray(Violation[]::new);
        }

        return bindingResult.getAllErrors().stream()
            .map(error -> new Violation(error.getObjectName(), error.getDefaultMessage()))
            .toArray(Violation[]::new);
    }

    /**
     * Safe fallback when enriched path mapping fails: Spring field paths without indexing.
     */
    static Violation[] fallbackFromMethodArgumentNotValid(MethodArgumentNotValidException exception) {
        BindingResult bindingResult = exception.getBindingResult();

        if (!bindingResult.getFieldErrors().isEmpty()) {
            return bindingResult.getFieldErrors().stream()
                .map(fieldError -> new Violation(fieldError.getField(), fieldError.getDefaultMessage()))
                .toArray(Violation[]::new);
        }

        return bindingResult.getAllErrors().stream()
            .map(error -> new Violation(error.getObjectName(), error.getDefaultMessage()))
            .toArray(Violation[]::new);
    }

    /**
     * Maps Jackson parse failures (e.g. invalid enum literals) to violations when path information is available.
     */
    public static Optional<Violation[]> fromHttpMessageNotReadable(HttpMessageNotReadableException exception) {
        Throwable cause = exception.getCause();
        while (cause != null) {
            if (cause instanceof InvalidFormatException invalidFormatException) {
                return Optional.of(new Violation[] {fromInvalidFormatException(invalidFormatException)});
            }
            if (cause instanceof JsonMappingException jsonMappingException
                && !(cause instanceof InvalidFormatException)) {
                String fieldPath = buildJsonPath(jsonMappingException.getPath());
                if (StringUtils.isNotBlank(fieldPath)) {
                    return Optional.of(new Violation[] {
                        new Violation(fieldPath, GENERIC_JSON_MAPPING_MESSAGE)});
                }
            }
            cause = cause.getCause();
        }
        return Optional.empty();
    }

    static Violation fromInvalidFormatException(InvalidFormatException exception) {
        String fieldPath = buildJsonPath(exception.getPath());
        String message = formatInvalidFormatMessage(exception);
        return new Violation(fieldPath, message);
    }

    static String buildJsonPath(List<JsonMappingException.Reference> path) {
        if (path == null || path.isEmpty()) {
            return "";
        }

        StringBuilder builder = new StringBuilder();
        for (JsonMappingException.Reference reference : path) {
            if (reference.getFieldName() != null) {
                if (!builder.isEmpty()) {
                    builder.append('.');
                }
                builder.append(reference.getFieldName());
            } else if (reference.getIndex() >= 0) {
                builder.append('[').append(reference.getIndex()).append(']');
            }
        }
        return builder.toString();
    }

    static String formatInvalidFormatMessage(InvalidFormatException exception) {
        Class<?> targetType = exception.getTargetType();
        if (targetType != null && targetType.isEnum()) {
            String rejected = String.valueOf(exception.getValue());
            String accepted = Arrays.stream(targetType.getEnumConstants())
                .map(Object::toString)
                .collect(Collectors.joining(", "));
            return "Invalid value '" + rejected + "'. Accepted values: " + accepted;
        }

        return StringUtils.defaultIfBlank(exception.getOriginalMessage(), "Invalid value");
    }

    /**
     * Fallback used when enriched request-body mapping fails.
     * Keeps the response equivalent to the default invalid-format handling.
     */
    static Violation[] fallbackFromHttpMessageNotReadable(HttpMessageNotReadableException exception) {
        return new Violation[] {
            new Violation(REQUEST_BODY_FIELD, GENERIC_JSON_MAPPING_MESSAGE)
        };
    }

    private static String resolveFieldPath(FieldError fieldError, BindingResult bindingResult,
                                           Map<String, Integer> nullLeafOccurrenceCounts) {
        if (fieldError.getRejectedValue() != null) {
            return RejectedValueFieldPathResolver.resolve(fieldError, bindingResult);
        }
        return NullLeafFieldPathResolver.resolve(fieldError, bindingResult, nullLeafOccurrenceCounts);
    }
}
