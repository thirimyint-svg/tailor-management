// hash.js
const bcrypt = require("bcryptjs");

async function run() {
  const plain = "123456";           // 👈 password you want for the customer
  const hash = await bcrypt.hash(plain, 10);
  console.log("Plain:", plain);
  console.log("Hash :", hash);
}

run();