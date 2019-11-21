/**
 * The callback executed when the hook action is triggered.
 *
 * @see https://pages.datanerd.us/wanda/wanda-ec-ui/v1/function/index.html#static-function-hook
 *
 * @example
 * export default function (hookArgs, extraArgs) {
 *     const { nr1 } = hookArgs.nerdletProps
 *
 *     nr1.paneManager.openNerdlet({
 *         //...
 *     })
 * }
 *
 * @param {HookArgs} hookArgs
 * @param {Object} extraArgs
 *
 * @return {void}
 */

import MessageBus from './MessageBus'

const messageBus = new MessageBus()

export default function(hookArgs, extraArgs) {
    return messageBus
}
