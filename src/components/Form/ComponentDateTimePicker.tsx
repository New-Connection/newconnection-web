import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { IDatePicker } from "./types";
export const ComponentDateTimePicker = ({ label, className }) => {
    const [value, setValue] = React.useState<Date | null>(new Date());

    return (
        <div className={className}>
            <div className={"input-label"}>{label}</div>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    value={value}
                    onChange={(newValue) => {
                        console.log(newValue);
                        setValue(newValue);
                    }}
                    className={className}
                />
            </LocalizationProvider>
        </div>
    );
};
