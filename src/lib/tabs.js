/*global chrome*/
/*global browser*/
import React from 'react';

const b = chrome || browser

const open = (url) => {
    b.tabs.create({
        url,
        active: true
    });
}

const tabs = (component) => {
    return (props, content) => {
        return React.createElement(component, {
            tabs: {
                open,
            }, ...props
        }, content)
    }
};

export default tabs
