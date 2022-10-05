const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const moonMoonz = new ethers.Contract(
	ADDRESSES.MoonMoonz,
	ABIS.MoonMoonz,
	signer
);

// const moonMoonzRewarder = new ethers.Contract(
// 	ADDRESSES.MoonMoonzRewarder,
// 	ABIS.MoonMoonzRewarder,
// 	signer
// );

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

async function fetchProof(addr, sale) {
	const response = await (await fetch(`${API}/${sale}/${addr}`)).json();
	if ("error" in response) return;
	return response.proof;
}

// Claim 1 token during vip sale
async function claimVIP() {
	const addr = await getAddress();
	if (!addr) return;

	const proof = await fetchProof(addr, "vip");
	if (!proof) return;

	await moonMoonz.claimVIP(proof);
}

// Claim 1 token during wl sale
async function claimWL() {
	const addr = await getAddress();
	if (!addr) return;

	const proof = await fetchProof(addr, "wl");
	if (!proof) return;

	await moonMoonz.claimWL(proof, { value: PRICE });
}

// Claim 1 token during wl sale
async function claimWaitlist() {
	const addr = await getAddress();
	if (!addr) return;

	const proof = await fetchProof(addr, "waitlist");
	if (!proof) return;

	await moonMoonz.claimWaitlist(proof, { value: PRICE });
}

// Claim 1 token during public sale
async function claim() {
	const addr = await getAddress();
	if (!addr) return;

	await moonMoonz.claim({ value: PRICE });
}

// Get totalSupply
async function getTotalSupply() {
	try {
		return await moonMoonz.totalSupply();
	} catch {
		return 0;
	}
}

// Get sale state
async function getSaleState() {
	try {
		return await moonMoonz.saleState();
	} catch {
		return 0;
	}
}

/* -------------------------------------------------------------------------- */
/*                         MoonMoonzRewarder Functions                        */
/* -------------------------------------------------------------------------- */

// async function deposit(ids) {
// 	if (!(await getAddress())) return;
// 	await moonMoonzRewarder.deposit(ids);
// }

// async function withdraw(ids) {
// 	if (!(await getAddress())) return;
// 	await moonMoonzRewarder.withdraw(ids);
// }

// async function claim() {
// 	if (!(await getAddress())) return;
// 	await moonMoonzRewarder.claim();
// }

// async function claim() {
// 	const addr = await getAddress();
// 	if (!addr) return;
// 	return await moonMoonzRewarder.earned(addr);
// }

// async function depositsOf() {
// 	const addr = await getAddress();
// 	if (!addr) return;
// 	return await moonMoonzRewarder.depositsOf(addr);
// }
