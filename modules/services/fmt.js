/**
 * Formatting for API Response
 *
 * @param {*} data Response data
 * @param {*} msg Response Msg
 * @returns object with error, data and message
 */
const apiFmt = (data = {}, msg = null, err = false,details=[]) => {
    if (data instanceof Error) {
        err = true;
        msg = msg.message;
        data = null;
    }
    return {
        err,
        msg,
        data,
        details
    };
};

module.exports = {
    apiFmt,
};
