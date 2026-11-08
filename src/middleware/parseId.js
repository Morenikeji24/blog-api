export default (name) => (req, res, next) => {
  const n = Number(req.params[name]);
  if (!Number.isInteger(n) || n < 1) {
    return res.status(400).json({ error: `Invalid ${name}` });
  }
  req.params[name] = n;
  next();
};
