// @flow strict
import React from 'react';
import ReactDisqusComments from 'react-disqus-comments';
import { useSiteMetadata } from '../../../hooks';
import { getContactHref } from '../../../utils';
import styles from "./Card.module.scss";

type Props = {
  name: string;
  img: string;
  url: string;
};

function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

const Card = ({ name, img, url }: Props) => (
  <div className={styles["cards"]} style={{ display: url ? "" : "none" }}>
    <a href={getContactHref(name, url || "")} className={styles["cards__wrap"]}>
      <div className={styles["cards__wrap--icon"]}>
        <img
          width="55px"
          height="55px"
          src={`/media/social/${img}`}
          alt="instagram"
        />
      </div>
      <p className={styles["cards__wrap--title"]}>
        {capitalizeFirstLetter(name)}
      </p>
    </a>
  </div>
);

export default Card;
