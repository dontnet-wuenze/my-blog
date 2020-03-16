import "reflect-metadata";
import {User, Gender} from "../src/entity/User"
import { getRepository } from "typeorm";
import {createConnection} from "typeorm";
const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../src/index')

const testName1 = 'testName1'
const testName2 = 'nswbmw'

createConnection().then(async connection => {
  const UserRepository = getRepository(User);

  let user = await UserRepository.findOne({"_id" : 1});
  console.log(user);
  console.log(typeof(user.gender));
  
  describe('signup', function () {
    describe('POST /signup', function () {
      const agent = request.agent(app)// persist cookie when redirect

      beforeEach(async function() {
        let user = {
          ame: testName1,
          password: '123456',
          avatar: '',
          gender: 2,
          bio: ''
        }
        await UserRepository.insert(user);
      })

      afterEach(async function () {
        // 删除测试用户
        await UserRepository.delete({name : testName1 || testName2 });
      })

      after(function (done) {
        process.exit()
      })

      // 用户名错误的情况
      it('wrong name', async function () {
        agent
          .post('/signup')
          .type('form')
          .field({ name: '' })
          .attach('avatar', path.join(__dirname, 'avatar.png'))
          .redirects()
          .end(function (err, res) {
            if (err) return err
            assert(res.text.match(/名字请限制在 1-10 个字符/))
          })
      })

      // 性别错误的情况
      it('wrong gender', function (done) {
        agent
          .post('/signup')
          .type('form')
          .field({ name: testName2, gender: 'a' })
          .attach('avatar', path.join(__dirname, 'avatar.png'))
          .redirects()
          .end(function (err, res) {
            if (err) return done(err)
            assert(res.text.match(/性别只能是 m、f 或 x/))
            done()
          })
      })
      // 其余的参数测试自行补充
      // 用户名被占用的情况
      it('duplicate name', function (done) {
        agent
          .post('/signup')
          .type('form')
          .field({ name: testName1, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
          .attach('avatar', path.join(__dirname, 'avatar.png'))
          .redirects()
          .end(function (err, res) {
            if (err) return done(err)
            assert(res.text.match(/用户名已被占用/))
            done()
          })
      })

      // 注册成功的情况
      it('success', function (done) {
        agent
          .post('/signup')
          .type('form')
          .field({ name: testName2, gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
          .attach('avatar', path.join(__dirname, 'avatar.png'))
          .redirects()
          .end(function (err, res) {
            if (err) return done(err)
            assert(res.text.match(/注册成功/))
            done()
          })
      })
    })
  })
}).catch(error => console.log(error));