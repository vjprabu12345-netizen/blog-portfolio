// Express 4 doesn't catch rejected promises from async handlers on its own.
export default (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);