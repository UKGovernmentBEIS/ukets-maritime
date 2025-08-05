package uk.gov.mrtm.api.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisteredAddressState {

    /**
     * The line 1 registered address.
     */
    @Column(name = "reg_address_line1")
    private String line1;

    /**
     * The line 2 registered address.
     */
    @Column(name = "reg_address_line2")
    private String line2;

    /**
     * The registered city.
     */
    @Column(name = "reg_city")
    private String city;

    /**
     * The registered country.
     */
    @Column(name = "reg_country")
    private String country;

    @Column(name = "reg_postcode")
    private String postcode;

    @Column(name = "reg_state")
    private String state;
}
