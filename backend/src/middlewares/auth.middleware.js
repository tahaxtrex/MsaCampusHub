

export const protectRoute = (req, res, next) => {
  if (req.session.userId) return next();
  res.status(401).json({ message: 'Not authenticated' });
}