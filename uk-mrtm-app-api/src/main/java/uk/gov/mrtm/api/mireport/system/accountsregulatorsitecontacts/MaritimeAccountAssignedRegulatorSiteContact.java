package uk.gov.mrtm.api.mireport.system.accountsregulatorsitecontacts;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.mireport.system.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class MaritimeAccountAssignedRegulatorSiteContact extends AccountAssignedRegulatorSiteContact {


    @JsonProperty(value = "IMO number")
    private String imoNumber;


    public static List<String> getColumnNames() {
        List<String> columnNames = new ArrayList<>(AccountAssignedRegulatorSiteContact.getColumnNames());
        columnNames.add("IMO number");
        return Collections.unmodifiableList(columnNames);
    }
}
