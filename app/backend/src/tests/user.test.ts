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

describe('Faz login com sucesso com os dados válidos', async () => {
  let chaiHttpResponse: Response;

  const body = {
    email: 'admin@admin.com',
    password: 'secret_admin',
  };

  before(async () => {
    sinon.stub(UserModel, 'findOne').resolves(userAdminEmail as UserModel);

    chaiHttpResponse = await chai.request(app).post('/login').send(body);
  });

  after(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 200 na rota "/login" com body valido', async () => {
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Retorna message com token correto', async () => {
    expect(chaiHttpResponse.body).to.have.property('token');
  });
});

describe('Retorna mensagem de erro quando falta email ou password', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(UserModel, 'findOne').resolves(null);
  });

  after(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  });

  it('Quando falta email', async () => {
    const body = { password: 'secret_admin' };

    chaiHttpResponse = await chai.request(app).post('/login').send(body);

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body).to.have.property('message', 'All fields must be filled');
  });

  it('Quando falta password', async () => {
    const body = { email: 'admin@admin.com' };

    chaiHttpResponse = await chai.request(app).post('/login').send(body);

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body).to.have.property('message', 'All fields must be filled');
  });
});



describe('Retorna mensagem de erro quando usuario não está cadastrado', async () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(UserModel, 'findOne').resolves(null);
  });

  after(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  });

  it('Usuário não consta no banco de dados', async () => {
    const body = {
      email: 'admin@admin.com.br',
      password: 'secret_admin'
    }

    chaiHttpResponse = await chai.request(app).post('/login').send(body);

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.have.property('message', 'Incorrect email or password');
  })
});