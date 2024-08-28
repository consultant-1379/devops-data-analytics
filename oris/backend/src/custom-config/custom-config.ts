import { registerAs } from '@nestjs/config';

export const ElasticSearchConfig = registerAs('elasticsearch', () => ({
  nodeUrl: 'https://elastic.hahn130.rnd.gic.ericsson.se' || '',
  username: 'EIAPREG100' || '',
  password: 'CztvYwveBHUp8A2UQtBxDxsB' || '',
  primaryIndex: process.env.PRIMARY_ELASTIC_INDEX || '',
  secondaryIndex: process.env.SECONDARY_ELASTIC_INDEX || '',
  testIndex: process.env.TEST_INDEX || ''
}));



  

