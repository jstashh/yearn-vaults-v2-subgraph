import { Vault, VaultDayData } from '../../../generated/schema';
import { BigInt } from '@graphprotocol/graph-ts';
import { BIGINT_ZERO } from '../constants';

export function updateVaultDayData(
  vault: Vault,
  timestamp: BigInt,
  pricePerShare: BigInt,
  deposited: BigInt,
  withdrawn: BigInt,
  returnsGenerated: BigInt
): void {
  let timestampNum = timestamp.toI32();
  let dayID = timestampNum / 86400;
  let dayStartTimestamp = dayID * 86400;
  let vaultDayID = vault.id
    .toString()
    .concat('-')
    .concat(BigInt.fromI32(dayID).toString());

  let vaultDayData = VaultDayData.load(vaultDayID);
  if (vaultDayData === null) {
    vaultDayData = new VaultDayData(vaultDayID);
    vaultDayData.date = dayStartTimestamp;
    vaultDayData.vault = vault.id;
    vaultDayData.pricePerShare = pricePerShare;
    vaultDayData.deposited = BIGINT_ZERO;
    vaultDayData.withdrawn = BIGINT_ZERO;
    vaultDayData.totalReturnsGenerated = BIGINT_ZERO;
    vaultDayData.dayReturnsGenerated = BIGINT_ZERO;
  }

  vaultDayData.pricePerShare = pricePerShare;
  vaultDayData.deposited = vaultDayData.deposited.plus(deposited);
  vaultDayData.withdrawn = vaultDayData.withdrawn.plus(withdrawn);
  vaultDayData.dayReturnsGenerated = returnsGenerated;

  let previousDayID = vault.id
    .toString()
    .concat('-')
    .concat(BigInt.fromI32(dayID - 1).toString());

  let previousVaultDayData = VaultDayData.load(previousDayID);
  if (previousVaultDayData === null) {
    vaultDayData.totalReturnsGenerated = BIGINT_ZERO;
  } else {
    vaultDayData.totalReturnsGenerated = previousVaultDayData.totalReturnsGenerated.plus(
      returnsGenerated
    );
  }

  vaultDayData.save();
}
