'use strict';

exports.createPages = require('./gatsby/create-pages');
exports.onCreateNode = require('./gatsby/on-create-node');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type mongodbNotduInfos implements Node {
      mongodb_id: String
      uuid: String!
      email: String
      password: String
      name: String
      bio: String
      avatar: String
      hash: String
      list: [Item]
    }
    type Item implements Node {
    name: String
    url: String
    }
  `;
  createTypes(typeDefs);
};
