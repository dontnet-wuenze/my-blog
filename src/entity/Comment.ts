import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    author: number;

    @Column()
    content: string;

    @Column()
    postId: number;
}   