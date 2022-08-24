import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/team.model';
import { allTeams, ferroviariaTeam } from './mocks/team.model.mock';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Retorna todos os times corretamente', async () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(TeamModel, 'findAll').resolves(allTeams as TeamModel[]);

    chaiHttpResponse = await chai.request(app).get('/teams');
  });

  after(() => {
    (TeamModel.findAll as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 200 na rota "/teams"', async () => {
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Retorna quantidade correta de times', async () => {
    expect(chaiHttpResponse.body).to.have.lengthOf(16);
    expect(chaiHttpResponse.body).to.deep.equal(allTeams);
  });
});

describe('Retorna time correto por id', async () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(TeamModel, 'findOne').resolves(ferroviariaTeam as TeamModel);

    chaiHttpResponse = await chai.request(app).get('/teams/6');
  });

  after(() => {
    (TeamModel.findOne as sinon.SinonStub).restore();
  });

  it('Retorna status 200 quando requisição tem sucesso', () => {
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('o time retornado tem id = 6', () => {
    expect(chaiHttpResponse.body).to.have.property('id', 6);
  });

  it('O nome do time é ferroviaria quando o id é 6', () => {
    expect(chaiHttpResponse.body).to.have.property('teamName', 'Ferroviária');
  });
});

describe('Quando id não existe', async () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(TeamModel, 'findOne').resolves(null);

    chaiHttpResponse = await chai.request(app).get('/teams/60');
  });

  after(() => {
    (TeamModel.findOne as sinon.SinonStub).restore();
  });

  it('Retorna status 404 quando requisição não tem sucesso', () => {
    expect(chaiHttpResponse).to.have.status(404);
  });

  it('o retorno tem a mensagem correta', () => {
    expect(chaiHttpResponse.body).to.have.property('message', 'Team not found');
  });
});

describe('Quando id é impróprio', async () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(TeamModel, 'findOne').rejects();

    chaiHttpResponse = await chai.request(app).get('/teams/asdas');
  });

  after(() => {
    (TeamModel.findOne as sinon.SinonStub).restore();
  });

  it('Retorna status 500 quando requisição não tem sucesso', () => {
    expect(chaiHttpResponse).to.have.status(500);
  });

  it('o retorno tem a mensagem correta', () => {
    const { body } = chaiHttpResponse;
    expect(body.message).to.include('Error');
  });
});
