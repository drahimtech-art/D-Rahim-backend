const express = require("express");
const analyticsData = require("../../modules/admin/Analytics");
const portfolioProjectData = require("../../modules/admin/portfolioProjects");
const adminRouter = express.Router();

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
      const isStatusSearch = body.isStatusSearch;
      const queryFilter = [];
      if (!isStatusSearch) {
        const findData = await portfolioProjectData
          .find({ $text: { $search: searchFilterKeyWords } })
          .sort({ createdAt: -1 })
          .lean();
        findData.forEach((value) => {
          queryFilter.push(value);
        });
        console.log(findData);
      } else {
        const findData = await portfolioProjectData
          .find({ projectStatus: { $in: [filterStatus] } })
          .sort({ createdAt: -1 })
          .lean();
        findData.forEach((value) => {
          queryFilter.push(value);
        });
      }
      res.status(200).json({
        ok: true,
        message: "succesfully got back portfolio data",
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
module.exports = adminRouter;
