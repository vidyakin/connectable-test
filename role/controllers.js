const Role = require("./models");
const utils = require("../utils/index");
const { asyncRoutes, constantRoutes } = require("./permissions");

const routes = utils.deepClone([...constantRoutes, ...asyncRoutes]);

exports.all = async (req, res) => {
  const result = await Role.find();

  res.status(200).json(result);
};

exports.create = async (req, res) => {
  let role = new Role(req.body);
  try {
    role.key = role.name;
    await role.save();
    res.status(201).json({
      message: "Role has been created",
      role: role
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.response
    });
  }
};

exports.delete = async (req, res) => {
  try {
    await Role.remove({ _id: req.params.roleId });
    res.status(200).json({
      message: "Role deleted"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
};

exports.update = async (req, res) => {
  const id = req.body._id;
  const dataToUpdate = req.body;
  try {
      const result = await Role.updateOne({ _id: id }, { $set: dataToUpdate });
      res.status(200).json({
          message: "Role has been updated successfully!",
          result: result
      });
  }
  catch (err) {
      console.log(err);
      res.status(500).json({
          message: "SOMETHING WENT WRONG"
      });
  }

};

exports.all_routes = async (req, res) => {
  res.status(200).json(routes);
};
