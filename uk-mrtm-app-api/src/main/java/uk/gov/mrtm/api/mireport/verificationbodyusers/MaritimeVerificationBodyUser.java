package uk.gov.mrtm.api.mireport.verificationbodyusers;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaritimeVerificationBodyUser {

    @JsonProperty(value = "Verification body name")
    private String verificationBodyName;

    @JsonProperty(value = "Account status")
    private String accountStatus;

    @JsonProperty(value = "Accreditation reference number")
    private String accreditationReferenceNumber;

    @JsonProperty(value = "User role")
    private String role;

    @JsonProperty(value = "User status")
    private String authorityStatus;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String userId;

    public static List<String> getColumnNames() {
        return List.of("Verification body name", "Account status", "Accreditation reference number",
                "User role", "User status");
    }
}
