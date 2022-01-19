// @flow strict
import React from 'react';
import Meta from '../Meta';
import styles from './Content.module.scss';

type Props = {
  body: string,
  title: string,
  date: string,
  description?:string
};

const Content = ({ body, title, date, description }: Props) => (
  <div className={styles["content"]}>
    <h1 className={styles["content__title"]}>{title}</h1>
    <div className={styles["content__description"]}>{description}</div>
    <Meta date={date} />
    <div
      className={styles["content__body"]}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  </div>
);

export default Content;
