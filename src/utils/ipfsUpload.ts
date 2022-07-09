import { NFT_STORAGE_KEY } from './constants'
import { NFTStorage } from 'nft.storage'


export const NFTStorageInitialization = ():NFTStorage => {
  return new NFTStorage({ token: NFT_STORAGE_KEY })
}

/** 
  * Reads an image file from `imagePath` and stores an NFT with the given name and description.
  * @param image the path to an image file
  * @param name a name for the NFT
  * @param description a text description for the NFT
  */
export const storeNFT = async(image, name, description) => {
    try{
      // create a new NFTStorage client using our API key
      // const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
      // console.log(nftstorage)
      const client = NFTStorageInitialization()
      // call client.store, passing in the image & metadata
      const UID = await client.store({
        image,
        name,
        description,
      })
      const status = await client.status(UID.ipnft)
      console.log(status)
      return UID
    } catch(error) {
      console.log(error, 'Token is invalid')
    }
  } 
