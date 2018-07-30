



function initialize() {
    try {
        /** Only work for electron/node js environment, browser environment doesn't work */
        window.$ = require('jquery');
        window.jQuery = require('jquery');
        window.electron = require('electron');
        window.os = require('os');
        window.fs = require('fs');
        window.glob = require('glob');
    } catch (e) {
        console.log(e);

        /** */
        
    }
}

initialize();