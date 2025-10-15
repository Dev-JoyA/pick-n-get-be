// import { ContractId } from '@hashgraph/sdk';
// import { WalletInterface } from '../../frontend/app/services/wallets/walletInterface';
// import { ContractFunctionParameterBuilder } from '../../frontend/app/services/wallets/contractFunctionParameterBuilder';

// const CONTRACT_ADDRESS = '0.0.6960598';

// interface ConfirmItemResult {
//   success: boolean;
//   txHash?: string;
//   error?: string;
// }

// /**
//  * Call smart contract confirmItem function
//  * This is called by the rider when they arrive and verify the items
//  *
//  * Contract signature: confirmItem(uint256 _riderId, uint256 _userId, uint256 _recycleItemId)
//  */
// export async function confirmItemOnChain(
//   riderId: number,
//   userId: number,
//   itemId: number,
//   walletInterface: WalletInterface,
// ): Promise<ConfirmItemResult> {
//   console.log(`\n=======================================`);
//   console.log(`- Confirming item on blockchain...🟠`);
//   console.log(`- Rider ID: ${riderId}`);
//   console.log(`- User ID: ${userId}`);
//   console.log(`- Item ID: ${itemId}`);

//   try {
//     // Build contract function parameters
//     const functionParameters = new ContractFunctionParameterBuilder()
//       .addParam({
//         type: 'uint256',
//         name: '_riderId',
//         value: riderId,
//       })
//       .addParam({
//         type: 'uint256',
//         name: '_userId',
//         value: userId,
//       })
//       .addParam({
//         type: 'uint256',
//         name: '_recycleItemId',
//         value: itemId,
//       });

//     const contractId = ContractId.fromString(CONTRACT_ADDRESS);
//     const gasLimit = 300000;

//     console.log(`- Executing confirmItem contract function...`);
//     const transactionResult = await walletInterface.executeContractFunction(
//       contractId,
//       'confirmItem',
//       functionParameters,
//       gasLimit,
//     );

//     if (!transactionResult) {
//       throw new Error('Transaction failed - no transaction ID returned');
//     }

//     const txHash = transactionResult.toString();
//     console.log(`- Transaction submitted: ${txHash}`);
//     console.log(`- Item confirmation recorded on blockchain ✅`);

//     return {
//       success: true,
//       txHash: txHash,
//     };
//   } catch (error) {
//     console.error(`- Contract confirmation error:`, error);

//     let errorMessage: string = 'Failed to confirm item on blockchain';

//     if (error instanceof Error) {
//       const message = error.message.toLowerCase();

//       if (message.includes('norecycleitem') || message.includes('no recycle item')) {
//         errorMessage = 'No recycling item found for this user';
//       } else if (message.includes('notauthorised') || message.includes('not authorised')) {
//         errorMessage = 'Rider not authorized to confirm this item';
//       } else if (message.includes('item does not belong')) {
//         errorMessage = 'Item does not belong to this user';
//       } else if (message.includes('rejected')) {
//         errorMessage = 'Transaction rejected by user';
//       } else {
//         errorMessage = error.message;
//       }
//     }

//     return {
//       success: false,
//       error: errorMessage,
//     };
//   }
// }

// /**
//  * Verify if item has been confirmed on chain (optional check)
//  */
// export async function checkItemConfirmation(userId: number, itemId: number): Promise<boolean> {
//   // TODO: Implement by querying the smart contract or mirror node
//   // This would check if confirmItem was called for this userId/itemId
//   console.log(`Checking confirmation for user ${userId}, item ${itemId}`);
//   return false;
// }
