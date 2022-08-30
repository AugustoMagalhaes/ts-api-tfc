import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

import { matchMock, matchModelCreate, matchPatchMock, matchPostMock } from './mocks/match.model.mocks';

import MatchModel from '../database/models/match.model';
import MatchService from '../services/match.service';

chai.use(chaiHttp);

const { expect } = chai;

describe('Retorna todas as partidas corretamente', async () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(MatchModel, 'findAll').resolves(matchMock as any);

    chaiHttpResponse = await chai.request(app).get('/matches');
  });

  after(() => {
    (MatchModel.findAll as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 200 na rota "/matches"', async () => {
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Retorna quantidade correta de partidas', async () => {
    expect(chaiHttpResponse.body).to.have.lengthOf(3);
    expect(chaiHttpResponse.body).to.deep.equal(matchMock);
  });
});

describe('Testa criação de partida com token', async () => {
  let chaiHttpResponse: Response;
  const body = {
    homeTeam: 1,
    awayTeam: 12,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  };

  const headers = {
    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiJzZWNyZXRfYWRtaW4ifSwiaWF0IjoxNjYxODcxMTg4LCJleHAiOjE2NjI0NzU5ODh9.L1BIknXDyrxcpU8kowJ8sGYR7iYNM0r2UJeMg9uwQFY'
  }

  before(async () => {
    sinon.stub(MatchModel, 'create').resolves(matchModelCreate as MatchModel);

    chaiHttpResponse = await chai.request(app).post('/matches').set(headers).send(body);
  });

  after(() => {
    (MatchModel.create as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 201 na rota POST "/matches"', async () => {
    expect(chaiHttpResponse).to.have.status(201);
  });

  it('Retorna quantidade correta de partidas', async () => {
    expect(chaiHttpResponse.body).to.deep.equal(matchPostMock);
  });
});

describe('Testa alteração de dados da partida', async () => {
  let chaiHttpResponse: Response;
  
  const body = {
    homeTeam: 1,
    awayTeam: 12,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  };

  before(async () => {
    sinon.stub(MatchService, 'finishMatch').resolves(matchPatchMock as any);

    chaiHttpResponse = await chai.request(app).patch('/matches/2/finish');
  });

  after(() => {
    (MatchService.finishMatch as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 200 na rota PATCH "/matches/2/finish"', async () => {
    expect(chaiHttpResponse).to.have.status(200);
  });

  it('Retorna quantidade correta de partidas', async () => {
    expect(chaiHttpResponse.body).to.have.property('message', 'Finished');
  });
});

describe('Retorna erro interno de servidor se o model falha em "getAllMatches"', async () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon.stub(MatchModel, 'findAll').rejects();

    chaiHttpResponse = await chai.request(app).get('/matches');
  });

  after(() => {
    (MatchModel.findAll as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 500', async () => {
    expect(chaiHttpResponse).to.have.status(500);
  });

  it('Retorna mensagem de erro correta', async () => {
    expect(chaiHttpResponse.body).to.have.property('message', 'Something went wrong');
  });
});

describe('Não permite criar partida com times iguais', async () => {
  let chaiHttpResponse: Response;

  const body = {
    homeTeam: 12,
    awayTeam: 12,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  };

  const headers = {
    authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiJzZWNyZXRfYWRtaW4ifSwiaWF0IjoxNjYxODcxMTg4LCJleHAiOjE2NjI0NzU5ODh9.L1BIknXDyrxcpU8kowJ8sGYR7iYNM0r2UJeMg9uwQFY',
  };

  before(async () => {
    sinon.stub(MatchService, 'checkRepeatedTeam').resolves(true);

    chaiHttpResponse = await chai.request(app).post('/matches').set(headers).send(body);
  });

  after(() => {
    (MatchService.checkRepeatedTeam as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 401', 
    async () => {
    expect(chaiHttpResponse).to.have.status(401);
  });

  it('Retorna mensagem de erro correta', async () => {
    expect(chaiHttpResponse.body).to.have
      .property('message', 'It is not possible to create a match with two equal teams');
  });
});

describe('Testa erro generico com status 401 em POST "/matches"', async () => {
  let chaiHttpResponse: Response;

  const body = {
    homeTeam: 12,
    awayTeam: 13,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  };

  const headers = {
    authorization:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwicGFzc3dvcmQiOiJzZWNyZXRfYWRtaW4ifSwiaWF0IjoxNjYxODcxMTg4LCJleHAiOjE2NjI0NzU5ODh9.L1BIknXDyrxcpU8kowJ8sGYR7iYNM0r2UJeMg9uwQFY',
  };

  before(async () => {
    sinon.stub(MatchService, 'checkRepeatedTeam').rejects();

    chaiHttpResponse = await chai.request(app).post('/matches').set(headers).send(body);
  });

  after(() => {
    (MatchService.checkRepeatedTeam as sinon.SinonStub).restore();
  });

  it('Testa se retorna status 401', 
    async () => {
    expect(chaiHttpResponse).to.have.status(401);
  });

  it('Retorna mensagem de erro correta', async () => {
    expect(chaiHttpResponse.body).to.have
      .property('message', 'Error');
  });
});
