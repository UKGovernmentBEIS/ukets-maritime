package uk.gov.mrtm.api.web.controller.exception;

import lombok.Builder;
import lombok.Data;
import uk.gov.netz.api.common.validation.Violation;

/**
 * The ErrorResponse for all exceptions
 */
@Data
@Builder
public class ExternalErrorResponse {

    /** The error code */
    private String code;

    /** The error message */
    private String message;

    /** The error data */
    private Violation[] data;
}
