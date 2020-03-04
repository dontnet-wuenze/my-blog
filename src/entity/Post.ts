import {Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";
import {User} from "../entity/User"

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column({default : 0})
    pv: number;

    @OneToOne(type => User)
    @JoinColumn()
    author: User;
}

/*
author: { type: Mongolass.Types.ObjectId, required: true },
title: { type: 'string', required: true },
content: { type: 'string', required: true },
pv: { type: 'number', default: 0 }*/