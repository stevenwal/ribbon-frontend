import React, { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { getAssetColor, getAssetLogo } from "shared/lib/utils/asset";
import { Title, Subtitle } from "shared/lib/designSystem";
import {
  CHAINID,
  ENABLED_CHAINID,
  CHAINID_TO_NATIVE_TOKENS,
  READABLE_NETWORK_NAMES,
} from "shared/lib/constants/constants";
import { switchChains } from "shared/lib/utils/chainSwitching";

interface NetworkSwitcherModalProps {
  show: boolean;
  onClose: () => void;
  currentChainId: typeof ENABLED_CHAINID[number];
}

const ModalContainer = styled.div`
  padding: 10px 16px;
`;

const NetworkContainer = styled.div<{
  borderColor: string;
  active?: boolean;
}>`
  display: flex;
  border-radius: 8px;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  background: #212127;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? `border: 1px solid ${props.borderColor};`
      : "border: 1px solid #212127;"}
`;
const NetworkNameContainer = styled.div`
  display: flex;
  align-items: center;
`;
const TitleContainer = styled.div`
  margin-bottom: 32px;
`;
const NetworkName = styled(Subtitle)`
  font-size: 16px;
  text-transform: uppercase;
  line-height: 24px;
  margin-left: 10px;
`;
const Circle = styled.div<{
  size: number;
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => props.size / 2}px;
  background-color: ${(props) => props.color};
`;
const AssetCircle = styled(Circle)`
  padding: 5px 5px;
`;

const NetworkSwitcherModal: React.FC<NetworkSwitcherModalProps> = ({
  show,
  onClose,
  currentChainId,
}) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const { library } = useWeb3React();

  const handleSwitchChain = useCallback(
    async (chainId: number) => {
      if (library && currentChainId !== chainId) {
        await switchChains(library, chainId);

        // Give it a delay before closing, if not it will show a flash
        setTimeout(handleClose, 300);
      }
    },
    [library, currentChainId, handleClose]
  );

  return (
    <BasicModal show={show} onClose={handleClose} maxWidth={400} height={260}>
      <ModalContainer>
        <TitleContainer>
          <Title>Select a network</Title>
        </TitleContainer>

        {ENABLED_CHAINID.map((chainId: CHAINID) => {
          const Logo = getAssetLogo(CHAINID_TO_NATIVE_TOKENS[chainId]);
          const color = getAssetColor(CHAINID_TO_NATIVE_TOKENS[chainId]);
          const active = currentChainId === chainId;

          return (
            <NetworkContainer
              onClick={() => handleSwitchChain(chainId)}
              borderColor={color}
              active={active}
            >
              <NetworkNameContainer>
                <AssetCircle size={40} color={`${color}1F`}>
                  <Logo height={30} width={30}></Logo>
                </AssetCircle>
                <NetworkName>{READABLE_NETWORK_NAMES[chainId]}</NetworkName>
              </NetworkNameContainer>

              {active && <Circle size={8} color={`${color}`}></Circle>}
            </NetworkContainer>
          );
        })}
      </ModalContainer>
    </BasicModal>
  );
};

export default NetworkSwitcherModal;
