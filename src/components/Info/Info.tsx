// @flow strict
import React from 'react';
import styles from './Info.module.scss';
import type { NodeInfo } from '../../types';
import Avatar from './Avatar';
import Card from './Card/Card';

type Props = {
  info: NodeInfo
};



const Info = ({ info }: Props) => {
  // const { html } = info;
  // eslint-disable-next-line max-len
  // const { uid, title, name, photo, bio, email, facebook, telegram, twitter, github, linkedin, instagram, youtube, momo, bank, stk } = info.frontmatter;
  const profile = info.frontmatter;

  const data = {
    facebook: profile.facebook,
    instagram: profile.instagram,
    email: profile.email,
    phone: profile.phone,
    twitter: profile.twitter,
    telegram: profile.telegram,
    github: profile.github,
    linkedin: profile.linkedin,
    youtube: profile.youtube,
    momo: profile.momo,
    tiktok: profile.tiktok,
  };


  return (
    <div className={styles["info"]}>
      <Avatar photo={profile.photo} bio={profile.bio} name={profile.name} />
      <div className={styles["container"]}>
        {
          Object.keys(data).map((key) => (
        <Card name={key} img={`${key}.png`} url={data[key]} />
          ))
        }
      </div>
    </div>
  );
};

export default Info;
