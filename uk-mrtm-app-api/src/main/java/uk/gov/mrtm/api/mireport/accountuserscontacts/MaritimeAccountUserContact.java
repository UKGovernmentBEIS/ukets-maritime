package uk.gov.mrtm.api.mireport.accountuserscontacts;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.mireport.accountuserscontacts.AccountUserContact;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class MaritimeAccountUserContact extends AccountUserContact {

    @JsonProperty(value = "Is User Secondary contact?")
    private Boolean secondaryContact;

    @JsonProperty(value = "Is User Financial contact?")
    private Boolean financialContact;

    @JsonProperty(value = "Is User Service contact?")
    private Boolean serviceContact;

    @JsonProperty(value = "Permit ID")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String permitId;

    @JsonProperty(value = "IMO number")
    private String imoNumber;

    public static List<String> getColumnNames() {
        List<String> columnNames = new ArrayList<>(AccountUserContact.getColumnNames());
        columnNames.add("IMO number");
        columnNames.add("Is User Secondary contact?");
        columnNames.add("Is User Financial contact?");
        columnNames.add("Is User Service contact?");
        columnNames.add("Permit ID");
        return Collections.unmodifiableList(columnNames);
    }
}
