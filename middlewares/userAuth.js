exports.requireUser = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please login first");
    return res.redirect("/user/login");
  }
  next();
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.session.admin) {
      req.flash("error", "Please login first");
      return res.redirect("/admin/login");
    }

    const role = req.session.admin.role || (req.session.admin.isRoot ? "root" : "admin");

    if (!allowedRoles.includes(role)) {
      req.flash("error", "You do not have permission to access this page");
      return res.redirect("/admin/dashboard");
    }

    next();
  };
};

exports.authorize = authorize;
exports.requireAdmin = authorize(["admin", "root"]);
exports.requireRoot = authorize(["root"]);

exports.requireGuestAdmin = (req, res, next) => {
  if (req.session.admin) {
    req.flash("info", "You are already logged in");
    return res.redirect("/admin/dashboard");
  }
  next();
};
