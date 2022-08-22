import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/user.model';
import { userAdminEmail } from './mocks/user.model.mock';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Seu teste', async () => {
  let chaiHttpResponse: Response;

  const body = {
    "email": "admin@admin.com",
    "password": "secret_admin"
  };

   before(async () => {
     sinon
       .stub(UserModel, "findOne")
       .resolves(
         userAdminEmail as UserModel);

  chaiHttpResponse = await chai
    .request(app)
    .post('/login')
    .send(body);
   });

  after(()=>{
    (UserModel.findOne as sinon.SinonStub).restore();
  })

  it('Testa se retorna status 200 na rota "/login" com body valido', async () => {
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Retorna message com token correto', async () => {
    expect(chaiHttpResponse.body).to.have.property('token');
  });

});
