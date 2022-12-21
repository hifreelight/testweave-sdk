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
        // create the contract and mine the transaction for creating it
        // const c = await createContract(arweave, testWeave.rootJWK, contractSource, JSON.stringify(contractInitState));
        // await testWeave.mine();

        const c = "p8k7I_EdA_jQhUU62hMqX8sjNhUubTobjhcx4M3O0Ck";

        console.log("contractId is:" + c);

        // read the contract before performing any interaction
        const beforeTransaction = await readContract(arweave, c);
        console.log(`Before interact write: ${JSON.stringify(beforeTransaction)}`)

        // generate a wallet
        const jkw = await arweave.wallets.generate();
        const generatedAddr = await arweave.wallets.getAddress(jkw)

        const rootAddr = await arweave.wallets.getAddress(testWeave.rootJWK);
        console.log("rootAddr:" + rootAddr)

        // const address = "0xd2B4A003E2AF99f89fe77b779F3eC7c76d951edF"
        // const did = "hardy"

        const address = "0xE3Bd3C1C841D2D708fCAc75eD38d6B322A96ab3b"
        const did = "hardy2"

        // interact with the contract
        const iwt = await interactWrite(arweave, testWeave.rootJWK, c, {
            function: 'register',
            address,
            name: did
        }, [], generatedAddr, '23999392')
        console.log(`Interact write transaction: ${JSON.stringify(iwt)}`);

        // mine the contract interaction transaction
        await testWeave.mine();

        const name = await interactRead(arweave, testWeave.rootJWK, c, {
            function: 'getName',
            address
        });

        console.log("name--->:", name);

        const list = await interactRead(arweave, testWeave.rootJWK, c, {
            function: 'getList',
            start: 0,
            limit: 10
        });

        console.log("list--->:", list);

        // get the new balance of the generated address (it should be 23999392)
        const generatedAddressBalance = await arweave.wallets.getBalance(generatedAddr)
        console.log(generatedAddressBalance)

        // const devAddress = "F6DVusN8dThej8I-sRXvhCFW207KX3wrzE8p0tSYG3w";
        const devAddress = "07jSQ_oPaDrnP61DXRMnSkchNuEH-NbmjM-Turl6fME";
        // interact with the contract
        const iwtOwner = await interactWrite(arweave, testWeave.rootJWK, c, {
            function: 'transferOwnership',
            newOwner: devAddress,
        }, [], devAddress, '1000')
        console.log(`Interact write transaction transferOwnership: ${JSON.stringify(iwtOwner)}`);

        await testWeave.mine();

        // read the contract after the interact write transaction (the generated wallet should own 5000 tokens)
        const afterTransaction = await readContract(arweave, c);
        console.log(`After interact write: ${JSON.stringify(afterTransaction)}`);


        return;
    });

});

