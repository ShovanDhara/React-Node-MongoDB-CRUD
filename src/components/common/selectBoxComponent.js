import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        minWidth: 150
    },
    formControl: {
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const SelectInput = ({ id, name, onChange, placeholder, value, options = [] }) => {
    const classes = useStyles();
    return (
        <div className={classes.root} >
            <FormControl variant="filled" className={'cw-select ' + classes.formControl}>
                <InputLabel htmlFor={id}>{placeholder}</InputLabel>
                <Select
                    value={value}
                    onChange={onChange}
                    inputProps={{
                        name: name,
                        id: id
                    }}>
                    <MenuItem value="" disabled>
                        {placeholder}
                    </MenuItem>
                    {options.map((option) => {
                        return <MenuItem key={option.value} value={option.value}>{option.text}</MenuItem>
                    })
                    }
                </Select>
            </FormControl>
        </div>
    );
};

SelectInput.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object)
};

export default SelectInput;