const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PortfolioProjectSchema = new Schema(
  {
    pImage: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    heading: { type: String, required: true },
    sImage: { type: String, required: true },
    capabilities: { type: Array, required: true },
    duration: { type: String, required: true },
    team: { type: Array, required: true },
    location: { type: String, required: true },
    industry: { type: Array, required: true },
    projectType: { type: String, required: true },
    creationDate: { type: String, required: true },
    projectStatus: { type: String, required: true },
  },
  { timestamps: true },
);

PortfolioProjectSchema.index({
  title: "text",
  projectType: "text",
  projectStatus: "text",
  creationDate: "text",
});
PortfolioProjectSchema.index({ projectStatus: 1 });
PortfolioProjectSchema.index({ createdAt: -1 });

const portfolioProjectData = mongoose.model(
  "admin_portfolioProject",
  PortfolioProjectSchema,
);

module.exports = portfolioProjectData;
