"use client";

import { useState } from "react";
import { LocalAccountSigner } from "@alchemy/aa-core";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { useCreateModularAccountAlchemyClient, useSendUserOperation } from "~~/components/account-abstraction";
import { Address } from "~~/components/scaffold-eth";

const HomePage = () => {
  const [provider, setProvider] = useState<any>();

  const { createOverride } = useCreateModularAccountAlchemyClient(undefined, undefined);
  const { sendUserOp } = useSendUserOperation(provider, "0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf");

  const [privateKey, setPrivateKey] = useState<`0x${string}`>();

  async function handleCreateAccount() {
    const privateKey = generatePrivateKey();
    const signer = LocalAccountSigner.privateKeyToAccountSigner(privateKey);

    const provider = await createOverride("hZWckYiBKdEJ4i6FOqBTUefskY9aI5n6", signer);
    setProvider(provider);
    setPrivateKey(privateKey);
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center"></h1>
          <button onClick={handleCreateAccount}>Create Account</button>

          {provider ? (
            <div>
              <h1>Account Information</h1>

              <p>Your Account Abstraction Public Key</p>
              <Address address={provider.account.address} />

              <br />

              {privateKey ? (
                <div>
                  <p>Your Public Key</p>
                  <Address address={privateKeyToAccount(privateKey).address} />
                  <br />
                  <p>Your Private Key</p>
                  <p>{privateKey}</p>
                </div>
              ) : (
                <></>
              )}

              {/* <p className="text-wrap"> {privateKeyToAccount(privateKey!).publicKey} </p> */}
            </div>
          ) : (
            <></>
          )}

          <br />
          <button onClick={sendUserOp}>Send User Op</button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
