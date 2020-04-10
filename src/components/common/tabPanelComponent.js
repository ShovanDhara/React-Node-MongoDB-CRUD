import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div>
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                {...other}
            >
                <Box className="tab-content p-3">{children}</Box>
            </Typography>
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    // index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default TabPanel;