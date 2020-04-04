const path = require('path');
const chai = require('chai');
const sinonChai = require('sinon-chai');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });

chai.expect();
chai.use(sinonChai);
