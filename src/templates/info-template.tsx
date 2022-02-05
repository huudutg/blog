// @flow strict
import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { useSiteMetadata } from "../hooks";
import type { MarkdownRemark, NodeInfo } from "../types";
import Info from "../components/Info";
import LayoutInfo from '../components/Layout/LayoutInfo';

type Props = {
  data: {
    markdownRemark: NodeInfo;
  };
};

const InfoTemplate = ({ data }: Props) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const { frontmatter } = data.markdownRemark;
  const {
    title: postTitle,
    bio
  } = frontmatter;
  const metaDescription = bio || siteSubtitle;
  const socialImageUrl = "";
  console.log('%c data', 'color: blue;', data);
  return (
    <LayoutInfo
      title={`${postTitle} - ${siteTitle}`}
      description={metaDescription}
      socialImage={socialImageUrl || ""}
    >
      <Info info={data.markdownRemark} />
    </LayoutInfo>
  );
};

export const query = graphql`
  query InfoByUID($uid: String!) {
    markdownRemark(frontmatter: { uid: { eq: $uid } }) {
      id
      frontmatter {
        uid
        title
        name
        photo
        bio
        email
        facebook
        telegram
        twitter
        github
        linkedin
        instagram
        youtube
        phone
        momo
        bank
        stk
        tiktok
      }
    }
  }
`;

export default InfoTemplate;
