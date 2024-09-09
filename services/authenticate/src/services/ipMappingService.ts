import { IP_MAPPING_AMOUNT_THRESHOLD, IP_MAPPING_CHECK_LENGTH } from "../config/config";
import { IpMappingModel } from "@bikairproject/lib-manager";

export const checkingIpMatchWithPhone = async (ip, phone, country) => {
    console.log("Checking if ip is register...");
    const ipMapping = await IpMappingModel.findOne({
        where: {
            ip: ip
        }
    });

    // If the ip has not been register we can save it and return true
    if (!ipMapping) {
        console.log("Saving new ip mapping...");
        await IpMappingModel.create({
            ip: ip,
            country: country,
            phone: phone,
            number_attempts: 1
        });
        return true;
    }

    // 1. If ip exist but the phone is not matching the register phone return false
    // 2. Ensure the number of attempts this mapping is lower than 3
    // 3. Ensure ip has not been blocked already
    if ((ipMapping.number_attempts ?? 1) > IP_MAPPING_AMOUNT_THRESHOLD) {
        if(typeof ipMapping.phone === "undefined" || ipMapping.phone === null) {
            throw new Error(
                "IP: " + ip + " : has not matching phone"
            );
        }
        const sliceLength = -1 * IP_MAPPING_CHECK_LENGTH;
        if(ipMapping.phone.slice(sliceLength) !== phone.slice(sliceLength) || ipMapping.is_blocked){
            console.log("Phone does not match : ");
            console.log("Phone from DB : ", ipMapping.phone);
            console.log("Phone from request : ", phone);
            await IpMappingModel.update(
                {
                    is_blocked: true,
                    number_attempts: (ipMapping.number_attempts ?? 0) + 1
                },
                {
                    where: {
                        id: ipMapping.id
                    }
                }
            );
            if (ipMapping.phone.slice(sliceLength) !== phone.slice(sliceLength))
                throw new Error(
                    "IP: " +
                    ip +
                    " : Phone does not match : " +
                    ipMapping.phone +
                    " !==" +
                    phone
                );
            if (ipMapping.is_blocked)
                throw new Error(
                    "IP: " + ip + " : has already been blocked today"
                );
            if ((ipMapping.number_attempts ?? 0) >= IP_MAPPING_AMOUNT_THRESHOLD)
                throw new Error(
                    "IP: " +
                    ip +
                    ` : tried to authenticate more than ${IP_MAPPING_AMOUNT_THRESHOLD} times today`
                );
        }
    }

    // Update the number of time this mapping ip/phone tried to authenticate
    await IpMappingModel.update(
        {
            number_attempts: (ipMapping.number_attempts ?? 0) + 1
        },
        {
            where: {
                id: ipMapping.id
            }
        }
    );

    return true;
};
