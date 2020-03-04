import {Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";
import {User} from "../entity/User"
import {Post} from "../entity/Post"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    content: string;

    @ManyToOne(type => User)
    author: User;

    @ManyToOne(type => Post)
    PostId: Post;
}   