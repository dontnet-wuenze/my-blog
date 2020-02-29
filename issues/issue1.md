问题描述
=======

我使用的是 typeorm 框架，当我希望实现对表中某些值进行加减操作时

只通过querybuider貌似没有很简便的方法

所以可以利用manager API 的 increment 函数

实现操作如下

```typescript
const manager = repository.manager;

await manager.increment(User, { firstName: "Timber" }, "age", 3);
```

这是比较简单的操作

如果要进行复杂的操作可以对 repository 进行客制化

完整的API可以参考

<https://typeorm.io/#/>
