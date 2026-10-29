const express = require("express");
const homeRouter = express.Router();
const portfolioProjectData = require("../../modules/admin/portfolioProjects");
const notificationsData = require("../../modules/admin/notifications");
const bookingServiceData = require("../../modules/admin/bookingService");
//devmode
const createStaticPortfolioProject = async () => {
  try {
    const doesDataExist = await portfolioProjectData.find().lean().limit(10);
    if (doesDataExist.length !== 0)
      return console.log("data exist skipping work flow");

    const projectsList = [
      {
        pImage: "http://localhost:5000/ourworkImage/p1.png",
        title: "Wankard Moblie App 🇳🇬",
        about:
          "Wankard is a fintech app focused on creating a clean, accessible, and efficient platform for day to day transactions.",
        heading:
          "Creating seamless, secure, and accessible financial solutions for everyday transactions.",
        sImage: "http://localhost:5000/ourworkImage/p1.png",
        capabilities: [
          "UI/UX Design",
          "Mobile App Design",
          "Fintech Strategy",
          "User Research",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Fintech Digital Payments"],
        creationDate: new Date(),
        projectType: "Moblie Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/3.png",
        title: "Snap Moblie App",
        about:
          "This case study showcases our end-to-end UX design process from research and wireframing to prototyping and final UI design.",
        heading:
          "Creating faster, smarter, and more connected mobile experiences for everyday communication.",

        sImage: "http://localhost:5000/ourworkImage/p3.png",
        capabilities: [
          "UI/UX Design",
          "Mobile App Design",
          "Fintech Strategy",
          "User Research",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Mobile Technology", "Communication"],
        projectType: "Branding",
        creationDate: new Date(),
        projectType: "Moblie Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/2.png",
        title: "Jobified Moblie App 🇳🇬",
        about:
          "Creating a job-matching platform designed to bridge the gap between job seekers and employers through a smooth, user-centered experience.",
        heading:
          "Creating smarter pathways to career growth, opportunity, and seamless job connections.",

        sImage: "http://localhost:5000/ourworkImage/p2.png",
        capabilities: [
          "UI/UX Design",
          "Mobile App Design",
          "Fintech Strategy",
          "User Research",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Recruitment Career Technology"],
        eprojectType: "Branding",
        creationDate: new Date(),
        projectType: "Moblie Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/12.png",
        title: "Health PocketMoblie App 🇳🇬",
        about:
          "Health in Pocket is a mobile health companion designed to put essential healthcare services directly in the hands of users.",
        heading:
          "Creating faster, smarter, and more meaningful communication experiences for everyday conversations.",

        sImage: "http://localhost:5000/ourworkImage/p12.png",
        capabilities: [
          "UI/UX Design",
          "Messaging Experience Design",
          "User Research",
          "Moblie App Design",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "Developer"],
        location: "Nigeria",
        industry: ["Communication Technology", "Social Networking"],
        creationDate: new Date(),
        projectType: "Moblie Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/5.png",
        title: "Travel Express Moblie App",
        about:
          "Travel express is a travel experience platform designed to simplify trip planning and enhance the way users explore new destinations",
        heading:
          "Creating seamless travel experiences through smarter booking, planning, and journey management.",

        sImage: "http://localhost:5000/ourworkImage/p5.png",
        capabilities: [
          "UI/UX Design",
          "Mobile App Design",
          "Fintech Strategy",
          "User Research",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Travel Technology", "Transportation"],
        projectType: "Branding",
        creationDate: new Date(),
        projectType: "Moblie Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/11.png",
        title: "Mobile Design ",
        about:
          "VitaCare is a digital healthcare platform designed to simplify access to medical services and help users to manage their health anytime.",
        heading:
          "Creating accessible healthcare solutions that connect people to better care and wellness.",
        sImage: "http://localhost:5000/ourworkImage/p11.png",
        capabilities: [
          "UI/UX Design",
          "Healthcare Experience",
          "User Research",
          "Mobile App Design",
        ],
        duration: "3months",
        team: [
          "Product Designer",
          "UI Designer",
          "Healthcare Research",
          "Developer",
        ],
        location: "Nigeria",
        industry: ["HealthTech", "Healthcare"],
        projectType: "Branding",
        creationDate: new Date(),
        projectType: "Moblie Design",
        projectStatus: "Active",
      },

      {
        pImage: "http://localhost:5000/ourworkImage/p9.png",
        title: "Xnora Web App 🇳🇬",
        about:
          "Xnora is a modern web platform built for seamless deployment and efficient performance. It provides a clean, environment for deployment",
        heading:
          "Empowering businesses to deploy, manage, and scale digital products with speed and efficiency.",
        sImage: "http://localhost:5000/ourworkImage/p9.png",
        capabilities: [
          "UI/UX Design",
          "Web Platform Design",
          "Developer Experience",
          "Product Strategy",
        ],
        duration: "3months",
        team: [
          "Product Designer",
          "UI Designer",
          "Developer",
          "Product Strategist",
        ],
        location: "Nigeria",
        industry: ["Cloud Technology", "Software Development"],
        creationDate: new Date(),
        projectType: "Website Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/4.png",
        title: "Finance All Website 🇦🇺🇺🇸",
        about:
          "A financial dashboard designed to provide a clear, real-time overview of personal and business finances. It delivers insights and analytics. ",
        heading:
          "Creating smarter financial insights, seamless tracking, and better money management for everyone.",

        sImage: "http://localhost:5000/ourworkImage/p4.png",
        capabilities: [
          "UI/UX Designer",
          "Finacial Dashboard Design",
          "Data Visualization",
          "User Research",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Fintech", "Financial Analytics"],
        creationDate: new Date(),
        projectType: "Website Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/10.png",
        title: "Pdf to word web app 🇳🇬",
        about:
          "PDF to Word is a simple and efficient tool for converting PDF files into fully editable Word documents while preserving layout and formatting.",
        heading:
          "Simplifying document conversion through speed, accuracy, and seamless accessibility.",

        sImage: "http://localhost:5000/ourworkImage/p10.png",
        capabilities: [
          "UI/UX Design",
          "Document Conversion Flow",
          "Product Research",
          "Web App Design",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "Developer"],
        location: "Nigeria",
        industry: ["Productivity Tools", "Document Technology"],
        creationDate: new Date(),
        projectType: "Website Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/0.png",
        title: "Alhafeez foundation web App 🇳🇬🇬🇫",
        about:
          "A non-profit organization dedicated to providing support, resources, and opportunities to underserved communities through sustainable initiatives.",
        heading:
          "Creating pathways of hope, support, and sustainable change for underserved communities.",

        sImage: "http://localhost:5000/ourworkImage/p0.png",
        capabilities: [
          "Community Support",
          "Humanitarian Aid",
          "Education Programes",
        ],
        duration: "3months",
        team: ["Program Coordinator", "Volunteers", "Community Leaders"],
        location: "Nigeria",
        industry: ["Non-profit Organization", "Humanitarian Services"],
        creationDate: new Date(),
        projectType: "Website Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/14.png",
        title: "Razor Web App 🇧🇪🇬🇧🏝️",
        about:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and intuitive interface.",
        heading:
          "Creating secure and seamless authentication experiences for modern digital platforms.",
        sImage: "http://localhost:5000/ourworkImage/p14.png",
        capabilities: [
          "UI/UX Design",
          "Mobile App Design",
          "Fintech Strategy",
          "User Research",
        ],
        duration: "2months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Cybersecurity", "Authentication Technology"],
        creationDate: new Date(),
        projectType: "Website Design",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/16.png",
        title: "NYSC Redesign web App ",
        about:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and intuitive interface.",
        heading:
          "Transforming youth service operations through seamless digital experiences, accessibility, and efficiency.",

        sImage: "http://localhost:5000/ourworkImage/p16.png",
        capabilities: [
          "UI/UX Design",
          "System Resign",
          "User Research",
          "Product Strategy",
        ],
        duration: "4months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Government Technology", "Public Services"],
        creationDate: new Date(),
        projectType: "Website Design",
        projectStatus: "Active",
      },

      {
        pImage: "http://localhost:5000/ourworkImage/0.png",
        title: "Alhafeez foundation web App 🇳🇬🇬🇫",
        about:
          "A non-profit organization dedicated to providing support, resources, and opportunities to underserved communities through sustainable initiatives.",
        heading:
          "Creating pathways of hope, support, and sustainable change for underserved communities.",

        sImage: "http://localhost:5000/ourworkImage/p0.png",
        capabilities: [
          "Community Support",
          "Humanitarian Aid",
          "Education Programes",
        ],
        duration: "3months",
        team: ["Program Coordinator", "Volunteers", "Community Leaders"],
        location: "Nigeria",
        industry: ["Non-profit Organization", "Humanitarian Services"],

        creationDate: new Date(),
        projectType: "Branding",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/14.png",
        title: "Razor Web App 🇧🇪🇬🇧🏝️",
        about:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and intuitive interface.",
        heading:
          "Creating secure and seamless authentication experiences for modern digital platforms.",
        sImage: "http://localhost:5000/ourworkImage/p14.png",
        capabilities: [
          "UI/UX Design",
          "Mobile App Design",
          "Fintech Strategy",
          "User Research",
        ],
        duration: "2months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Cybersecurity", "Authentication Technology"],
        creationDate: new Date(),
        projectType: "Branding",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/6.png",
        title: "Face Scan Mobile App 🇬🇫",
        about:
          " a biometric authentication system that enables secure and seamless user verification using facial recognition technology.",
        heading:
          "Creating secure identity verification through fast, seamless, and intelligent facial recognition.",
        sImage: "http://localhost:5000/ourworkImage/p6.png",
        capabilities: [
          "UI/UX Design",
          "Biometric Authentication",
          "Security Research",
          "Mobile Experience Design",
        ],
        duration: "2months",
        team: ["Product Designer", "UI Designer", "Developer"],
        location: "Nigeria",
        industry: ["Security Technology", "Biometic Solutions"],
        creationDate: new Date(),
        projectType: "Branding",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/17.png",
        title: "Home Architect web App🇳🇬",
        about:
          "A design platform that helps users plan, visualize, and create functional home layouts through an intuitive and user-friendly interface.",
        heading:
          "Transforming ideas into functional living spaces through smart design and visualization.",
        sImage: "http://localhost:5000/ourworkImage/p17.png",
        capabilities: [
          "UI/UX Design",
          "Architecture Planning",
          "3D Visualization",
          "Product Research",
        ],
        duration: "3months",
        team: [
          "Product Designer",
          "UI Designer",
          "Architectural Consultant",
          "Developer",
        ],
        location: "Nigeria",
        industry: ["Architecture", "Real Estate Tecnology"],
        creationDate: new Date(),
        projectType: "Branding",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/4.png",
        title: "Finance All Website 🇦🇺🇺🇸🇺",
        about:
          "A financial dashboard designed to provide a clear, real-time overview of personal and business finances. It delivers insights and analytics. ",
        heading:
          "Creating smarter financial insights, seamless tracking, and better money management for everyone.",

        sImage: "http://localhost:5000/ourworkImage/p4.png",
        capabilities: [
          "UI/UX Designer",
          "Finacial Dashboard Design",
          "Data Visualization",
          "User Research",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "UX Researcher", "Developer"],
        location: "Nigeria",
        industry: ["Fintech", "Financial Analytics"],

        creationDate: new Date(),
        projectType: "Branding",
        projectStatus: "Active",
      },
      {
        pImage: "http://localhost:5000/ourworkImage/10.png",
        title: "Pdf To Word Web App 🇳🇬",
        about:
          "PDF to Word is a simple and efficient tool for converting PDF files into fully editable Word documents while preserving layout and formatting.",
        heading:
          "Simplifying document conversion through speed, accuracy, and seamless accessibility.",

        sImage: "http://localhost:5000/ourworkImage/p10.png",
        capabilities: [
          "UI/UX Design",
          "Document Conversion Flow",
          "Product Research",
          "Web App Design",
        ],
        duration: "3months",
        team: ["Product Designer", "UI Designer", "Developer"],
        location: "Nigeria",
        industry: ["Productivity Tools", "Document Technology"],
        creationDate: new Date(),
        projectType: "Branding",
        projectStatus: "Active",
      },
    ];
    const sendCreateDataRequst =
      await portfolioProjectData.insertMany(projectsList);
  } catch (error) {
    console.log(
      "Got Error while trying to create static portfolio project :",
      error,
    );
  }
};
createStaticPortfolioProject();
//
//middleware
const validateclient = async (req, res, next) => {
  try {
    const clientKey = req.headers["x-frontend-key"];
    if (!clientKey || clientKey !== process.env.CLIENT_HOME_KEY)
      return res
        .status(403)
        .json({ ok: false, message: "no or invalide client key" });
    next();
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
    console.log(`server error: ${error}`);
  }
};
homeRouter.get("/ourwork/projectlist", validateclient, async (req, res) => {
  try {
    const getPortfolioProjectList = await portfolioProjectData.find();
    const portfolioCaltigoryProjectList = {
      moblieDesign: [],
      websiteDesign: [],
      branding: [],
    };
    for (let i = 0; i < getPortfolioProjectList.length; i++) {
      if (getPortfolioProjectList[i].projectType === "Moblie Design") {
        portfolioCaltigoryProjectList.moblieDesign.push(
          getPortfolioProjectList[i],
        );
      } else if (getPortfolioProjectList[i].projectType === "Website Design") {
        portfolioCaltigoryProjectList.websiteDesign.push(
          getPortfolioProjectList[i],
        );
      } else if (getPortfolioProjectList[i].projectType === "Branding") {
        portfolioCaltigoryProjectList.branding.push(getPortfolioProjectList[i]);
      }
    }
    res.status(200).json({
      ok: true,
      message: "succesful",
      list: portfolioCaltigoryProjectList,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
    console.log(`server error: ${error}`);
  }
});
//
function validateEmail(e) {
  if (typeof e !== "string") return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(e.trim());
}
//middleware
async function validateClientServiceRequstDataBody(req, res, next) {
  try {
    const body = req.body;
    if (!body)
      return res
        .status(400)
        .json({ ok: false, message: "invalide requst body, body is empty" });
    if (
      !body.date ||
      !body.time ||
      !body.clientFullName ||
      !body.jobTitle ||
      !body.email ||
      !body.phoneNumber ||
      !body.companyName ||
      !body.aboutProject ||
      !body.trafficSource
    )
      return res.status(400).json({
        ok: false,
        message: "invalide requst body, one or more fileds are missing",
      });
    if (!validateEmail(body.email))
      return res.status(400).json({
        ok: false,
        message: "invalide requst body, required a valide email address",
      });
    next();
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
    console.log(
      `server error while validating client service requst data : ${error}`,
    );
  }
}
//
homeRouter.post(
  "/api/client/requst/service",
  validateclient,
  validateClientServiceRequstDataBody,
  async (req, res) => {
    try {
      const body = req.body;
      const clientBookingInfo = {
        date: body.date,
        time: body.time,
        clientFullName: body.clientFullName,
        jobTitle: body.jobTitle,
        email: body.email,
        phoneNumber: body.phoneNumber,
        companyName: body.companyName,
        aboutProject: body.aboutProject,
        trafficSource: body.trafficSource,
        status: false,
      };
      const createBookingData =
        await bookingServiceData.insertOne(clientBookingInfo);
      if (!createBookingData)
        return res.status(500).json({
          ok: false,
          message: `server error: somting went wrong can't proccess your requst at this time`,
        });
      //
      const notificationSchema = {
        title: "New Booking",
        content: clientBookingInfo.jobTitle,
        date: new Date(),
        isAction: false,
        url: "",
        isViewed: false,
      };
      const createNotifcation =
        await notificationsData.insertOne(notificationSchema);
      if (!createNotifcation)
        return res
          .status(500)
          .json({ ok: false, message: `server error: somting went wrong` });
    } catch (error) {
      res.status(500).json({ ok: false, message: `server error: ${error}` });
      console.log(`server error while creating client bookings: ${error}`);
    }
  },
);
module.exports = homeRouter;
