import { useMemo } from "react";
import { MagicSigner } from "@alchemy/aa-signers/magic";

export function useCreateMagicSigner(apiKey: string | undefined) {
  const createMagicSignerOverride = useMemo(() => {
    return async (apiKey: string | undefined) => {
      if (!apiKey) return;

      const magicSigner = new MagicSigner({ apiKey });

      await magicSigner.authenticate({
        authenticate: async () => {
          await magicSigner.inner.wallet.connectWithUI();
        },
      });

      return magicSigner;
    };
  }, []);

  async function createMagicSigner() {
    return await createMagicSignerOverride(apiKey);
  }

  return { createMagicSigner, createMagicSignerOverride };
}

export function useDisconnectSigner(magicSigner: MagicSigner | undefined) {
  const disconnectOverride = useMemo(() => {
    return async (magicSigner: MagicSigner | undefined) => {
      if (!magicSigner) return;

      await magicSigner.inner.user.logout();
    };
  }, []);

  async function disconnect() {
    return await disconnectOverride(magicSigner);
  }

  return { disconnect, disconnectOverride };
}
