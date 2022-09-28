const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const moonMoonz = new ethers.Contract(
    ADDRESSES.MoonMoonz,
    ABIS.MoonMoonz,
    signer
);

// Connect wallet
async function connect() {
    await provider.send("eth_requestAccounts", []);
    window.location.reload();
}

// Mint `n` tokens
async function mint(n) {
    if (!(await getAddress())) return;
    await moonMoonz.claim(n, { value: PRICE.mul(n) });
}

// Get address if connected else return null
async function getAddress() {
    try {
        return await signer.getAddress();
    } catch {
        return null;
    }
}

// Get totalSupply
async function getTotalSupply() {
    try {
        return await moonMoonz.totalSupply();
    } catch {
        return 0;
    }
}
