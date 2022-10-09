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

const moonMoonzWater = new ethers.Contract(
	ADDRESSES.MoonMoonzWater,
	ABIS.MoonMoonzWater,
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

	if (!acc.length) return;

	const resWl = await (
		await fetch("https://moonmoonz-api.up.railway.app/wl/" + acc[0])
	).json();

	const resVIP = await (
		await fetch("https://moonmoonz-api.up.railway.app/vip/" + acc[0])
	).json();

	const resWaitList = await (
		await fetch("https://moonmoonz-api.up.railway.app/waitlist/" + acc[0])
	).json();

	//check if WL or VIP
	if (acc.length) {
		if (resWl.proof) {
			console.log(resWl.proof);
			alert("You are in the WL list!");
		} else if (resVIP.proof) {
			console.log(resVIP.proof);
			alert("You are in the VIP list!");
		} else if (resWaitList.proof) {
			console.log(resWaitList.proof);
			alert("You are in the Waitlist!");
		} else {
			console.error(resWl.error);
			console.error(resVIP.error);
			alert("Not in any list...");
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

function storeError(error) {
	console.log(error);
	Alpine.store("error", error);
	Alpine.start();
}

function getError(error) {
	return error.error.message.split("execution reverted: ")[1];
}

function storeError(error) {
	console.log(error);
	Alpine.store("error", error);
	Alpine.start();
}

function getError(error) {
	return error.error.message.split("execution reverted: ")[1];
}

/* -------------------------------------------------------------------------- */
/*                             MoonMoonz Functions                            */
/* -------------------------------------------------------------------------- */

async function fetchProof(addr, sale) {
	try {
		const response = await (await fetch(`${API}/${sale}/${addr}`)).json();
		if ("error" in response) throw "Not whitelisted";

		return response.proof;
	} catch (error) {
		storeError(error.message);
	}
}

// Claim 1 token during vip sale
async function claimVIP(addr) {
	const proof = await fetchProof(addr, "vip");
	if (!proof) throw "Not whitelisted";

	try {
		await moonMoonz.claimVIP(proof);
	} catch (error) {
		storeError(getError(error));
	}
}

// Claim 1 token during wl sale
async function claimWL(addr) {
	const proof = await fetchProof(addr, "wl");
	if (!proof) throw "Not whitelisted";

	try {
		await moonMoonz.claimWL(proof, { value: PRICE });
	} catch (error) {
		storeError(getError(error));
	}
}

// Claim 1 token during wl sale
async function claimWaitlist(addr) {
	const proof = await fetchProof(addr, "waitlist");
	if (!proof) throw "Not whitelisted";

	try {
		await moonMoonz.claimWaitlist(proof, { value: PRICE });
	} catch (error) {
		storeError(getError(error));
	}
}

// Claim 1 token during public sale
async function claim() {
	try {
		await moonMoonz.claim({ value: PRICE });
	} catch (error) {
		storeError(getError(error));
	}
}

// Claim a token depending on the sale state
async function mint() {
	const addr = await getAddress();
	if (!addr) storeError("Wallet not connected");

	const saleState = await getSaleState();

	if (saleState === 0) storeError("Sale hasn't started yet!");
	else if (saleState === 1) claimVIP(addr);
	else if (saleState === 2) claimWL(addr);
	else if (saleState === 3) claimWaitlist(addr);
	else if (saleState === 4) claim();
}

// Get totalSupply
async function getTotalSupply() {
	try {
		return (await moonMoonz.totalSupply()).toNumber();
	} catch {
		console.error(error);
		return 0;
	}
}

// Get sale state
async function getSaleState() {
	try {
		return (await moonMoonz.saleState()).toNumber();
	} catch {
		console.error(error);
		return 0;
	}
}

// Get token metadata
async function getMetadata(id) {
	try {
		const metadata = await (await fetch(await moonMoonz.tokenURI(id))).json();
		return { name: metadata.name, image: metadata.image };
	} catch (error) {
		console.error(error);
		return {};
	}
}

// Get tokens of account
async function tokensOf() {
	try {
		const addr = await getAddress();
		if (!addr) storeError("Wallet not connected");

		const balance = (await moonMoonz.balanceOf(addr)).toNumber();
		const tokens = [];

		for (let i = 0; i < balance; i++) {
			const id = (await moonMoonz.tokenOfOwnerByIndex(addr, 0)).toNumber();
			const timezone = await moonMoonz.timezoneOf(id);
			const metadata = await getMetadata(id);

			tokens.push({
				id,
				timezone,
				...metadata,
			});
		}

		return tokens;
	} catch (error) {
		console.error(error);
		return [];
	}
}

// Returns if it's night at certain timezone
function isNight(timezone) {
	const START = 1640995200;

	const start =
		timezone == 0 ? START : timezone == 1 ? START + 18000 : START - 18000;

	const elapsedToday = (Math.floor(Date.now() / 1000) - start) % 86400;

	return elapsedToday < 21600 || elapsedToday >= 64800;
}

/* -------------------------------------------------------------------------- */
/*                         MoonMoonzRewarder Functions                        */
/* -------------------------------------------------------------------------- */

async function deposit(ids) {
	if (ids.length === 0) return;

	try {
		await moonMoonzRewarder.deposit(ids);
	} catch (error) {
		storeError(getError(error));
	}
}

async function withdraw(ids) {
	if (ids.length === 0) return;

	try {
		await moonMoonzRewarder.withdraw(ids);
	} catch (error) {
		storeError(getError(error));
	}
}

async function claimWater() {
	try {
		await moonMoonzRewarder.claim();
	} catch (error) {
		storeError(getError(error));
	}
}

async function earned() {
	try {
		const addr = await getAddress();
		if (!addr) throw "Wallet not connected";

		await moonMoonzRewarder.deposit(ids);
	} catch (error) {
		storeError(getError(error));
	}
}

// Get deposited tokens of account
async function depositsOf() {
	try {
		const addr = await getAddress();
		if (!addr) storeError("Wallet not connected");

		const ids = await moonMoonzRewarder.depositsOf(addr);
		const tokens = [];

		for (const _id of ids) {
			const id = _id.toNumber();
			const timezone = await moonMoonz.timezoneOf(id);
			const metadata = await getMetadata(id);

			tokens.push({
				id,
				timezone,
				...metadata,
			});
		}

		return tokens;
	} catch (error) {
		console.error(error);
		return [];
	}
}
