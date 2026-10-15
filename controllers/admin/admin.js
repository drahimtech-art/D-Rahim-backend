const express = require("express");
const analyticsData = require("../../modules/admin/Analytics");
const portfolioProjectData = require("../../modules/admin/portfolioProjects");
const multer = require("multer");
const path = require("path");
const adminRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./storage/studentsProfileImages");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadMiddleware = multer({ storage: storage });
adminRouter.get("/requst/validate", async (req, res) => {
  try {
    res.status(200).json({ ok: true, message: "admin successful" });
  } catch (error) {
    console.log(`server error in admin requst validation section : ${error}`);
    res.status(500).json({ ok: false, message: `server error : ${error}` });
  }
});
adminRouter.post("/requst/get/analytics/website/data", async (req, res) => {
  try {
    const body = req.body;
    if (!body)
      return res.status(400).json({
        ok: false,
        message: "invalid reqs body one. required body but got known",
      });
    const dateFilterList = body.dateFilterList;
    if (!dateFilterList)
      if (!body)
        return res.status(400).json({
          ok: false,
          message:
            "invalid reqs body one. required dateFilterList propaty but got known",
        });
    const totalAnalyticsDataScore = await analyticsData
      .find({ dateMonthYearDate: { $in: dateFilterList } })
      .lean();
    let joinAnalyticsData = {
      _id: "",
      dateMonthYearDate: "",
      liveVistors: 0,
      newUsers: 0,
      pageViewed: 0,
      bouncedBackUsers: 0,
      returningUsers: 0,
      deviceType: {
        desktop: 0,
        mobile: 0,
        tablet: 0,
        other: 0,
        _id: "",
      },
      platformVisitedFrom: {
        facebook: 0,
        linkedIn: 0,
        youtub: 0,
        tiktok: 0,
        behance: 0,
        instagram: 0,
        twitter: 0,
        google: 0,
        pintrest: 0,
        other: 22,
        _id: "",
      },
      __v: 0,
    };
    totalAnalyticsDataScore.forEach((data) => {
      // damn thats a whole lots of mutation
      joinAnalyticsData.liveVistors += data.liveVistors;
      joinAnalyticsData.newUsers += data.newUsers;
      joinAnalyticsData.pageViewed += data.pageViewed;
      joinAnalyticsData.bouncedBackUsers += data.bouncedBackUsers;
      joinAnalyticsData.deviceType.desktop += data.deviceType.desktop;
      joinAnalyticsData.deviceType.mobile += data.deviceType.mobile;
      joinAnalyticsData.deviceType.tablet += data.deviceType.tablet;
      joinAnalyticsData.deviceType.other += data.deviceType.other;
      joinAnalyticsData.platformVisitedFrom.facebook +=
        data.platformVisitedFrom.facebook;
      joinAnalyticsData.platformVisitedFrom.linkedIn +=
        data.platformVisitedFrom.linkedIn;
      joinAnalyticsData.platformVisitedFrom.youtub +=
        data.platformVisitedFrom.youtub;
      joinAnalyticsData.platformVisitedFrom.tiktok +=
        data.platformVisitedFrom.tiktok;
      joinAnalyticsData.platformVisitedFrom.behance +=
        data.platformVisitedFrom.behance;
      joinAnalyticsData.platformVisitedFrom.instagram +=
        data.platformVisitedFrom.instagram;
      joinAnalyticsData.platformVisitedFrom.twitter +=
        data.platformVisitedFrom.twitter;
      joinAnalyticsData.platformVisitedFrom.google +=
        data.platformVisitedFrom.google;
      joinAnalyticsData.platformVisitedFrom.pintrest +=
        data.platformVisitedFrom.pintrest;
      joinAnalyticsData.platformVisitedFrom.other +=
        data.platformVisitedFrom.other;
    });
    res.status(200).json({
      ok: true,
      message: "succesfully got back analytics data",
      data: joinAnalyticsData,
    });
  } catch (error) {
    console.log(
      `server error in admin requst get analytics datat section : ${error}`,
    );
    res.status(500).json({ ok: false, message: `server error : ${error}` });
  }
});
adminRouter.post(
  "/requst/search/filter/get/proftfolio/data/list",
  async (req, res) => {
    try {
      const body = req.body;
      if (!body)
        return res.status(400).json({
          ok: false,
          message: "invalid reqs body one. required body but got known",
        });
      const searchFilterKeyWords = body.searchWordsList;
      const filterStatus = body.filterStatus;
      const queryFilter = [];
      if (searchFilterKeyWords.trim() !== "") {
        const findData = await portfolioProjectData
          .find({ $text: { $search: searchFilterKeyWords } })
          .sort({ createdAt: -1 })
          .lean();
        findData.forEach((value) => {
          if (filterStatus.trim() === "All") {
            queryFilter.push(value);
          } else {
            if (value.projectStatus === filterStatus.trim()) {
              queryFilter.push(value);
            }
          }
        });
      } else {
        if (filterStatus.trim() === "All") {
          const findData = await portfolioProjectData
            .find()
            .sort({ createdAt: -1 })
            .lean();
          findData.forEach((value) => {
            queryFilter.push(value);
          });
        } else {
          const findData = await portfolioProjectData
            .find({ projectStatus: filterStatus })
            .sort({ createdAt: -1 })
            .lean();
          findData.forEach((value) => {
            queryFilter.push(value);
          });
        }
      }
      res.status(200).json({
        ok: true,
        message:
          queryFilter.length > 0
            ? "succesfully got back portfolio data"
            : "No records match filter query",
        data: queryFilter,
      });
    } catch (error) {
      console.log(
        `server error in admin requst get analytics datat section : ${error}`,
      );
      res.status(500).json({ ok: false, message: `server error : ${error}` });
    }
  },
);
adminRouter.post(
  "/requst/upload/new/portfolio/project",
  uploadMiddleware.single("projectImage"),
  async (req, res) => {
    try {
      const body = JSON.parse(req.body.body);
      const file = req.file;
      if (!body)
        return res.status(400).json({
          ok: false,
          message: "invalid reqs body. required body but got known",
        });
      const projectData = body;
      if (!projectData)
        return res.status(400).json({
          ok: false,
          message:
            "invalid reqs body. required projectData propaty but got known",
        });
      if (!file)
        return res.status(400).json({
          ok: false,
          message:
            "invalid reqs body. required projectData image but got known",
        });
      const imageUrl = `http://${req.headers.host}/studentsProfileImages/${file && file.filename}`;
      const newProject = await portfolioProjectData.insertOne({
        pImage: imageUrl,
        title: projectData.title,
        about: projectData.about,
        heading: projectData.heading,
        sImage: imageUrl,
        capabilities: projectData.capabilities,
        duration: projectData.duration,
        team: projectData.team,
        location: projectData.location,
        industry: projectData.industry,
        projectType: projectData.projectType,
        creationDate: new Date(),
        projectStatus: "Active",
      });
      if (!newProject)
        return res.status(500).json({
          ok: false,
          message: "failed create new portfolio project data",
        });
      res.status(200).json({
        ok: true,
        message: "succesfully created new portfolio project data",
        projectData: newProject,
      });
    } catch (error) {
      console.log(
        `server error in admin requst upload new portfolio project section : ${error}`,
      );
      res.status(500).json({ ok: false, message: `server error : ${error}` });
    }
  },
);
module.exports = adminRouter;
