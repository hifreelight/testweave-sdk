// A simple name system:
// Supports just one level of names.
// Supports associating a address with a name.

// Note: this is untested example atm.

// TODO: require a minimum reward or burn of Ar to register a name.

export function handle(state, action) {
    if (action.input.function === 'register') {
        ContractAssert(action.caller === state.owner, "Only the owner of this weeve can register");

        if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
            throw new ContractError(`Invalid name provided: ${action.input.name}`)
        }
        if (typeof action.input.address !== 'string') {
            throw new ContractError('Must provide address to be associated with the name')
        }
        if (state.names[action.input.name]) {
            throw new ContractError('Name already registered')
        }
        state.names[action.input.name] = {
            address: action.input.address
        }
        state.addresses[action.input.address] = {
            name: action.input.name
        }

        return { state }
    }

    if (action.input.function === 'update') {
        ContractAssert(action.caller === state.owner, "Only the owner of this weeve can register");

        if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
            throw new ContractError(`Invalid name provided: ${action.input.name}`)
        }
        if (typeof action.input.address !== 'string') {
            throw new ContractError('Must provide address to be associated with the name')
        }
        if (!state.names[action.input.name]) {
            throw new ContractError('Name not registered')
        }

        state.names[action.input.name] = {
            address: action.input.address
        }
        state.addresses[action.input.address] = {
            name: action.input.name
        }

        state.addrs.push(action.input.address);

        return { state }
    }

    if (action.input.function === 'getName') {
        if (typeof action.input.address !== 'string') {
            throw new ContractError(`Invalid address provided: ${action.input.address}`)
        }
        if (!state.names[action.input.address]) {
            throw new ContractError('Name not registered')
        }

        return state.names[action.input.address]
    }

    if (action.input.function === 'getAddress') {
        if (typeof action.input.name !== 'string' || action.input.name.length < 3) {
            throw new ContractError(`Invalid name provided: ${action.input.name}`)
        }
        if (!state.names[action.input.name]) {
            throw new ContractError('Name not registered')
        }

        return state.names[action.input.name]
    }

    if (action.input.function === 'getList') {
        const start = action.input.start
        const limit = action.input.limit

        return { result: state.addrs.slice(start, start + limit), total: state.addrs.length}
    }

    throw new ContractError('Invalid input')
}
