const async_hooks = require('async_hooks');

function debugasync(){
    const activeResources = new Map();

    const hook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId) {
        const stackTrace = new Error().stack;
        activeResources.set(asyncId, { type, triggerAsyncId, stackTrace });
    },
    destroy(asyncId) {
        activeResources.delete(asyncId);
    },
    });

    hook.enable();

    setInterval(() => {
    console.log('Active async resources:', activeResources);
    }, 30 * 1000);
}

module.exports = debugasync;