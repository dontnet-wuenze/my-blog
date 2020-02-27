import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Post {

    @PrimaryColumn()
    author: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    pv: number = 0;
}

/*
author: { type: Mongolass.Types.ObjectId, required: true },
title: { type: 'string', required: true },
content: { type: 'string', required: true },
pv: { type: 'number', default: 0 }*/