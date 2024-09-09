import {Op, Sequelize} from "sequelize";

import {
    ACTIVATION_CODES,
    ActivationCodesModel,
    DiscountsModel,
    ProductsModel,
    RENTAL_STATUS,
    RentalsModel,
    STATUS,
    SUBSCRIPTION_STATUS,
    UserDiscountsModel,
    UsersModel,
    UserSubscriptionsModel
} from "@bikairproject/lib-manager";

export const createDiscounts = async (userId: number, body: any, locale: string) => {
    try {
        if (!body.code) {
            console.log("No discount code provided");
            return {
                statusCode: 409,
                result: "UNKNOWN_DISCOUNT_CODE"
            };
        }

        // Check if the promo code hase passed the max_usage and send an error to the front if someone tries to send a promo code
        // Check if the promo code hase passed the max_usage and send an error to the front if someone tries to send a promo code
        const user = await UsersModel.findByPk(userId);
        const discount = await DiscountsModel.findOne({
            where: {
                code: body.code
            }
        });

        // discount.max_usage === 0  -> code does not have a limit
        // discount.max_usage > 0    -> code does have a limit
        if (discount && discount.max_usage > 0) {
            const userSubscription = await UserDiscountsModel.count({
                where: {
                    discount_id: discount.id
                }
            });

            if (typeof discount.max_usage !== "undefined" && userSubscription > discount.max_usage) {
                return {
                    statusCode: 400,
                    result: "DISCOUNT_CODE_EXPIRED"
                };
            }
        }

        if (!user) {
            return {
                statusCode: 404,
                result: "NO_USER_FOUND"
            };
        }

        if (body.code === user.code) {
            console.log("Own sponsor code given-------------");
            return {
                statusCode: 400,
                result: "ASSIGN_OWNED_CODE"
            };
        }


        const activationCode = await ActivationCodesModel.findOne({
            where: {
                code: body.code,
                used: false
            }
        });
        if (activationCode && activationCode.type === ACTIVATION_CODES.RENTAL) {
            const userRental = await RentalsModel.findByPk(activationCode.target_id);
            const userRentals = await RentalsModel.findAll({
                where: {
                    user_id: userId,
                    status: [RENTAL_STATUS.LINKED, RENTAL_STATUS.USED]
                }
            });
            let canActivateCode = true;
            let statusCode = 201;
            let message = "RENTAL_CREATED_SUCCESS";
            if (!userRental?.start_time || !userRental?.end_time) {
                return {
                    statusCode: 409,
                    result: "MISSING_PARAMS"
                };
            }
            const startTime = userRental.start_time;

            for (let i = 0; i < userRentals.length; i++) {
                const _end = userRentals[i].end_time;
                if ((startTime < _end)) {
                    canActivateCode = false;
                    statusCode = 200;
                    message = "ALREADY_HAVE_RENTAL";
                }
            }

            if (canActivateCode) {
                await RentalsModel.update({
                    user_id: userId,
                    status: RENTAL_STATUS.LINKED
                }, {
                    where: {
                        id: activationCode.target_id
                    }
                });
                await ActivationCodesModel.update({
                    used: true
                }, {
                    where: {
                        id: activationCode.id
                    }
                });
            }

            return {
                statusCode: statusCode,
                result: message
            };
        }

        if (activationCode && activationCode.type === ACTIVATION_CODES.PRODUCT) {
            const product = await ProductsModel.findByPk(activationCode.target_id);
            if (product) {
                await UserSubscriptionsModel.create({
                    user_id: userId,
                    product_id: product.id,
                    city_id: user.city_id,
                    status: SUBSCRIPTION_STATUS.ACTIVE,
                    discount_id: product.discount_id,
                    discount_value: product.discount_value,
                    discount_type: product.discount_type,
                    price: 0,
                    recurring: product.recurring,
                    max_usage: product.max_usage,
                    name: product.name
                });
            }

            return {
                statusCode: 201,
                result: "ACTIVE_CODE_SUBSCRIPTION_CREATED"
            };
        }

        const sponsorUser = await UsersModel.findOne({
            where: {
                code: body.code
            }
        });

        const isSponsorCode = sponsorUser !== null;
        const code = isSponsorCode ? "SPONSOR" : body.code;
        let whereClause = {};
        if (activationCode && activationCode.type === ACTIVATION_CODES.DISCOUNT) {
            whereClause = {id: activationCode.target_id};
        } else {
            whereClause = {code: code};
        }
        const findCode = await DiscountsModel.findOne({
            where: {
                ...whereClause,
                status: STATUS.ACTIVE,
                [Op.or]: [
                    {expired_at: {[Op.is]: null}},
                    {expired_at: {[Op.gte]: new Date()}}
                ]
            }
        });

        if (findCode === null) {
            console.log(`Unknown discount code ${body.code.toUpperCase()}`);
            return {
                statusCode: 400,
                result: "UNKNOWN_DISCOUNT_CODE"
            };
        }

        const usedCode = await UserDiscountsModel.findOne({
            where: {
                user_id: userId,
                discount_id: findCode.id
            }
        });
        if (usedCode !== null) {
            return {
                statusCode: 400,
                result: "DISCOUNT_ALREADY_ASSIGNED"
            };
        }

        const userDiscount = await UserDiscountsModel.create({
            user_id: userId,
            discount_id: findCode.id,
            remaining: findCode.value,
            status: STATUS.ACTIVE,
            code_ref: body.code
        });

        return {
            statusCode: 200,
            result: {
                code: findCode.code,
                discount_id: userDiscount.discount_id,
                value: findCode.value,
                type: findCode.type,
                remaining: userDiscount.remaining,
                id: userDiscount.id,
                reusable: findCode.reusable,
                expired_at: findCode.expired_at ? findCode.expired_at : null
            }
        };
    } catch (error) {
        console.log("[ERROR] userId : ", userId);
        console.log("[ERROR] locale : ", locale);
        console.log("[ERROR] body : ", body);
        throw error;
    }
};
