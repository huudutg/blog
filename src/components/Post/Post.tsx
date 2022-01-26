// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import Author from './Author';
import Comments from './Comments';
import Content from './Content';
import Tags from './Tags';
import styles from './Post.module.scss';
import type { Node } from '../../types';

type Props = {
  post: Node
};

const Post = ({ post }: Props) => {
  const { html } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date, description } = post.frontmatter;

  return (
    <div className={styles["post"]}>
      <div className={styles["post__button"]}>
        <Link className={styles["post__button-btn56"]} to="/">
          Not Dự Blog
        </Link>
      </div>

      <div className={styles["post__content"]}>
        <Content
          body={html}
          title={title}
          date={date}
          description={description}
        />
      </div>

      <div className={styles["post__footer"]}>
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <Author />
      </div>

      <div className={styles["post__comments"]}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>
    </div>
  );
};

export default Post;
