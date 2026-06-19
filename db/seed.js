require("dotenv").config();

const bcrypt = require("bcryptjs");
const { Admin } = require("../models");

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "";
  const name = (process.env.ADMIN_NAME || "Primary Admin").trim();
  const phone = (process.env.ADMIN_PHONE || "").trim();

  if (!email || !password) {
    console.warn("Skipping admin seed: ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    return null;
  }

  const existingAdmin = await Admin.findOne({ where: { email } });

  const passwordHash = await bcrypt.hash(password, 10);

  if (existingAdmin) {
    if (!existingAdmin.passwordHash) {
      await existingAdmin.update({
        name: name || existingAdmin.name,
        phone: phone || existingAdmin.phone,
        isRoot: true,
        address: existingAdmin.address || null,
        passwordHash,
      });
    }

    return existingAdmin;
  }

  const createdAdmin = await Admin.create({
    name,
    phone,
    email,
    isRoot: true,
    address: null,
    passwordHash,
  });

  return createdAdmin;
}

module.exports = seedAdmin;
