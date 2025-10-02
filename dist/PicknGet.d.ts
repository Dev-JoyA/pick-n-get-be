export declare const abi: ({
    type: string;
    name: string;
    inputs: {
        type: string;
        name: string;
    }[];
    anonymous?: undefined;
    stateMutability?: undefined;
    constant?: undefined;
    payable?: undefined;
    outputs?: undefined;
} | {
    type: string;
    anonymous: boolean;
    name: string;
    inputs: {
        type: string;
        name: string;
        indexed: boolean;
    }[];
    stateMutability?: undefined;
    constant?: undefined;
    payable?: undefined;
    outputs?: undefined;
} | {
    type: string;
    stateMutability: string;
    name?: undefined;
    inputs?: undefined;
    anonymous?: undefined;
    constant?: undefined;
    payable?: undefined;
    outputs?: undefined;
} | {
    type: string;
    name: string;
    constant: boolean;
    payable: boolean;
    inputs: {
        type: string;
        name: string;
    }[];
    outputs: never[];
    anonymous?: undefined;
    stateMutability?: undefined;
} | {
    type: string;
    name: string;
    constant: boolean;
    stateMutability: string;
    payable: boolean;
    inputs: {
        type: string;
        name: string;
    }[];
    outputs: {
        type: string;
        name: string;
    }[];
    anonymous?: undefined;
})[];
//# sourceMappingURL=PicknGet.d.ts.map