const ADDRESSES = {
	MoonMoonz: "",
	// MoonMoonzRewarder: "",
};

const ABIS = {
	MoonMoonz: [
		"function totalSupply() view returns(uint256)",
		"function claimVIP(bytes32[])",
		"function claimWL(bytes32[]) payable",
		"function claimWaitlist(bytes32[]) payable",
		"function claim(uint256) payable",
	],
	MoonMoonzRewarder: [
		"function deposit(uint256[]) external",
		"function withdraw(uint256[]) external",
		"function claim() external",
		"function earned(address) external view returns(uint256[])",
		"function depositsOf(address) external view returns(uint256[])",
	],
};

const PRICE = ethers.utils.parseEther("0.0088");

const API = "https://moonmoonz-api.up.railway.app";
