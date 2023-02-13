import { findStreet, prepareItems, to } from "../../modules";
import { IDeliveryCreatePayload } from "../../types";
import { Request, Response } from "express";

import syrveApi from "../../modules/SyrveApi";
import config from "../../config";

const webhook = async (req: Request, res: Response) => {
    console.log(JSON.stringify(req.body));

    const phone = req.body["phone"] || req.body["one_click"];

    console.log(`Phone: ${phone}`)

    if(req.body.test || !Object.keys(req.body).length) {
        console.log('Initiate request');

        return res.status(200).send({ success: true });
    }

    if(!phone) {
        console.log(`Phone not found in body: `, phone)

        return res.status(200).send({ success: false, error: "Phone not found" });
    }

    const type = req.body["phone"] ? "full_order" : "one_click";
    console.log(`Type: ${type}`)

    const delivery = type === "one_click" ? oneClickOrder(phone) : await fullOrder(req.body);

    const [ error, result ] = await to(syrveApi.create_delivery(delivery));

    if(error) {
        console.error(error)

        return res.send( { success: false, error })
    }

    console.log(JSON.stringify(delivery, null, 2))

    console.log(JSON.stringify(result, null, 2))

    res.send(result)
}


function oneClickOrder(phone: string): IDeliveryCreatePayload {
    return {
        organizationId: config.SYRVE.organizationId,
        terminalGroupId: config.SYRVE.terminalGroupId,
        order: {
            phone,
            comment: "| NEW | ЗАКАЗ В ОДИН КЛИК | NEW |",
            orderTypeId: config.SYRVE.order_types.deliveryByCourier,
            deliveryPoint: {
                address: {
                    street: {
                        id: "78d6bf50-164e-408e-9638-c0133ea3c320"
                    },
                    house: "00"
                }
            },
            customer: {
                name: "Новый гость",
                type: 'one-time'
            },
            payments: [],
            items: [
                {
                    productId: config.SYRVE.products.one_click,
                    price: 0,
                    type: 'Product',
                    amount: 1
                }
            ]
        }
    }
}

async function fullOrder(body: any): Promise<IDeliveryCreatePayload> {
    const { name = "", phone = "", deliveryvar = "", dstreet = "", dcity = "Харьков", dhouse = "00", dapt = "", comment = "", paymentsystem = "cash", payment = { amount: 0, products: [] } } = body;

    const address = `${[dcity, dstreet, dhouse, dapt].filter(Boolean).join(', ')}`;
    const paymentType = paymentsystem === "cash" ? "наличными" : "картой";

    const isDelivery = ['Доставка по адресу', 'Доставка за адресою'].some((item) => deliveryvar.includes(item));

    const items: any = prepareItems(payment.products, isDelivery, payment.amount);
    const street: string = findStreet(dstreet);

    const deliveryPoint = isDelivery ? {
        address: {
            street: {
                city: dcity,
                id: street
            },
            house: dhouse,
            flat: dapt
        },
        comment: `| NEW | ${deliveryvar} | NEW |\n${address}\nОплата: ${paymentType}`
    } : null;

    return {
        organizationId: config.SYRVE.organizationId,
        terminalGroupId: config.SYRVE.terminalGroupId,
        order: {
            phone,
            items,
            deliveryPoint,
            orderTypeId: isDelivery ? config.SYRVE.order_types.deliveryByCourier : config.SYRVE.order_types.deliveryPickUp,
            comment: `| NEW | Комментарий клиента: ${comment} | Доставка: ${address} | Оплата: ${paymentType} | NEW |`,
            customer: { name, type: "one-time" },
            payments: [
                {
                    paymentTypeKind: "Card",
                    sum: +payment.amount,
                    paymentTypeId: config.SYRVE.payments.card
                }
            ],
        }
    }
}

export default {
    webhook
}