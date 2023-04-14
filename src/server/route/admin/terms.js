const moment = require("moment");
const { adminFunctions } = require("../../functions/adminFunctions");
const { v4: uuidv4 } = require("uuid");
const routes = require("express").Router();
const mongoose = require('mongoose')
const termsSchema = mongoose.model("termsSchema")

routes.get("/", adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    pageOptions = {
      title: "Пользовательское соглашение",
      layout: "adminLayout",
      setting: global.CONFIG_APP,
    };

    pageOptions.terms = await termsSchema.findOne({ _id: 'entityId' }).lean();
    if (pageOptions.terms == null) {
      await new termsSchema({
        _id: 'entityId'
      }).save();
      pageOptions.terms = await termsSchema.findOne({ _id: 'entityId' }).lean();
    };
    const {BANK_DETAILS} = pageOptions.terms;
    pageOptions.rows =  BANK_DETAILS ? BANK_DETAILS.split("\n").length : 5;

  res.render("admin_terms", pageOptions);
});
routes.post("/", adminFunctions.checkAuthentication, async (req, res) => {
  const {body} = req;
  var queryParams = adminFunctions.getMainParams(req),pageOptions = {
      title: "Пользовательское соглашение",
      layout: "adminLayout",
      setting: global.CONFIG_APP,
    };
    await termsSchema.findOneAndUpdate({_id:'entityId'}, body, async function (err, result) {
      if (err) {
        console.log(err)
      }
    });
    pageOptions.terms = await termsSchema.findOne({ _id: 'entityId' }).lean();
    const {BANK_DETAILS} = pageOptions.terms;
    pageOptions.rows = BANK_DETAILS.split("\n").length ? BANK_DETAILS.split("\n").length : 5;

    res.render("admin_terms", pageOptions);
  });

module.exports = routes;
