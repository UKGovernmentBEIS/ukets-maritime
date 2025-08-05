package uk.gov.mrtm.api.workflow.request.flow.vir.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class VirReviewValidatorTest {

    @InjectMocks
    private VirReviewValidator validator;

    @Test
    void validate() {
        final RegulatorReviewResponse regulatorReviewResponse = RegulatorReviewResponse.builder()
                .regulatorImprovementResponses(Map.of("A1", RegulatorImprovementResponse.builder().build()))
                .reportSummary("Report summary")
                .build();
        Map<String, OperatorImprovementResponse> operatorImprovementResponses = Map.of(
                "A1", OperatorImprovementResponse.builder().build()
        );

        // Invoke
        validator.validate(regulatorReviewResponse, operatorImprovementResponses);
    }

    @Test
    void validate_missing_reference() {
        final RegulatorReviewResponse regulatorReviewResponse = RegulatorReviewResponse.builder()
                .regulatorImprovementResponses(Map.of("A1", RegulatorImprovementResponse.builder().build()))
                .reportSummary("Report summary")
                .build();
        Map<String, OperatorImprovementResponse> operatorImprovementResponses = Map.of(
                "A1", OperatorImprovementResponse.builder().build(),
                "A2", OperatorImprovementResponse.builder().build()
        );

        // Invoke
        BusinessException be = assertThrows(BusinessException.class,
                () -> validator.validate(regulatorReviewResponse, operatorImprovementResponses));

        // Verify
        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_VIR_REVIEW);
        assertThat(be.getData()).containsExactly("A2");
    }

    @Test
    void validate_extra_reference() {
        final RegulatorReviewResponse regulatorReviewResponse = RegulatorReviewResponse.builder()
                .regulatorImprovementResponses(Map.of(
                        "A1", RegulatorImprovementResponse.builder().build(),
                        "A2", RegulatorImprovementResponse.builder().build()
                ))
                .reportSummary("Report summary")
                .build();
        Map<String, OperatorImprovementResponse> operatorImprovementResponses = Map.of(
                "A1", OperatorImprovementResponse.builder().build()
        );

        // Invoke
        BusinessException be = assertThrows(BusinessException.class,
                () -> validator.validate(regulatorReviewResponse, operatorImprovementResponses));

        // Verify
        assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.INVALID_VIR_REVIEW);
        assertThat(be.getData()).containsExactly("A2");
    }
}
