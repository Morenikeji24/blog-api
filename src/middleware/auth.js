import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAuthor = (req, res, next) => {
  if (req.user?.role !== "AUTHOR") {
    return res.status(403).json({ error: "Author access required" });
  }
  next();
};
