import TestWeave from 'testweave-sdk';
import Arweave from 'arweave';
import { createContract, readContract, interactWrite, interactRead, interactWriteDryRun } from 'smartweave';
import fs from 'fs';
import contractInitState from './fixtures/did.json';

// npx ts-mocha ./tests/test.test.ts
describe('testing SmartWeave interactions', function (): void {
    this.timeout(200000);
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
        const contractSource = fs.readFileSync('./tests/fixtures/did.js').toString();
        // console.log(contractSource);
        // create the contract and mine the transaction for creating it
        const c = await createContract(arweave, testWeave.rootJWK, contractSource, JSON.stringify(contractInitState));
        await testWeave.mine();

        console.log("contractId is:" + c);

        // read the contract before performing any interaction
        const beforeTransaction = await readContract(arweave, c);
        console.log(`Before interact write: ${JSON.stringify(beforeTransaction)}`)

        // generate a wallet
        const jkw = await arweave.wallets.generate();
        const generatedAddr = await arweave.wallets.getAddress(jkw)

        const rootAddr = await arweave.wallets.getAddress(testWeave.rootJWK);
        console.log("rootAddr:" + rootAddr)

        // interact with the contract
        const iwt = await interactWrite(arweave, testWeave.rootJWK, c, {
            function: 'register',
            address: "address",
            name: "hardy"
        }, [], generatedAddr, '23999392')
        console.log(`Interact write transaction: ${JSON.stringify(iwt)}`);

        // mine the contract interaction transaction
        await testWeave.mine();

        const name = await interactRead(arweave, testWeave.rootJWK, c, {
            function: 'getName',
            address: "address"
        });

        console.log("name--->:", name);

        // get the new balance of the generated address (it should be 23999392)
        const generatedAddressBalance = await arweave.wallets.getBalance(generatedAddr)
        console.log(generatedAddressBalance)

        // read the contract after the interact write transaction (the generated wallet should own 5000 tokens)
        const afterTransaction = await readContract(arweave, c);
        console.log(`After interact write: ${JSON.stringify(afterTransaction)}`);
        // return;
    });

});

