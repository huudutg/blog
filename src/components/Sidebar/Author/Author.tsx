// @flow strict
import React from 'react';
import { withPrefix, Link } from 'gatsby';
import styles from './Author.module.scss';

type Props = {
  author: {
    name: string,
    bio: string,
    photo: string
  },
  isIndex?: boolean
};

const Author = ({ author, isIndex }: Props) => (
  <div className={styles["author"]}>
    {/* <Link to="/">
      <img
        src={withPrefix(author.photo)}
        className={styles["author__photo"]}
        width="110"
        height="110"
        alt={author.name}
      />
    </Link> */}
    <div className={styles["container"]}>
      <div className={styles["author2"]}>
        <a href="/">
          <img
            width="110"
            height="110"
            src={withPrefix(author.photo)}
            // src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/751678/skytsunami.png"
            alt="Skytsunami"
          />
        </a>
      </div>
    </div>

    {isIndex === true ? (
      <h1 className={styles["author__title"]}>
        <Link className={styles["author__title-link"]} to="/">
          {author.name}
        </Link>
      </h1>
    ) : (
      <h2 className={styles["author__title"]}>
        <Link className={styles["author__title-link"]} to="/">
          {author.name}
        </Link>
      </h2>
    )}
    <p className={styles["author__subtitle"]}>{author.bio}</p>
  </div>
);

export default Author;
