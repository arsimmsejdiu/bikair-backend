import {QueryTypes} from "sequelize";

import {GetPaymentMethodsOutput, GetRentalOutput, getSequelize, GetTripDepositOutput, PaymentMethodsModel, Rentals, STATUS, TripDepositsModel} from "@bikairproject/lib-manager";


export const findRentalGroup = async (userId: number): Promise<void> => {
    const now = Date.now();
    const userRental = await getSequelize().query<GetRentalOutput>(`
        select *
        from rentals
        where user_id = :user_id
          and start_time < :now
          and status in ('LINKED', 'USED')
    `, {
        replacements: {
            user_id: userId,
            now: now
        },
        plain: true,
        raw: true,
        type: QueryTypes.SELECT
    });

    if (!userRental) return;

    const groupRentals = await getSequelize().query<Rentals>(`
        select *
        from rentals
        where customer_email = :customer_email
          and start_time = :start_time
          and end_time = :end_time
          and user_id != :userRentalId
    `, {
        replacements: {
            customer_email: userRental?.customer_email,
            userRentalId: userRental?.user_id,
            end_time: userRental?.end_time,
            start_time: userRental?.start_time

        },
        plain: false,
        raw: false,
        type: QueryTypes.SELECT
    });

    if (!groupRentals) return;

    const currentUserPm: GetPaymentMethodsOutput | null = await PaymentMethodsModel.findOne({
        where: {
            user_id: userId,
            status: STATUS.ACTIVE
        }
    });
    for (const _user of groupRentals) {
        if (_user.user_id) {
            const pmUser: GetPaymentMethodsOutput | null = await PaymentMethodsModel.findOne({
                where: {
                    user_id: _user.user_id,
                    status: STATUS.ACTIVE
                }
            });
            // => créer une copie du deposit avec les mêmes infos que pour le user "r"
            if (pmUser?.last_4 && currentUserPm?.last_4) {
                const piUser: GetTripDepositOutput | null = await TripDepositsModel.findOne({
                    where: {
                        user_id: _user.user_id,
                        status: STATUS.ACTIVE
                    }
                });
                await TripDepositsModel.create({
                    payment_intent: piUser?.payment_intent,
                    user_id: userId,
                    status: piUser?.status ?? STATUS.INACTIVE
                });
                return;
            }
        }
    }
    return;
};
