import * as IPFS from 'ipfs-core'

// WORKS FOR ONE FILE
export const ipfsUpload  = async (imgData: File, fileName: string) => {
    const ipfs = await IPFS.create()
    //await ipfs.files.mkdir('/images')
    const { cid } = await ipfs.add({
        path: `images/${fileName}`,
        content: imgData,
    }, { wrapWithDirectory: true })
    console.log("CID", cid)
}
