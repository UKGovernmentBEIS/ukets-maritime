package uk.gov.mrtm.api.workflow.request.flow.payment.transform;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.common.exception.BusinessException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class MrtmRequestTypePaymentDescriptionResolverTest {

   private MrtmRequestTypePaymentDescriptionResolver resolver;

   @BeforeEach
   void setUp() {
       resolver = new MrtmRequestTypePaymentDescriptionResolver();
   }

   @Test
   void shouldReturnDescriptionForKnownRequestType() {
       // when
       String description = resolver.resolveDescription(MrtmRequestType.DOE);

       // then
       assertThat(description).isEqualTo("Pay emissions determination fee");
   }

   @Test
   void shouldThrowExceptionForUnknownRequestType() {
       // when/then
       assertThatThrownBy(() -> resolver.resolveDescription("UNKNOWN_TYPE"))
               .isInstanceOf(BusinessException.class)
               .hasMessageContaining("Resource not found");
   }
}
