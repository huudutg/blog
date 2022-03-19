// @flow strict
import React from "react";
import { withPrefix } from "gatsby";
import type { Edges } from "../../types";
import styles from "./Feed.module.scss";

type Props = {
  edges: Edges;
};

const Feed = ({ edges }: Props) => {
  console.log("%c edges", "color: blue;", edges);

  const calculateReadingTime = (text: string) => {
    const wpm = 350;
    const words = text ? text.trim().split(/\s+/).length : 1000;
    return Math.ceil(words / wpm);
  };
  return (
    <div className={styles["feed"]}>
      {edges.map((edge) => (
        <div className={styles["feed__item"]} key={edge.node.fields.slug}>
          <div className={styles["feed__item-wrap"]}>
            <div className={styles["feed__item-wrap-meta"]}>
              <div className={styles["content"]}>
                <a
                  href={edge.node.fields.slug}
                  className={styles["content__wrap"]}
                >
                  <div className={styles["content__wrap-title"]}>
                    {edge.node.frontmatter.title}
                  </div>
                  <div className={styles["content__wrap-description"]}>
                    <div
                      className={styles["content__wrap-description-content"]}
                    >
                      {edge.node.frontmatter.description}
                    </div>
                  </div>
                </a>
                <a
                  href={edge.node.fields.slug}
                  className={styles["content-img"]}
                >
                  <img
                    height="135"
                    width="216"
                    loading="lazy"
                    src={
                      edge.node.frontmatter.thumbnail
                        ? withPrefix(edge.node.frontmatter.thumbnail)
                        : edge.node.frontmatter.socialImage
                    }
                    alt={edge.node.frontmatter.title}
                  />
                </a>
              </div>
              <div className={styles["info"]}>
                <span className={styles["info__wrap"]}>
                  <span className={styles["info__wrap-content"]}>
                    {new Date(edge.node.frontmatter.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </span>
                <div className={styles["info__dot"]}>
                  <span className={styles["info__dot-content"]}>.</span>
                </div>
                <div className={styles["info__wrap"]}>
                  <span className={styles["info__wrap-content"]}>
                    {calculateReadingTime(edge.node.html)} min read
                  </span>
                </div>
                <div className={styles["info__dot"]}>
                  <span className={styles["info__dot-content"]}>.</span>
                </div>
                <a
                  href={edge.node.fields.categorySlug}
                  className={styles["info__category"]}
                >
                  <div className={styles["info__category-content"]}>
                    {edge.node.frontmatter.category}
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
