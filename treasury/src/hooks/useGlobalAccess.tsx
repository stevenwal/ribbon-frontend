import { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import {
  initialAccessState,
  useGlobalAccessState,
  useWebappGlobalState,
} from "../store/store";
import { hashCode, TreasuryVaultOptions } from "../constants/constants";
import { access } from "fs";
import { Redirect, useHistory } from "react-router-dom";
import { VaultName, VaultNameOptionMap } from "shared/lib/constants/constants";

const useGlobalAccess = () => {
  const history = useHistory();
  const [globalAccess, setGlobalAccess] = useGlobalAccessState("access");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;

      setCode(rawInput);
    },
    [setCode]
  );

  const handleSubmission = useCallback(() => {
    const hex = ethers.utils.formatBytes32String(code);
    const hash = ethers.utils.sha256(hex);

    let vault: TreasuryVaultOptions | undefined;
    for (const [key, value] of Object.entries(hashCode)) {
      if (value == hash) {
        vault = key as TreasuryVaultOptions;
      }
    }

    if (vault) {
      setGlobalAccess((accessState) => {
        if (!accessState.includes(vault as TreasuryVaultOptions)) {
          localStorage.setItem(
            "auth",
            JSON.stringify([...accessState, vault as TreasuryVaultOptions])
          );
          return [...accessState, vault as TreasuryVaultOptions];
        } else {
          return accessState;
        }
      });
      setError("");

      let vaultName;
      Object.keys(VaultNameOptionMap).filter((name) => {
        if (VaultNameOptionMap[name as VaultName] == vault) {
          vaultName = name;
        }
      });

      history.push("/treasury/" + vaultName);
    } else {
      setError("Invalid Code");
    }
  }, [setError, code]);

  return {
    handleInputChange,
    handleSubmission,
    error,
    code,
    globalAccess,
  };
};

export default useGlobalAccess;
