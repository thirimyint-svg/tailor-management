exports.loginPage = (req, res) => {
  res.render("auth/login");
};

exports.loginPost = (req, res) => {
  // Temporary simple login (no DB yet)
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    req.session.user = { username };
    req.flash("success", "Login successful");
    return res.redirect("/dashboard");
  }

  req.flash("error", "Invalid username or password");
  return res.redirect("/login");
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};