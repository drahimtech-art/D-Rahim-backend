const express = require("express");
const homeRouter = express.Router();
//devmode
const projectsList = () => {
  const workType = {
    moblieDesign: [
      {
        image: "http://localhost:5000/ourworkImage/p1.png",
        text: "Wankard Moblie App 🇳🇬",
        subText:
          "Wankard is a fintech app focused on creating a clean, accessible, and efficient platform for day to day transactions.",
        popUpHeadding:
          "Creating seamless, secure, and accessible financial solutions for everyday transactions.",
        popHeadText: "Wankard",
        popImageUrl: "http://localhost:5000/ourworkImage/p1.png",
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
        endText:
          "wankard is a fintech app focused on creating a clean, accessible, and efficient platform for day to day transactions",
      },
      {
        image: "http://localhost:5000/ourworkImage/3.png",
        text: "Snap Moblie App",
        subText:
          "This case study showcases our end-to-end UX design process from research and wireframing to prototyping and final UI design.",
        popUpHeadding:
          "Creating faster, smarter, and more connected mobile experiences for everyday communication.",
        popHeadText: "Snap Moblie",
        popImageUrl: "http://localhost:5000/ourworkImage/p3.png",
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
        endText:
          "Snap Mobile case study showcases our end-to-end UX design process from research and wireframing to prototyping and final UI design.",
      },
      {
        image: "http://localhost:5000/ourworkImage/2.png",
        text: "Jobified Moblie App 🇳🇬",
        subText:
          "Creating a job-matching platform designed to bridge the gap between job seekers and employers through a smooth, user-centered experience.",
        popUpHeadding:
          "Creating smarter pathways to career growth, opportunity, and seamless job connections.",
        popHeadText: "Jobified Employer",
        popImageUrl: "http://localhost:5000/ourworkImage/p2.png",
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
        endText:
          "Creating a job-matching platform designed to bridge the gap between job seekers and employers through a smooth, user-centered experience.",
      },
      {
        image: "http://localhost:5000/ourworkImage/12.png",
        text: "Health PocketMoblie App 🇳🇬",
        subText:
          "Health in Pocket is a mobile health companion designed to put essential healthcare services directly in the hands of users.",
        popUpHeadding:
          "Creating faster, smarter, and more meaningful communication experiences for everyday conversations.",
        popHeadText: "Target Message",
        popImageUrl: "http://localhost:5000/ourworkImage/p12.png",
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
        endText:
          "A mobile app designed to put essential end-to-end encrypted messaging in the hands of users",
      },
      {
        image: "http://localhost:5000/ourworkImage/5.png",
        text: "Travel Express Moblie App",
        subText:
          "Travel express is a travel experience platform designed to simplify trip planning and enhance the way users explore new destinations",
        popUpHeadding:
          "Creating seamless travel experiences through smarter booking, planning, and journey management.",
        popHeadText: "Travel Express",
        popImageUrl: "http://localhost:5000/ourworkImage/p5.png",
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
        endText:
          "Travel express is a travel experience platform designed to simplify trip planning and enhance the way users explore new destinations",
      },
      {
        image: "http://localhost:5000/ourworkImage/11.png",
        text: "Mobile Design ",
        subText:
          "VitaCare is a digital healthcare platform designed to simplify access to medical services and help users to manage their health anytime.",
        popUpHeadding:
          "Creating accessible healthcare solutions that connect people to better care and wellness.",
        popHeadText: "Vite-Care",
        popImageUrl: "http://localhost:5000/ourworkImage/p11.png",
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
        endText:
          "VitaCare is a digital healthcare platform designed to simplify access to medical services and help users to manage their health anytime.",
      },
    ],
    websiteDesign: [
      {
        image: "http://localhost:5000/ourworkImage/p9.png",
        text: "Xnora Web App 🇳🇬",
        subText:
          "Xnora is a modern web platform built for seamless deployment and efficient performance. It provides a clean, environment for deployment",
        popUpHeadding:
          "Empowering businesses to deploy, manage, and scale digital products with speed and efficiency.",
        popHeadText: "Xnora",
        popImageUrl: "http://localhost:5000/ourworkImage/p9.png",
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
        endText:
          "Xnora is a modern web platform built for seamless deployment and efficient performance. It provides a clean, enviroment for deployment.",
      },
      {
        image: "http://localhost:5000/ourworkImage/4.png",
        text: "Finance All Website 🇦🇺🇺🇸",
        subText:
          "A financial dashboard designed to provide a clear, real-time overview of personal and business finances. It delivers insights and analytics. ",
        popUpHeadding:
          "Creating smarter financial insights, seamless tracking, and better money management for everyone.",
        popHeadText: "Finance All",
        popImageUrl: "http://localhost:5000/ourworkImage/p4.png",
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
        endText:
          "A financial dashboard designed to provide a clear, real-time overview of personal and business finaces. it delivers insights and analytics.",
      },
      {
        image: "http://localhost:5000/ourworkImage/10.png",
        text: "Pdf to word web app 🇳🇬",
        subText:
          "PDF to Word is a simple and efficient tool for converting PDF files into fully editable Word documents while preserving layout and formatting.",
        popUpHeadding:
          "Simplifying document conversion through speed, accuracy, and seamless accessibility.",
        popHeadText: "Pdf to word",
        popImageUrl: "http://localhost:5000/ourworkImage/p10.png",
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
        endText:
          "PDF to Word is a simple and efficient tool for converting PDF files into fully editable Word documents while preserving layout and formatting",
      },
      {
        image: "http://localhost:5000/ourworkImage/0.png",
        text: "Alhafeez foundation web App 🇳🇬🇬🇫",
        subText:
          "A non-profit organization dedicated to providing support, resources, and opportunities to underserved communities through sustainable initiatives.",
        popUpHeadding:
          "Creating pathways of hope, support, and sustainable change for underserved communities.",
        popHeadText: "Alhafeez Foundation",
        popImageUrl: "http://localhost:5000/ourworkImage/p0.png",
        capabilities: [
          "Community Support",
          "Humanitarian Aid",
          "Education Programes",
        ],
        duration: "3months",
        team: ["Program Coordinator", "Volunteers", "Community Leaders"],
        location: "Nigeria",
        industry: ["Non-profit Organization", "Humanitarian Services"],
        endText:
          "Alhafeez foundation is a non-profit organization dedicated to providing support, resources, and opportunities to underserved communities through sustainable initiatives.",
      },
      {
        image: "http://localhost:5000/ourworkImage/14.png",
        text: "Razor Web App 🇧🇪🇬🇧🏝️",
        subText:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and intuitive interface.",
        popUpHeadding:
          "Creating secure and seamless authentication experiences for modern digital platforms.",
        popHeadText: "Razor",
        popImageUrl: "http://localhost:5000/ourworkImage/p14.png",
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
        endText:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and inteuitve interface",
      },
      {
        image: "http://localhost:5000/ourworkImage/16.png",
        text: "NYSC Redesign web App ",
        subText:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and intuitive interface.",
        popUpHeadding:
          "Transforming youth service operations through seamless digital experiences, accessibility, and efficiency.",
        popHeadText: "NYSC Redesign web App 🇳🇬",
        popImageUrl: "http://localhost:5000/ourworkImage/p16.png",
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
        endText:
          "A user-centered digital project aimed at improving the experience of corps members by simplifing processes, and modernizing the overall platform",
      },
    ],
    branding: [
      {
        image: "http://localhost:5000/ourworkImage/0.png",
        text: "Alhafeez foundation web App 🇳🇬🇬🇫",
        subText:
          "A non-profit organization dedicated to providing support, resources, and opportunities to underserved communities through sustainable initiatives.",
        popUpHeadding:
          "Creating pathways of hope, support, and sustainable change for underserved communities.",
        popHeadText: "Alhafeez Foundation",
        popImageUrl: "http://localhost:5000/ourworkImage/p0.png",
        capabilities: [
          "Community Support",
          "Humanitarian Aid",
          "Education Programes",
        ],
        duration: "3months",
        team: ["Program Coordinator", "Volunteers", "Community Leaders"],
        location: "Nigeria",
        industry: ["Non-profit Organization", "Humanitarian Services"],
        endText:
          "Alhafeez foundation is a non-profit organization dedicated to providing support, resources, and opportunities to underserved communities through sustainable initiatives.",
      },
      {
        image: "http://localhost:5000/ourworkImage/14.png",
        text: "Razor Web App 🇧🇪🇬🇧🏝️",
        subText:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and intuitive interface.",
        popUpHeadding:
          "Creating secure and seamless authentication experiences for modern digital platforms.",
        popHeadText: "",
        popImageUrl: "http://localhost:5000/ourworkImage/p14.png",
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
        endText:
          "A secure authentication system designed to provide fast, seamless, and reliable user access through a clean and inteuitve interface",
      },
      {
        image: "http://localhost:5000/ourworkImage/6.png",
        text: "Face Scan Mobile App 🇬🇫",
        subText:
          " a biometric authentication system that enables secure and seamless user verification using facial recognition technology.",
        popUpHeadding:
          "Creating secure identity verification through fast, seamless, and intelligent facial recognition.",
        popHeadText: "Face Scan",
        popImageUrl: "http://localhost:5000/ourworkImage/p6.png",
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
        endText:
          "a biometric authentication system that enables secure and seamless user verification using facial recognition technology",
      },
      {
        image: "http://localhost:5000/ourworkImage/17.png",
        text: "Home Architect web App🇳🇬",
        subText:
          "A design platform that helps users plan, visualize, and create functional home layouts through an intuitive and user-friendly interface.",
        popUpHeadding:
          "Transforming ideas into functional living spaces through smart design and visualization.",
        popHeadText: "Home Architect",
        popImageUrl: "http://localhost:5000/ourworkImage/p17.png",
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
        endText:
          "A design platform that helps users plan, visualize, and create functional home layouts through an intuitive and user-friendly interface.",
      },
      {
        image: "http://localhost:5000/ourworkImage/4.png",
        text: "Finance All Website 🇦🇺🇺🇸🇺",
        subText:
          "A financial dashboard designed to provide a clear, real-time overview of personal and business finances. It delivers insights and analytics. ",
        popUpHeadding:
          "Creating smarter financial insights, seamless tracking, and better money management for everyone.",
        popHeadText: "Finance All",
        popImageUrl: "http://localhost:5000/ourworkImage/p4.png",
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
        endText:
          "A financial dashboard designed to provide a clear, real-time overview of personal and business finaces. it delivers insights and analytics.",
      },
      {
        image: "http://localhost:5000/ourworkImage/10.png",
        text: "Pdf To Word Web App 🇳🇬",
        subText:
          "PDF to Word is a simple and efficient tool for converting PDF files into fully editable Word documents while preserving layout and formatting.",
        popUpHeadding:
          "Simplifying document conversion through speed, accuracy, and seamless accessibility.",
        popHeadText: "Pdf to word",
        popImageUrl: "http://localhost:5000/ourworkImage/p10.png",
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
        endText:
          "PDF to Word is a simple and efficient tool for converting PDF files into fully editable Word documents while preserving layout and formatting",
      },
    ],
  };
  return workType;
};
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
    const data = projectsList();
    res.status(200).json({ ok: true, message: "succesful", list: data });
  } catch (error) {
    res.status(500).json({ ok: false, message: `server error: ${error}` });
    console.log(`server error: ${error}`);
  }
});

module.exports = homeRouter;
