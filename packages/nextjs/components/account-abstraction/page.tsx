"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultBtn } from "./classes";
import { useCreateMagicSigner, useDisconnectSigner } from "./magic";
import { LocalAccountSigner } from "@alchemy/aa-core";
import { SmartAccountSigner } from "@alchemy/aa-core";
import { baseSepolia } from "@alchemy/aa-core";
import { MagicSigner } from "@alchemy/aa-signers/magic";
import { encodeFunctionData, formatEther } from "viem";
import { Address, generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { useBalance } from "wagmi";
import { useCreateModularAccountAlchemyClient } from "~~/components/account-abstraction";
import { Address as AddressComp } from "~~/components/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const HomePage = () => {
  const [provider, setProvider] = useState<any>();

  const { data: yourContract } = useScaffoldContract({ contractName: "YourContract" });

  const { createOverride } = useCreateModularAccountAlchemyClient(undefined, undefined, undefined);

  const balance = useBalance({ address: provider?.account?.address });

  const [privateKey, setPrivateKey] = useState<`0x${string}`>();

  const { disconnectOverride } = useDisconnectSigner(undefined);

  const handleCreateAccount = useCallback(async (signer: SmartAccountSigner | undefined) => {
    const provider = await createOverride("hZWckYiBKdEJ4i6FOqBTUefskY9aI5n6", signer, baseSepolia);
    setProvider(provider);
  }, []);

  // async function handleCreateAccount(signer: SmartAccountSigner | undefined) {
  //   const provider = await createOverride("hZWckYiBKdEJ4i6FOqBTUefskY9aI5n6", signer, baseSepolia);
  //   setProvider(provider);
  // }

  useEffect(() => {
    const storedData = localStorage.getItem("privateKey");
    if (storedData !== "undefined" && storedData !== undefined && storedData !== null) {
      console.log(storedData);

      const parsedData = JSON.parse(storedData ?? "");
      setPrivateKey(parsedData);
      const signer = LocalAccountSigner.privateKeyToAccountSigner(parsedData);
      handleCreateAccount(signer);
    }
  }, [handleCreateAccount]);

  console.log(privateKey);

  useEffect(() => {
    localStorage.setItem("privateKey", JSON.stringify(privateKey));
  }, [privateKey]);

  const { createMagicSigner } = useCreateMagicSigner("pk_live_271B406A9816A2E1");

  const [magicSigner, setMagicSigner] = useState<MagicSigner>();

  async function handleLoginWithMagic() {
    const i = await createMagicSigner();
    await handleCreateAccount(i);
    setMagicSigner(i);

    console.log(i);
  }

  async function signOut() {
    if (privateKey) {
      setPrivateKey(undefined);
      localStorage.removeItem("privateKey");
    }

    if (magicSigner) {
      await disconnectOverride(magicSigner);
    }

    setProvider(undefined);
  }

  async function send() {
    if (!yourContract) return;

    const uoCallData = encodeFunctionData({
      abi: yourContract.abi,
      functionName: "setGreeting",
      args: ["Hello"],
    });

    const uo = await provider.sendUserOperation({
      uo: {
        target: yourContract.address,
        data: uoCallData,
        value: 0n,
      },
    });
    const txHash = await provider.waitForUserOperationTransaction(uo);
    console.log(txHash);
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center"></h1>

          {!provider ? (
            <div className="flex flex-col items-center">
              <button className={defaultBtn} onClick={handleLoginWithMagic}>
                Login with Magic
              </button>
              <br />
              <button
                className={defaultBtn}
                onClick={() => {
                  const privateKey = generatePrivateKey();
                  setPrivateKey(privateKey);
                  const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);
                  handleCreateAccount(signer);
                }}
              >
                Create Account
              </button>
            </div>
          ) : (
            <></>
          )}

          {provider ? (
            <div>
              <h1>Account Information</h1>

              <p>Your Account Abstraction Public Key</p>
              <AddressComp address={provider.account.address as Address} />
              <p>Balance: {formatEther(BigInt(balance?.data?.value.toString() || "0")) + " ether"}</p>
              <br />
              <button onClick={send}>Send User Op</button>
            </div>
          ) : (
            <></>
          )}

          {privateKey ? (
            <div>
              <p>Your Public Key</p>
              <AddressComp address={privateKeyToAccount(privateKey).address as Address} />
              <br />
              <p>Your Private Key</p>
              <p>{privateKey}</p>
            </div>
          ) : (
            <></>
          )}

          {provider ? (
            <div className="flex flex-col items-center justify-center">
              <button className={defaultBtn} onClick={signOut}>
                Sign out
              </button>
            </div>
          ) : (
            <></>
          )}

          <br />
        </div>
      </div>
    </>
  );
};

export default HomePage;
