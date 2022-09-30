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
    //get Accs and APIs
    const acc = await ethereum.request({
        method: "eth_accounts",
    });

    const resWl = await (
        await fetch("https://moonmoonz-api.up.railway.app/wl/" + acc[0])
    ).json();

    const resVIP = await (
        await fetch("https://moonmoonz-api.up.railway.app/vip/" + acc[0])
    ).json();

    //check if WL or VIP
    if (acc.length) {
        if (resWl.proof) {
            console.log(resWl.proof);
            alert("You are whitelisted!");
        } else if (resVIP.proof) {
            console.log(resVIP.proof);
            alert("You are VIP!");
        } else {
            console.error(resWl.error);
            console.error(resVIP.error);
            alert("Not VIP or Whitelisted!");
        }
    } else {
        console.log("Metamask is not connected");
    }

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
