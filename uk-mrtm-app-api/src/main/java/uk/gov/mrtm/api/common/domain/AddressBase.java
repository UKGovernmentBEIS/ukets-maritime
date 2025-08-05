package uk.gov.mrtm.api.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public abstract class AddressBase {

    /**
     * The line 1 address.
     */
    @Column(name = "address_line1")
    @NotBlank
    private String line1;

    /**
     * The line 2 address.
     */
    @Column(name = "address_line2")
    private String line2;

    /**
     * The city.
     */
    @Column(name = "city")
    @NotBlank
    private String city;

    /**
     * The country.
     */
    @Column(name = "country")
    @NotBlank
    private String country;
}
