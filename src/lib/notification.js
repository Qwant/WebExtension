/*global chrome*/
/*global browser*/
import React from 'react';

const b = chrome || browser

const send = (id, title, message, icon, callback) => {
    b.notifications.create(id, {
        type : 'basic',
        title,
        message,
        iconUrl : icon,
        priority : 2
    }, () => {
        callback()
    })
};

const notif = (component) => {
    return (props, content) => {
        return React.createElement(component, {
            notif: {
                send
            }, ...props
        }, content)
    }
};

export default notif