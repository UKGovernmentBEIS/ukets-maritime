package uk.gov.mrtm.api.migration;

import lombok.experimental.UtilityClass;

@UtilityClass
public class MigrationHelper {

    public static String constructMigrationErrorMessage(String recordImoNumber, String error){
        return "Error in csvRecord with imo number: " + recordImoNumber + " Reason: " + error;
    }

    public static String constructMigrationRowErrorMessage(String rowNumber, String error){
        return "Error in csvRecord with data: " + rowNumber + " Reason: " + error;
    }

}
