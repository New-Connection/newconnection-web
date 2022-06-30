import { BaseSyntheticEvent, ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import { NextPage } from "next";
import Layout from "components/Layout";
import Head from "next/head";
import { useSigner } from "wagmi";
import { DragAndDropImage, InputText, SubmitButton } from "components/Form";
import { InputTextArea } from "components/Form/Input";
import { CheckboxGroup } from "components/Form/Checkbox";
import toast from "react-hot-toast";
import fa from "@walletconnect/qrcode-modal/dist/cjs/browser/languages/fa";

interface CreateDAO {
    name: string;
    goals: string;
    profileImage: object;
    coverImage: object;
    type: string[];
    blockchain: string[];
    description: string;
}

const DaoTypeValues = ["Grants", "Investment", "Social"];
const BlockchainValues = [
    "Arbitrum",
    "Aurora",
    "Avalanche",
    "Binance",
    "Ethereum",
    "Fantom",
    "Optimism",
    "Polygon",
];

const stringIsEmpty = (str: string) => !str || str.length === 0;
const objectIsEmpty = (obj: object) => Object.keys(obj).length === 0 && obj.constructor === Object;
const arrayIsEmpty = <T extends string>(array: T[]) => array.length === 0;
const validateForm = (formData: CreateDAO): boolean => {
    const fields: string[] = [];
    for (const formDataKey in formData) {
        const key = formData[formDataKey];
        if (
            (typeof key === "string" && stringIsEmpty(key)) ||
            (typeof key === "object" && objectIsEmpty(key)) ||
            (Array.isArray(key) && arrayIsEmpty(key))
        ) {
            fields.push(formDataKey);
        }
    }
    if (!arrayIsEmpty(fields)) {
        toast.error(`Please fill out these fields: \n${fields.join("\n")}`);
        return false;
    }
    return true;
};

const CreateDAO: NextPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        goals: "",
        profileImage: {},
        coverImage: {},
        type: [],
        blockchain: [],
        description: "",
    } as CreateDAO);

    const { data: signer, isError, isLoading } = useSigner();
    const bytecodeERC20 =
        "0x608060405234801561001057600080fd5b506040516103bc3803806103bc83398101604081905261002f9161007c565b60405181815233906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a333600090815260208190526040902055610094565b60006020828403121561008d578081fd5b5051919050565b610319806100a36000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063313ce5671461005157806370a082311461006557806395d89b411461009c578063a9059cbb146100c5575b600080fd5b604051601281526020015b60405180910390f35b61008e610073366004610201565b6001600160a01b031660009081526020819052604090205490565b60405190815260200161005c565b604080518082018252600781526626bcaa37b5b2b760c91b6020820152905161005c919061024b565b6100d86100d3366004610222565b6100e8565b604051901515815260200161005c565b3360009081526020819052604081205482111561014b5760405162461bcd60e51b815260206004820152601a60248201527f696e73756666696369656e7420746f6b656e2062616c616e6365000000000000604482015260640160405180910390fd5b336000908152602081905260408120805484929061016a9084906102b6565b90915550506001600160a01b0383166000908152602081905260408120805484929061019790849061029e565b90915550506040518281526001600160a01b0384169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a350600192915050565b80356001600160a01b03811681146101fc57600080fd5b919050565b600060208284031215610212578081fd5b61021b826101e5565b9392505050565b60008060408385031215610234578081fd5b61023d836101e5565b946020939093013593505050565b6000602080835283518082850152825b818110156102775785810183015185820160400152820161025b565b818111156102885783604083870101525b50601f01601f1916929092016040019392505050565b600082198211156102b1576102b16102cd565b500190565b6000828210156102c8576102c86102cd565b500390565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220d80384ce584e101c5b92e4ee9b7871262285070dbcd2d71f99601f0f4fcecd2364736f6c63430008040033";
    const [createData, setCreateData] = useState<CreateDAO | null>(null);

    const handleTextChange: ChangeEventHandler = <T extends HTMLInputElement | HTMLTextAreaElement>(
        event: ChangeEvent<T>
    ) => {
        setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleImageChange = (file: File | File[], field: "coverImage" | "profileImage") => {
        setFormData((prev) => ({ ...prev, [field]: file }));
    };

    const handleCheckboxChange = <T extends HTMLInputElement>(
        event: BaseSyntheticEvent,
        field: "type" | "blockchain"
    ) => {
        let checkboxGroup = formData[field] as string[];
        const elem = event.currentTarget;
        const label = elem.parentNode.textContent;

        if (elem.checked && !checkboxGroup.includes(label)) {
            checkboxGroup.push(label);
        }
        if (!elem.checked && checkboxGroup.includes(label)) {
            checkboxGroup = checkboxGroup.filter((value) => value !== label);
        }

        setFormData((prev) => ({ ...prev, [field]: checkboxGroup }));
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(formData);
        if (!validateForm(formData)) {
            return;
        }

        console.log("submited");
        // DIDN'T
        // const singer_right = await signer?.connect()
        // const factory = CreateNFTContract(bytecode=bytecodeERC20, singer_right})
        // const contract = await factory.deploy({name}, {description}, {count})
        // await contract.deployed()
        // console.log(`Deployment successful! Contract Address: ${contract.address}`)
    };

    return (
        <>
            <Head>
                <title>New Connection: Create DAO</title>
            </Head>
            <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8">
                <section className="relative w-full">
                    <form className="mx-auto flex flex-col max-w-2xl gap-4" onSubmit={onSubmit}>
                        <h1 className="font-exo my-2 text-2xl font-semibold">Create DAO</h1>
                        <div className="flex flex-row">
                            <h2 className={"my-2 text-xl font-medium"}>DAO Name and Goals</h2>
                        </div>
                        <div className="flex flex-row">
                            <DragAndDropImage
                                label="Profile Image"
                                name="profileImage"
                                className={"w-1/3 mr-10"}
                                handleChange={(file) => handleImageChange(file, "profileImage")}
                            />
                            <DragAndDropImage
                                label="Cover Image"
                                name="coverImage"
                                className={"w-2/3"}
                                handleChange={(file) => handleImageChange(file, "coverImage")}
                            />
                        </div>
                        <InputText
                            label="DAO Name"
                            name="name"
                            placeholder="Unique DAO name"
                            // isRequired
                            maxLength={30}
                            handleChange={handleTextChange}
                        />
                        <InputText
                            label="DAO Goals"
                            name="goals"
                            placeholder="Сlear DAO goals"
                            maxLength={100}
                            // isRequired
                            handleChange={handleTextChange}
                        />
                        <CheckboxGroup
                            label={"DAO Type"}
                            description={"You can choose one or more types"}
                            values={DaoTypeValues}
                            handleChange={(event) => handleCheckboxChange(event, "type")}
                        />
                        <CheckboxGroup
                            label={"DAO Blockchain"}
                            description={"You can choose one or more blockchains"}
                            values={BlockchainValues}
                            handleChange={(event) => handleCheckboxChange(event, "blockchain")}
                        />
                        <InputTextArea
                            name={"description"}
                            label={"DAO Description"}
                            // isRequired
                            maxLength={2000}
                            handleChange={handleTextChange}
                        />

                        <SubmitButton className="mt-5">Create Contract</SubmitButton>
                    </form>
                </section>
            </Layout>
        </>
    );
};

export default CreateDAO;
