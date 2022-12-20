// import TestWeave from '../src/index';
import TestWeave from 'testweave-sdk';

// import arweave from './_init_arweave';

// import { expect } from 'chai';
import Arweave from 'arweave';
import { createContract, readContract, interactWrite, interactWriteDryRun } from 'smartweave';
import fs from 'fs';
// import TestWeave from 'testweave-sdk';
// import contractInitState from 'token-pst-contract.json';
import contractInitState from './fixtures/token-pst-contract.json';

// npx ts-mocha ./tests/test.test.ts
describe('testing SmartWeave interactions', function (): void {
    this.timeout(20000);
    it('should correctly create a new SmartWeave contract', async (): Promise<void> => {

        const arweave = Arweave.init({
            host: 'localhost',
            port: 1984,
            protocol: 'http',
            timeout: 20000,
            logging: true,
        });

        const testWeave = await TestWeave.init(arweave);

        // import the sample contract init state
        // load the contract as a string
        const contractSource = fs.readFileSync('./tests/fixtures/token-pst-contract.js').toString();
        // console.log(contractSource);
        // create the contract and mine the transaction for creating it
        const c = await createContract(arweave, testWeave.rootJWK, contractSource, JSON.stringify(contractInitState));
        await testWeave.mine();
        return;
    });

});

