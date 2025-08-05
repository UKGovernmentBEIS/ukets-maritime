package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import org.junit.jupiter.api.Test;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EmpIssuanceReviewDeterminationDeemedWithdrawnValidatorTest {

    private final EmpIssuanceReviewDeterminationDeemedWithdrawnValidator validator = new EmpIssuanceReviewDeterminationDeemedWithdrawnValidator();

    @Test
    void isValid() {
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder().build();
        assertTrue(validator.isValid(requestTaskPayload));
    }

    @Test
    void getType() {
        assertEquals(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN, validator.getType());
    }
}
