const jwt = require("jsonwebtoken");

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Không có token",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Bạn không có quyền thực hiện hành động này",
        });
      }

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({
        message: "Token không hợp lệ",
      });
    }
  };
};

module.exports = authorize;
