/*global chrome*/
/*global browser*/
import React from 'react';

const b = chrome || browser

const set = (key, value) => {
    b.storage.local.set({ [key]: JSON.stringify(value) });
};

const get = (key, callback) => {
    b.storage.local.get(key, res => {
        if (res[key] === undefined) {
            return callback();
        }
        try {
            callback(JSON.parse(res[key]));
        } catch (e) {
            callback()
        }
    });
};

const storage = (component) => {
    return (props, content) => {
        return React.createElement(component, {
            storage: {
                set, get
            }, ...props
        }, content)
    }
};

export default storage
