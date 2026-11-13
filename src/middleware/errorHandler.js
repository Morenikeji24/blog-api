export default (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON body" });
  }
  if (err.code === "P2002")
    return res.status(409).json({ error: "Already exists" });
  if (err.code === "P2025") return res.status(404).json({ error: "Not found" });
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
