import React, {useState} from 'react';
import { useDialogState } from 'ariakit';

import { InputAmount, InputText, SubmitButton, BlockchainSelector, TypeSelector, DragAndDropImage } from '../Form';
import { hexValue } from 'ethers/lib/utils';
// TODO: 
// Check ipfs approver 
// Check contract is upload to blockchain
// Account(useAccount, useProvider) from wagmi for approve
//

interface ICreateNFTElements {
  name: { value: string };
  description:{value: string};
  image: { value: string };
  count: {value:number}; 
  price: {value:number};
  blockchain: { value: 'Ethereum' | 'Polygon' | 'Arbitrum' | 'Binance' };
  role: { value: 'Member' | 'Design' | 'VC' };
  collectionName: { value: string };
  twitterURL: { value: string };
  discordURL: { value: string };
}

export default function NFTSection(){
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      image: '',
      blockchain: 'Ethereum',
      role: 'Member',
      collectionName: '',
      twitterURL: '',
      discordURL: ''
    });

    const [createData, setCreateData] = useState<ICreateNFTElements | null>(null)
    
    const isApproved = false;
    
    const confirmDialog = useDialogState();
    // function for set values into formData
    const handleChange = (value: string | boolean, type: keyof typeof formData) => {
      setFormData((prev) => ({ ...prev, [type]: value }));
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      const form = e.target as HTMLFormElement & ICreateNFTElements;
      const name = form.name.value;
      const image = form.image?.value;
      const description = form.description.value;
      const role = form.role.value;
      const collectionName = form.collectionName?.value;
      const twitterURL = form.twitterURL?.value;
      const discordURL = form.discordURL?.value;
      const count = form.count.value;
      const blockchain = form.blockchain.value;
      const price = form.price.value;
       
      
      console.log(name, description, image, role)
      console.log(collectionName, twitterURL, discordURL)
      console.log(count, blockchain, price)
      if(isApproved) {
        confirmDialog.show();
        form.reset();
        
      }
      
    }

    return (
      <section className="relative w-full">
        <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
          <h1 className="font-exo my-2 text-2xl font-semibold text-[#3D3D3D] dark:text-white">Create NFT</h1>
          <InputText label='Name' name="name" placeholder='NFT Name' isRequired />
          <InputText label='Description' className="pt-1.5 pb-14 dark:pt-1.5 dark:pb-14" name="description" placeholder='A short descption about NFT collection(Max. 250 words)' isRequired />
          <DragAndDropImage label='Image' name='image' />
          <div className="flex justify-between">
              <InputAmount label={'Number of NFT'} name="count" isRequired/>
              <InputAmount label={'Price'} placeholder="0 (Max. 0)" name="price" isRequired/>
              <BlockchainSelector label={'Type of blockchain'} name={'blockchain'} className='w-full flex cursor-default items-center whitespace-nowrap text-base justify-start gap-3 hover:bg-sky-700'/>
          </div>
          <div className='flex justify-between'>
            <TypeSelector label={'Role'} name='role' className='flex cursor-default items-center whitespace-nowrap px-4 text-base justify-start gap-3 hover:bg-sky-700'/>
            <InputText label={'Collection (optional)'} name="collectionName" placeholder='Collection name' isRequired={false} />
          </div>
          <div className="flex space-x-4">
              <InputText label={'Twitter (optional)'} name="twitterURL" placeholder='Enter your twitter handler' isRequired={false}/>
              <InputText label={'Discord (optional)'} name="discordURL" placeholder='Enter your discord server' isRequired={false}/>
          </div>
          <SubmitButton className="mt-5">
            Create Contract
          </SubmitButton>
        </form>
      </section>

    )
}
