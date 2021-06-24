/*global chrome*/
/*global browser*/
import React from 'react';

const b = chrome || browser

const set = (page) => {
    b.storage.local.set({ page });
};

const get = (callback) => {
    b.storage.local.get('page', res => {
        callback(res.page);
    });
};

const pages = (component) => {
    return (props, content) => {
        return React.createElement(component, {
            pages: {
                set, get
            }, ...props
        }, content)
    }
};

export default pages
