import {Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";
import {User} from "../entity/User"
import {Post} from "../entity/Post"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    _id: number;

    @OneToOne(type => User)
    @JoinColumn()
    author: User;

    @Column()
    content: string;

    @OneToOne(type => Post)
    @JoinColumn()
    PoseId: Post;
}   