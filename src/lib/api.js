import React from 'react';

import config from '../config/config'

const { API } = config

const api = (component) => {
    return (props, content) => {
        return React.createElement(component, {
            api: {
            }, ...props
        }, content)
    }
};

export default api

