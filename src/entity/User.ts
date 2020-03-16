import {Entity, PrimaryGeneratedColumn, Column, PrimaryColumn} from "typeorm";
export enum Gender {
    'm',
    'f',
    'x'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    _id : number;

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
    gender : Gender;

    @Column()
    bio : string;
}


/*name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true }*/