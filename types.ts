export interface ITildaOrder {
    name: string;
    one_click?: string;
    mark: string;
    lang: string;
    phone: string;
    deliveryvar: string;
    dcity: string;
    dstreet: string;
    dhouse: string;
    dapt: string;
    comment: string;
    paymentsystem: string;
    payment: Payment;
    formid: string;
    formname: string;
}

export interface Payment {
    orderid: string;
    products?: (ProductsEntity)[] | null;
    amount: string;
    subtotal: string;
    delivery: string;
    delivery_price: string;
    delivery_fio: string;
    delivery_address: string;
    delivery_comment: string;
}

export interface ProductsEntity {
    name: string;
    quantity: string;
    amount: string;
    price: string;
    sku: string;
    options?: ({
        option: string;
        variant: string;
    })[] | null;
}

export interface ISyrveAccessToken {
    correlationId: string;
    token: string
}

export interface ISyrveOrganizations {
    correlationId: string;
    organizations?: ({
        responseType: string;
        id: string;
        name: string;
    })[] | null;
}

export interface IDeliveryCreatePayload {
    organizationId: string;
    terminalGroupId: string;
    order: {
        orderTypeId: string;
        phone: string;
        deliveryPoint?: {
            address?: {
                street: {
                    id: string;
                    name?: string;
                    city?: string;
                };
                house: string;
                flat?: string;
            }
            comment?: string;
        } | null;
        comment?: string;
        customer: {
            name: string;
            type: 'one-time'
        };
        payments: {
            paymentTypeKind: "Cash" | "Card"
            sum: number;
            paymentTypeId: string;
        }[] | [];
        items: IDeliveryItem[];
    }
}

export interface IDeliveryItem {
    productId: string;
    type: "Product";
    price?: number;
    name?: string;
    amount: number;
    comment?: string;
    modifiers?: {
        productId: string;
        name?: string;
        amount: number;
        productGroupId?: string;
    }[];
}

export interface ITildaProduct {
    name: string;
    quantity: string;
    amount: string;
    price: string;
    sku: string;
    options?: (OptionsEntity)[] | null;
}
export interface OptionsEntity {
    option: string;
    variant: string;
    quantity?: number;
}

export namespace ISyrveNomenclatureSpace {
    export interface Group {
        imageLinks: any[];
        parentGroup: string;
        order: number;
        isIncludedInMenu: boolean;
        isGroupModifier: boolean;
        id: string;
        code: string;
        name: string;
        description: string;
        additionalInfo?: any;
        tags: any[];
        isDeleted: boolean;
        seoDescription?: any;
        seoText?: any;
        seoKeywords?: any;
        seoTitle?: any;
    }

    export interface ProductCategory {
        id: string;
        name: string;
        isDeleted: boolean;
    }

    export interface Price {
        currentPrice: number;
        isIncludedInMenu: boolean;
        nextPrice?: any;
        nextIncludedInMenu: boolean;
        nextDatePrice?: any;
    }

    export interface SizePrice {
        sizeId?: any;
        price: Price;
    }

    export interface Modifier {
        id: string;
        defaultAmount: number;
        minAmount: number;
        maxAmount: number;
        required: boolean;
        hideIfDefaultAmount: boolean;
        splittable: boolean;
        freeOfChargeAmount: number;
    }

    export interface ChildModifier {
        id: string;
        defaultAmount: number;
        minAmount: number;
        maxAmount: number;
        required: boolean;
        hideIfDefaultAmount: boolean;
        splittable: boolean;
        freeOfChargeAmount: number;
    }

    export interface GroupModifier {
        id: string;
        minAmount: number;
        maxAmount: number;
        required: boolean;
        childModifiersHaveMinMaxRestrictions: boolean;
        childModifiers: ChildModifier[];
        hideIfDefaultAmount: boolean;
        defaultAmount: number;
        splittable: boolean;
        freeOfChargeAmount: number;
    }

    export interface Product {
        fatAmount: number;
        proteinsAmount: number;
        carbohydratesAmount: number;
        energyAmount: number;
        fatFullAmount: number;
        proteinsFullAmount: number;
        carbohydratesFullAmount: number;
        energyFullAmount: number;
        weight: number;
        groupId: string;
        productCategoryId: string;
        type: string;
        orderItemType: string;
        modifierSchemaId?: any;
        modifierSchemaName?: any;
        splittable: boolean;
        measureUnit: string;
        sizePrices: SizePrice[];
        modifiers: Modifier[];
        groupModifiers: GroupModifier[];
        imageLinks: string[];
        doNotPrintInCheque: boolean;
        parentGroup: string;
        order: number;
        fullNameEnglish: string;
        useBalanceForSell: boolean;
        canSetOpenPrice: boolean;
        id: string;
        code: string;
        name: string;
        description: string;
        additionalInfo?: any;
        tags: any[];
        isDeleted: boolean;
        seoDescription: string;
        seoText?: any;
        seoKeywords?: any;
        seoTitle?: any;
    }

    export interface RootObject {
        correlationId: string;
        groups: Group[];
        productCategories: ProductCategory[];
        products: Product[];
        sizes: any[];
        revision: number;
    }
}
