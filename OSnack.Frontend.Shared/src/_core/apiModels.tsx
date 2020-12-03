export abstract class OrderAddressBase {
    name!: string;
    firstLine!: string;
    secondLine?: string | undefined;
    city!: string;
    postcode!: string;

}
export class Address extends OrderAddressBase {
    id?: number;
    isDefault?: boolean;
    instructions?: string | undefined;
    userId?: number;

}
