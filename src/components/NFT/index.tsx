import * as React from 'react';
import { InputAmount, InputText, SubmitButton } from '../Form';

export default function NFTSection(){
    return (
      <section className="relative w-full">
      <form className="mx-auto flex max-w-xl flex-col gap-4">
        <h1 className="font-exo my-2 text-2xl font-semibold text-[#3D3D3D] dark:text-white">Create NFT</h1>
        <InputText label={'Name'} name="recipientAddress" isRequired />
        <InputText label={'Description'} name="vestedToken" isRequired />
        <InputAmount label={'Number of NFT'} name="vestingAmount"  isRequired/>
        {/* <InputAmountWithDuration
          label={'Vesting Duration'}
          name="vestingTime"
          isRequired
          selectInputName="vestingDuration"
          handleChange={(e) => handleChange(e.target.value, 'vestingTime')}
          handleSelectChange={(e) => handleChange(e.target.value, 'vestingDuration')}
        />
        {formData.includeCliff && (
          <InputAmountWithDuration
            label={'Cliff Duration'}
            name="cliffTime"
            isRequired
            selectInputName="cliffDuration"
            handleChange={(e) => handleChange(e.target.value, 'cliffTime')}
            handleSelectChange={(e) => handleChange(e.target.value, 'cliffDuration')}
          />
        )}
        {formData.includeCustomStart && (
          <InputText
            label={'Start Date (YYYY-MM-DD)'}
            name="startDate"
            isRequired
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            handleChange={(e) => handleChange(e.target.value, 'startDate')}
          />
        )} */}


        <SubmitButton className="mt-5">
          {/* {checkingApproval || approvingToken ? (
            <BeatLoader size={6} color="white" />
          ) : isApproved ? (
            'Create Contract'
          ) : (
            'Approve Token'
          )} */}
          Create Contract
        </SubmitButton>
      </form>
      </section>

    )
}
