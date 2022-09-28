import { ParsedUrlQuery } from "querystring";

export interface QueryUrlParams extends ParsedUrlQuery {
    address: string;
}