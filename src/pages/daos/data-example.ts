import { DAOProps } from "./index";

const data: DAOProps[] = [
    {
        address: "0xEEBea2b30E921765C2d07741C4BbA8E48Fa734af",
        chainId: 5,
    },
    {
        address: "0xa299893a8F91448E7653Fd71555f7742d7ED6F90",
        chainId: 5,
    },
];

export const getDAOs = async () => {
    return data;
};

export const getDAO = async (address: string | undefined) => {
    return data.find((dao) => dao.address === address);
};
