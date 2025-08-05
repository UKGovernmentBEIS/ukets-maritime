package uk.gov.mrtm.api.workflow.request.core.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionValidationResult;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionValidationErrorCodes;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class MrtmVerificationBodyExistenceRequestTaskActionValidatorTest {

    @InjectMocks
    private MrtmVerificationBodyExistenceRequestTaskActionValidator validator;

    @Test
    void validate() {
        Request request = Request.builder().build();
        addVbResourceToRequest(request);
        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .build();

        assertEquals(RequestTaskActionValidationResult.validResult(), validator.validate(requestTask));
    }

    @Test
    void validate_no_vb() {
        final RequestTask requestTask = RequestTask.builder()
            .request(Request.builder().build())
            .build();
        assertEquals(RequestTaskActionValidationResult.invalidResult(RequestTaskActionValidationErrorCodes.NO_VB_FOUND),
            validator.validate(requestTask));
    }

    @Test
    void getTypes() {
        assertThat(validator.getTypes()).isEqualTo(Set.of(
            MrtmRequestTaskActionType.AER_REQUEST_VERIFICATION,
            MrtmRequestTaskActionType.AER_REQUEST_AMENDS_VERIFICATION
        ));
    }

    @Test
    void getConflictingRequestTaskTypes() {
        assertThat(validator.getConflictingRequestTaskTypes()).isEqualTo(Set.of());
    }

    @Test
    void getErrorCode() {
        assertThat(validator.getErrorCode()).isEqualTo(RequestTaskActionValidationErrorCodes.NO_VB_FOUND);
    }

    private void addVbResourceToRequest(Request request) {
        RequestResource vbIdResource = RequestResource.builder()
            .resourceType(ResourceType.VERIFICATION_BODY)
            .resourceId("1")
            .request(request)
            .build();
        request.getRequestResources().add(vbIdResource);
    }
}