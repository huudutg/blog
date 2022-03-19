// @flow strict
import React from 'react';
import styles from './Info.module.scss';
import Avatar from './Avatar';
import Card from './Card/Card';
import { IInfo } from "../../templates/info-template";

type Props = {
    info: IInfo
};

const Info = ({ info }: Props) => (
    <div className={styles["info"]}>
        <Avatar photo={info.avatar} bio={info.bio} name={info.name}/>
        <div className={styles["container"]}>
            {info.list
                && info.list.map((value, index) => (
                    <Card key={index} name={value.name} url={value.url}/>
                ))}
            <a href={`https://edit.notdu.com/info/${info.uuid}`} className={styles["button_create"]}>
                Edit Information
            </a>
        </div>
    </div>
);

export default Info;
