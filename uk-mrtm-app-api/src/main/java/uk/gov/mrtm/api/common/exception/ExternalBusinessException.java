package uk.gov.mrtm.api.common.exception;

import lombok.Getter;
import uk.gov.netz.api.common.exception.NetzErrorCode;
import uk.gov.netz.api.common.validation.Violation;

/**
 * Business logic Exception.
 */
@Getter
public class ExternalBusinessException extends RuntimeException {

    /** Serialisation version. */
    private static final long serialVersionUID = -774298234508128915L;

    /** The error status. */
    private final NetzErrorCode errorCode;

    /** The violation list */
    private final Violation[] data;

    /**
     * Construction of ExternalBusinessException with error status.
     *
     * @param errorCode {@link NetzErrorCode}.
     */
    public ExternalBusinessException(NetzErrorCode errorCode) {
        this(errorCode, new Violation[]{});
    }

    /**
     * Construction of ExternalBusinessException with error status and violation data.
     *
     * @param errorCode {@link NetzErrorCode}.
     * @param data the violation list data
     */
    public ExternalBusinessException(NetzErrorCode errorCode, Violation... data) {
        this(errorCode, null, data);
    }

    /**
     * Construction of ExternalBusinessException with error status, cause, and violation data
     * @param errorCode {@link NetzErrorCode}.
     * @param cause the exception cause
     * @param data the violation list data
     */
    public ExternalBusinessException(NetzErrorCode errorCode, Throwable cause, Violation... data) {
        super(errorCode.getMessage(), cause);
        this.errorCode = errorCode;
        this.data = data;
    }
}