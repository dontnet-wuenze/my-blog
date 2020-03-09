问题描述
=======

typeorm 中用了relation API 进行关联表的操作

```typescript
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

    @ManyToOne(type => User)
    author: User;
}
```

如上```@ManyToOne```就添加了一个多对单的关联

获取关联表单有两种方式
```typescript
post = await postRepository.findOne(postId, {relations : ["author"]});
```

另一种是用```querybuilder```, 更加灵活
```typescript
comments = await commentRepository
                    .createQueryBuilder("comment")
                    .leftJoinAndSelect("comment.author", "author")
                    .leftJoinAndSelect("comment.post", "post")
                    .where("post._id = :_id", {_id : postId})
                    .getMany();
```

这里的```leftjoin```,```innerjoin```也是与```sql```语句对应的