import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { userAdminEmail } from './mocks/user.model.mock';

import { Response } from 'superagent';
import UserModel from '../database/models/user.model';
import TokenHandler from '../middlewares/token.handler';

chai.use(chaiHttp);

const { expect } = chai;

describe('Rota login/validate', () => {
  let chaiHttpResponse: Response;

  describe('com token correto', () => {
    const headers = {
      authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiJzZWNyZXRfYWRtaW4ifSwiaWF0IjoxNjYxODcxMTg4LCJleHAiOjE2NjI0NzU5ODh9.L1BIknXDyrxcpU8kowJ8sGYR7iYNM0r2UJeMg9uwQFY',
    };

    before(async () => {
      sinon.stub(UserModel, 'findOne').resolves(userAdminEmail as UserModel);
      chaiHttpResponse = await chai.request(app).get('/login/validate').set(headers);
    });

    after(() => {
      (UserModel.findOne as sinon.SinonStub).restore();
    });

    it('retorna status 200 e "role" correta', async () => {
      expect(chaiHttpResponse).to.have.status(200);
      expect(chaiHttpResponse.body).to.have.property('role', 'admin');
    });
  });

  describe('com token incorreto', () => {
    const headers = {
      authorization: 'abc12345679',
    };

    before(async () => {
      sinon.stub(TokenHandler, 'decodeToken').resolves(false);
      chaiHttpResponse = await chai.request(app).get('/login/validate').set(headers);
    });

    after(() => {
      (TokenHandler.decodeToken as sinon.SinonStub).restore();
    });

    it('retorna mensagem de erro', async () => {
      expect(chaiHttpResponse).to.have.status(404);
      expect(chaiHttpResponse.body).to.have.property('message', 'Invalid token');
    });
  });
});
