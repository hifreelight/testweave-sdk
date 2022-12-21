// A simple name system:
// Supports just one level of names.
// Supports associating a address with a name.

export function handle(state, action) {
    if (action.input.function === 'register') {
        ContractAssert(action.caller === state.owner, "Only the owner of this weeve can register");

        if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
            throw new ContractError(`Invalid name provided: ${action.input.name}`)
        }
        if (typeof action.input.address !== 'string' || action.input.address.length !== 42) {
            throw new ContractError(`Invalid address provided: ${action.input.name}`)
        }
        if (state.names[action.input.address]) {
            throw new ContractError('Address already registered')
        }
        if (state.addresses[action.input.name]) {
            throw new ContractError('Name already registered')
        }
        state.names[action.input.address] = action.input.name
        state.addresses[action.input.name] = action.input.address

        state.addrs.push(action.input.address);

        return { state }
    }

    if (action.input.function === 'getName') {
        if (typeof action.input.address !== 'string' || action.input.address.length !== 42) {
            throw new ContractError(`Invalid address provided: ${action.input.address}`)
        }
        if (!state.names[action.input.address]) {
            throw new ContractError('Name not registered')
        }

        return { result: { name: state.names[action.input.address] } }
    }

    if (action.input.function === 'getAddress') {
        if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
            throw new ContractError(`Invalid name provided: ${action.input.name}`)
        }
        if (!state.addresses[action.input.name]) {
            throw new ContractError('Name not registered')
        }

        return { result: { address: state.addresses[action.input.name] } }
    }

    if (action.input.function === 'getList') {
        const start = action.input.start
        const limit = action.input.limit

        return { result: { list: state.addrs.slice(start, start + limit), total: state.addrs.length } }
    }

    if (action.input.function === 'transferOwnership') {        
        ContractAssert(action.caller === state.owner, "Only the owner of this weeve can transfer ownership");

        state.owner = action.input.newOwner;
        
        return { state }
    }

    throw new ContractError('Invalid input')
}
