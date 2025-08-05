package uk.gov.mrtm.api.workflow.request.flow.vir.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class VirSubmitValidatorTest {

    @InjectMocks
    private VirSubmitValidator validator;

    @Test
    void validate() {

        final VirVerificationData verificationData = VirVerificationData.builder()
            .uncorrectedNonConformities(Map.of(
                "A1", UncorrectedItem.builder().build(),
                "A2", UncorrectedItem.builder().build()
            ))
            .priorYearIssues(Map.of(
                "B1", VerifierComment.builder().build()
            ))
            .build();
        final Map<String, OperatorImprovementResponse> operatorImprovements = Map.of(
            "A1", OperatorImprovementResponse.builder().build(),
            "A2", OperatorImprovementResponse.builder().build(),
            "B1", OperatorImprovementResponse.builder().build()
        );

        assertDoesNotThrow(() -> validator.validate(operatorImprovements, verificationData));
    }

    @Test
    void validate_not_valid_missing_reference() {

        final VirVerificationData verificationData = VirVerificationData.builder()
            .uncorrectedNonConformities(Map.of(
                "A1", UncorrectedItem.builder().build(),
                "A2", UncorrectedItem.builder().build()
            ))
            .priorYearIssues(Map.of(
                "B1", VerifierComment.builder().build()
            ))
            .build();
        final Map<String, OperatorImprovementResponse> operatorImprovements = Map.of(
            "A1", OperatorImprovementResponse.builder().build()
        );

        BusinessException be = assertThrows(BusinessException.class,
            () -> validator.validate(operatorImprovements, verificationData));

        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_VIR);
        assertThat(be.getData()).containsExactly("A2", "B1");
    }

    @Test
    void validate_not_valid_extra_reference() {

        final VirVerificationData verificationData = VirVerificationData.builder()
            .uncorrectedNonConformities(Map.of(
                "A1", UncorrectedItem.builder().build(),
                "A2", UncorrectedItem.builder().build()
            ))
            .priorYearIssues(Map.of(
                "B1", VerifierComment.builder().build()
            ))
            .build();
        final Map<String, OperatorImprovementResponse> operatorImprovements = Map.of(
            "A1", OperatorImprovementResponse.builder().build(),
            "A2", OperatorImprovementResponse.builder().build(),
            "B1", OperatorImprovementResponse.builder().build(),
            "B2", OperatorImprovementResponse.builder().build()
        );

        BusinessException be = assertThrows(BusinessException.class,
            () -> validator.validate(operatorImprovements, verificationData));

        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_VIR);
        assertThat(be.getData()).containsExactly("B2");
    }
}
