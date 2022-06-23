import * as React from 'react';
import { InputAmount, InputText, SubmitButton, BlockchainSelector, TypeSelector } from '../Form';

export default function NFTSection(){

    return (
      <section className="relative w-full">
      <form className="mx-auto flex max-w-xl flex-col gap-4">
        <h1 className="font-exo my-2 text-2xl font-semibold text-[#3D3D3D] dark:text-white">Create NFT</h1>
        <InputText label={'Name'} name="recipientAddress" placeholder='NFT Name' isRequired />
        <InputText label={'Description'} name="vestedToken" placeholder='A short descption about NFT collection(Max. 250 words)' isRequired />
        <div className="flex justify-between">
            <InputAmount label={'Number of NFT'} name="vestingAmount" isRequired/>
            <InputAmount label={'Price'} placeholder="0 (Max. 0)" name="vestingAmount" isRequired/>
            <BlockchainSelector/>
        </div>
        <div className='flex justify-between'>
          <TypeSelector/>
          <InputText label={'Collection (optional)'} name="vestedToken" placeholder='Collection name' isRequired={false} />
        </div>
        <div className="flex space-x-4">
            <InputText label={'Twitter (optional)'} name="twitter" placeholder='Enter your twitter handler' isRequired={false}/>
            <InputText label={'Discord (optional)'} name="discord" placeholder='Enter your discord server' isRequired={false}/>
        </div>
        <SubmitButton className="mt-5">
          Create Contract
        </SubmitButton>
      </form>
      </section>

    )
}
