import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";
export type gender = 'm'| 'f' | 'x';

@Entity()
export class User {

    @PrimaryColumn()
    name: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @Column({
        type : "enum",
        enum : ['m', 'f', 'x'],
        default : 'x'
    })
    gender : gender;

    @Column()
    bio : string;
}


/*name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }*/