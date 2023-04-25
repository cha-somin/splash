import { SUI_SYSTEM_STATE_OBJECT_ID, TransactionBlock } from '@mysten/sui.js';

import { DEFAULT_GAS_BUDGET_FOR_STAKE } from 'src/constant/coin';
import { LocalStorage } from 'src/types/localStorage';

export const stakeObject = async (
  validatorAddress: string,
  walletType: LocalStorage['walletType'],
  amount: number,
  signAndExecuteTransactionBlock: any,
) => {
  if (walletType === 'sui-extension') {
    const tx = new TransactionBlock();

    const stakeCoin = tx.splitCoins(tx.gas, [tx.pure(amount)]);

    tx.setGasBudget(DEFAULT_GAS_BUDGET_FOR_STAKE);

    tx.moveCall({
      target: '0x3::sui_system::request_add_stake',
      arguments: [tx.object(SUI_SYSTEM_STATE_OBJECT_ID), stakeCoin, tx.pure(validatorAddress)],
    });

    const validatorResponse = await signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
      },
    });

    return validatorResponse;
  }
  return { err: 'not Support' };
};
