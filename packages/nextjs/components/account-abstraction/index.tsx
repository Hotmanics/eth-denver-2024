import { useMemo } from "react";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { Address, sepolia } from "@alchemy/aa-core";
import { SmartAccountSigner } from "@alchemy/aa-core";

// import { encodeFunctionData, parseEther } from "viem";
// import type { Chain } from "viem";
// import { generatePrivateKey } from "viem/accounts";
// import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const chain = sepolia;

// The private key of your EOA that will be the signer to connect with the Modular Account
// Our recommendation is to store the private key in an environment variable
// const PRIVATE_KEY = "0x3378c6042a15aa6df747439329227873a75db11282f47e5b203f3240d68b5dd8" as Hex;
// const signer = LocalAccountSigner.privateKeyToAccountSigner(PRIVATE_KEY);

// const functionName = "mint";

// const args: any[] = [];

// const uoCallData = encodeFunctionData({
//   abi,
//   functionName,
//   args,
// });

// async function test() {
//   // Create a smart account client to send user operations from your smart account
//   const provider = await createModularAccountAlchemyClient({
//     // get your Alchemy API key at https://dashboard.alchemy.com
//     apiKey: "hZWckYiBKdEJ4i6FOqBTUefskY9aI5n6",
//     chain,
//     signer,
//   });

//   // Fund your account address with ETH to send for the user operations
//   // (e.g. Get Sepolia ETH at https://sepoliafaucet.com)
//   console.log("Smart Account Address: ", provider.getAddress()); // Log the smart account address

//   await sendUserOpComplete(provider, "0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf", parseEther("0.4"));
// }

export function useCreateModularAccountAlchemyClient(
  apiKey: string | undefined,
  signer: SmartAccountSigner | undefined,
) {
  const createOverride = useMemo(() => {
    return async (apiKey: string | undefined, signer: SmartAccountSigner | undefined) => {
      if (!apiKey) return;
      if (!signer) return;

      const provider = await createModularAccountAlchemyClient({
        // get your Alchemy API key at https://dashboard.alchemy.com
        apiKey,
        chain,
        signer,
      });

      return provider;
    };
  }, []);

  async function create() {
    return await createOverride(apiKey, signer);
  }

  return { create, createOverride };
}

export function useSendUserOperation(provider: any, target: Address, value = 0n) {
  const sendUserOpOverride = useMemo(() => {
    return async (provider: any, target: Address, value: bigint) => {
      const { hash: uoHash } = await provider.sendUserOperation({
        uo: {
          target, // The desired target contract address
          data: "0x", // The desired call data
          value, // (Optional) value to send the target contract address
        },
      });

      console.log("UserOperation Hash: ", uoHash); // Log the user operation hash

      // Wait for the user operation to be mined
      const txHash = await provider.waitForUserOperationTransaction({
        hash: uoHash,
      });

      console.log("Transaction Hash: ", txHash); // Log the transaction hash
    };
  }, []);

  async function sendUserOp() {
    return await sendUserOpOverride(provider, target, value);
  }

  return { sendUserOp, sendUserOpOverride };
}

// async function sendUserOpComplete(provider: any, target: Address, value: bigint = 0n) {
//   // Send a user operation from your smart account to Vitalik that does nothing
//   const { hash: uoHash } = await provider.sendUserOperation({
//     uo: {
//       target, // The desired target contract address
//       data: "0x", // The desired call data
//       value, // (Optional) value to send the target contract address
//     },
//   });

//   console.log("UserOperation Hash: ", uoHash); // Log the user operation hash

//   // Wait for the user operation to be mined
//   const txHash = await provider.waitForUserOperationTransaction({
//     hash: uoHash,
//   });

//   console.log("Transaction Hash: ", txHash); // Log the transaction hash
// }

// test();
