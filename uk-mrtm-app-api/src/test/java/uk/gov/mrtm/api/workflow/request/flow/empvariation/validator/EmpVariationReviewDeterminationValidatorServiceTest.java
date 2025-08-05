package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationReviewDeterminationValidatorServiceTest {

    @InjectMocks
    private EmpVariationReviewDeterminationValidatorService service;

    @Mock
    private EmpVariationReviewDeterminationApprovedValidator empVariationReviewDeterminationApprovedValidator;

    @Mock
    private EmpVariationReviewDeterminationDeemedWithdrawnValidator empVariationReviewDeterminationDeemedWithdrawnValidator;

    @Mock
    private EmpVariationReviewDeterminationRejectedValidator empVariationReviewDeterminationRejectedValidator;

    @Spy
    private ArrayList<EmpVariationReviewDeterminationTypeValidator> empVariationReviewDeterminationTypeValidators;

    @BeforeEach
    void setUp() {
        empVariationReviewDeterminationTypeValidators.add(empVariationReviewDeterminationApprovedValidator);
        empVariationReviewDeterminationTypeValidators.add(empVariationReviewDeterminationDeemedWithdrawnValidator);
        empVariationReviewDeterminationTypeValidators.add(empVariationReviewDeterminationRejectedValidator);
    }

    @Test
    void isValid_valid() {

        EmpVariationApplicationReviewRequestTaskPayload empVariationApplicationReviewRequestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder().build();

        EmpVariationDeterminationType variationDeterminationType =
                EmpVariationDeterminationType.APPROVED;

        when(empVariationReviewDeterminationApprovedValidator.getType()).thenReturn(EmpVariationDeterminationType.APPROVED);
        when(empVariationReviewDeterminationApprovedValidator.isValid(empVariationApplicationReviewRequestTaskPayload))
                .thenReturn(true);


        final boolean result = service.isValid(empVariationApplicationReviewRequestTaskPayload, variationDeterminationType);

        assertTrue(result);
        verify(empVariationReviewDeterminationApprovedValidator)
                .isValid(empVariationApplicationReviewRequestTaskPayload);

    }

    @Test
    void isValid_invalid() {

        EmpVariationApplicationReviewRequestTaskPayload empVariationApplicationReviewRequestTaskPayload =
                EmpVariationApplicationReviewRequestTaskPayload.builder().build();

        EmpVariationDeterminationType variationDeterminationType =
                EmpVariationDeterminationType.REJECTED;

        when(empVariationReviewDeterminationRejectedValidator.getType()).thenReturn(EmpVariationDeterminationType.REJECTED);
        when(empVariationReviewDeterminationRejectedValidator.isValid(empVariationApplicationReviewRequestTaskPayload))
                .thenReturn(false);

        final boolean result = service.isValid(empVariationApplicationReviewRequestTaskPayload, variationDeterminationType);

        assertFalse(result);
        verify(empVariationReviewDeterminationRejectedValidator)
                .isValid(empVariationApplicationReviewRequestTaskPayload);
    }

}
