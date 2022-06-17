const signTransaction = async (action, target, sender) => {
  let reciver;
  if (target === "token") reciver = process.env.REACT_APP_TOKEN_RINK;
  if (target === "bank") reciver = process.env.REACT_APP_BANK_RINK;
  if (!target) {
    throw new Error("No RECIVER set");
  }
  const result = {};
  let data;
  console.log(sender);
  const count = await web3.eth.getTransactionCount(sender);

  const nonce = web3.utils.toHex(count);
  const gasLimit = web3.utils.toHex(300000);
  const gasPrice = web3.utils.toHex(
    web3.eth.gasPrice || web3.utils.toHex(2 * 1e9)
  );
  const value = web3.utils.toHex(web3.utils.toWei("0", "wei"));

  data = action.encodeABI();

  const txData = {
    nonce,
    gasLimit,
    gasPrice,
    value,
    data,
    from: sender,
    to: reciver,
  };
  //Propmting metamask to sign the transaction
  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [txData],
  });

  result["receipt"] = txHash;
  console.log(result["receipt"]);
  reciver = null;
};

export default signTransaction;
