import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

import { matchMock } from './mocks/match.model.mocks';

import MatchModel from '../database/models/match.model';

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


