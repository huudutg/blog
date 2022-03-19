// @flow strict
import React from 'react';
import { getContactHref, getContactURL } from '../../../utils';
import styles from "./Card.module.scss";
import { options } from "../../../types";

type Props = {
    name: string;
    url: string;
};

function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

const getImgURL = (name: string) => {
  const url = options.find((option: any) => option.value.toLowerCase() === name.toLowerCase());
  if (url) {
    return `/media/social/${url.value.toLowerCase()}.png`;
  }
  return "/media/social/default.png";
};

const Card = ({ name, url }: Props) => (
    <div className={styles["cards"]} style={{ display: url ? "" : "none" }}>
        <a href={getContactHref(name, url || "")} className={styles["cards__wrap"]}>
            <div className={styles["cards__wrap--icon"]}>
                <img
                    width="55px"
                    height="55px"
                    src={getImgURL(name)}
                    alt={name}
                />
            </div>
            <div className={styles["cards__wrap--content"]}>
                <p className={styles["cards__wrap--content-title"]}>
                    {capitalizeFirstLetter(name)}
                </p>
                <p className={styles["cards__wrap--content-url"]}>
                    {getContactURL(name) + url}
                </p>
            </div>
        </a>
    </div>
);

export default Card;
