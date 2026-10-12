const adminProfileData = require("../../modules/admin/adminProfile");
const bcrypt = require("bcryptjs");
async function createDefaultAdminIfKnownExist() {
  try {
    const doesAdminExist = await adminProfileData.find();
    if (doesAdminExist.length != 0)
      return console.log("admin exist skipping work flow");
    console.log("starting script");
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 11);
    const hashedEmail = await bcrypt.hash(process.env.ADMIN_EMAIL, 11);
    const newProfile = {
      image: "http://localhost:5000/companyImage.png",
      name: "D’RAHIM TECH INNOVATION",
      about: "Software Company",
      password: hashedPassword,
      email: hashedEmail,
    };
    const createAdmin = await adminProfileData.insertOne(newProfile);
    if (createAdmin) {
      console.log("succesfully created new admin");
    }
  } catch (error) {
    console.log(`server error while trying to create default admin :${error}`);
  }
}

module.exports = createDefaultAdminIfKnownExist;
