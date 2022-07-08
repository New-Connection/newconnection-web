// import * as IPFS from 'ipfs-core'
//import { infuraIPFS, NFT_STORAGE_KEY } from './constants'
// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from 'nft.storage'

// WORKS FOR ONE FILE
// export const ipfsUpload  = async (imgData: File, fileName: string) => {
//     const ipfs = await IPFS.create()
//     //await ipfs.files.mkdir('/images')
//     const { cid } = await ipfs.add({
//         path: `images/${fileName}`,
//         content: imgData,
//     }, { wrapWithDirectory: true })
//     console.log("CID", cid)
// }

const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU3MkRmOTliNkJDZjhGODlmOTQ4ODkwMTYyN0M5MUZhQkZENUU3RDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzMwMzgxOTIwOCwibmFtZSI6Ik5ld0Nvbm5lY3Rpb24ifQ.1LBmCk5ZRmzQVjSDXmV8Vugt85blOz0PBwTdLX1a9Rk";

// !!!!!!!!!!!!!!!
// RE WRITE TO CONST BECAUSE 
// SyntaxError: The requested module 'it-pipe' does not provide an export named 'default'


// ADD ERRORS WHEN TOKEN IS UNDERFEING 

/** 
  * Reads an image file from `imagePath` and stores an NFT with the given name and description.
  * @param imagePath the path to an image file
  * @param name a name for the NFT
  * @param description a text description for the NFT
  */
export default async function storeNFT(image:File, name:string, description:string) {
    
    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    // call client.store, passing in the image & metadata
    const UID = await nftstorage.store({
      image,
      name,
      description,
    })
    console.log(UID)
    return UID
}
