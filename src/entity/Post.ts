import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    _id: number;

    @PrimaryColumn()
    author: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({default : 0})
    pv: number;
}

/*
author: { type: Mongolass.Types.ObjectId, required: true },
title: { type: 'string', required: true },
content: { type: 'string', required: true },
pv: { type: 'number', default: 0 }*/