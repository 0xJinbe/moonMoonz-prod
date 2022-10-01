const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const moonMoonz = new ethers.Contract(
	ADDRESSES.MoonMoonz,
	ABIS.MoonMoonz,
	signer
);

const moonMoonzRewarder = new ethers.Contract(
	ADDRESSES.MoonMoonzRewarder,
	ABIS.MoonMoonzRewarder,
	signer
);

/* -------------------------------------------------------------------------- */
/*                              General Functions                             */
/* -------------------------------------------------------------------------- */

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

// Get address if connected else return null
async function getAddress() {
	try {
		return await signer.getAddress();
	} catch {
		return null;
	}
}

/* -------------------------------------------------------------------------- */
/*                             MoonMoonz Functions                            */
/* -------------------------------------------------------------------------- */

// Claim `n` tokens during public sale
async function claim(n) {
	if (!(await getAddress())) return;
	await moonMoonz.claim(n, { value: PRICE.mul(n) });
}

// Claim 1 token during wl sale
async function claimWL() {
	const addr = await getAddress();
	if (!addr) return;

	const resWl = await (
		await fetch("https://moonmoonz-api.up.railway.app/wl/" + addr)
	).json();
	if ("error" in resWl) return;

	await moonMoonz.claimWL(resWl.proof);
}

// Claim 1 token during vip sale
async function claimVIP() {
	const addr = await getAddress();
	if (!addr) return;

	const resVIP = await (
		await fetch("https://moonmoonz-api.up.railway.app/vip/" + addr)
	).json();
	if ("error" in resVIP) return;

	await moonMoonz.claimWL(resVIP.proof, { value: PRICE });
}

// Get totalSupply
async function getTotalSupply() {
	try {
		return await moonMoonz.totalSupply();
	} catch {
		return 0;
	}
}

/* -------------------------------------------------------------------------- */
/*                         MoonMoonzRewarder Functions                        */
/* -------------------------------------------------------------------------- */

async function deposit(ids) {
	if (!(await getAddress())) return;
	await moonMoonzRewarder.deposit(ids);
}

async function withdraw(ids) {
	if (!(await getAddress())) return;
	await moonMoonzRewarder.withdraw(ids);
}

async function claim() {
	if (!(await getAddress())) return;
	await moonMoonzRewarder.claim();
}

async function claim() {
	const addr = await getAddress();
	if (!addr) return;
	return await moonMoonzRewarder.earned(addr);
}

async function depositsOf() {
	const addr = await getAddress();
	if (!addr) return;
	return await moonMoonzRewarder.depositsOf(addr);
}
