export const getExchangeRate = async (tokenSymbol: string, resultSymbol: string) => {
    return await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${tokenSymbol}&tsyms=${resultSymbol}&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`
    )
        .then((res) => res.json())
        .then((res) => res[resultSymbol]);
};
