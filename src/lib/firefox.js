/*global browser*/
import React from 'react';

const isFirefox = () => {
    try  {
        return !!browser
    } catch (e) {
        return false
    }
};

const firefox = (component) => {
    return (props, content) => {
        return React.createElement(component, {
            firefox: {
                isFirefox
            }, ...props
        }, content)
    }
};

export default firefox
