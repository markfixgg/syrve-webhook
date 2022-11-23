import { IDeliveryItem, ISyrveNomenclatureSpace, ITildaProduct } from "../types";
import { database } from "../config/database";

import stringSimilarity = require("string-similarity");
import config from "../config";

export const to = (promise: Promise<any>) => promise.then((data) => [null, data]).catch((error) => [error]);

export const findStreet = (name: string): string => {
    const streets: any = database.get('streets');
    if (streets[name]) return streets[name];

    const { bestMatch: { target, rating } } = stringSimilarity.findBestMatch(name, Object.keys(streets));
    if (target && rating > 0.65) return streets[target]

    return config.SYRVE.streets.undefined;
}

export const prepareItems = (products: ITildaProduct[], isDelivery: boolean, amount: number): IDeliveryItem[] => {
    const nomenclature: ISyrveNomenclatureSpace.RootObject = database.get('nomenclature');

    const items = products.reduce((array: IDeliveryItem[], product) => {
        const [ SKU, language ]: any[] = product.sku.split('_');
        if (!['UKR', 'RUS'].includes(language)) return array;

        const predicates = nomenclature.products.filter((pred) => pred.code.includes(SKU))

        const [ desired ] = predicates.filter((row) => {
            const group = nomenclature.groups.find((pred) => pred.id === row.parentGroup);

            // @ts-ignore
            return group.parentGroup === config.SYRVE.menu_lang[language];
        })

        if (desired) {
            const deliveryItem: IDeliveryItem = {
                productId: desired.id,
                type: 'Product',
                amount: Number(product.quantity)
            }

            if (product.options && product.options.length) {
                const modifiers = desired.groupModifiers.map(({ childModifiers, id, ...row }: any) => {
                    childModifiers = childModifiers.map((row: any) => nomenclature.products.find((x) => x.id === row.id))
                    childModifiers = childModifiers.map((row: any) => ({ ...row, productGroupId: id }))

                    return childModifiers;
                }).flat();

                deliveryItem.modifiers = product.options.reduce((array: any[], { variant, quantity = 1 }) => {
                    const { bestMatch } = stringSimilarity.findBestMatch(variant, modifiers.map((row) => row.name));
                    if (!bestMatch.target) return array;

                    const modifier = modifiers.find((x) => x.name === bestMatch.target);

                    if (modifier) array.push({
                        productId: modifier.id,
                        productGroupId: modifier.productGroupId,
                        amount: quantity
                    });

                    return array;
                }, [])

                // Required mandatory "Group Modifiers"
                desired.groupModifiers
                    .filter((x) => x.required)
                    .filter((x) => !deliveryItem.modifiers?.find((pred) => pred.productGroupId === x.id))
                    .map((item) => deliveryItem.modifiers?.push({
                        productGroupId: item.id,
                        productId: item.childModifiers[0].id,
                        amount: 1
                    }))
            }

            if (desired.modifiers.length && desired.modifiers.some((x) => x.required)) {
                if (!deliveryItem.modifiers || !Array.isArray(deliveryItem.modifiers)) deliveryItem.modifiers = [];

                desired.modifiers
                    .filter((x) => x.required)
                    .map((item) => deliveryItem.modifiers?.push({
                        productId: item.id,
                        amount: item.defaultAmount
                    }))
            }

            array.push(deliveryItem);
        }
        return array;
    }, []);

    if (isDelivery && Number(amount) < 349) items.push({
        productId: config.SYRVE.products.delivery,
        type: "Product",
        amount: 1
    })

    return items
}